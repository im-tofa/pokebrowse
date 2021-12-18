const cors = require('cors');
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();

const bcrypt = require('bcrypt');
const { Sequelize } = require('sequelize');
const { Pool, Client } = require('pg');
const pool = new Pool();

const https = require("https");
const fs = require("fs");
const path = require('path');
require('dotenv').config({path: path.join(__dirname, '..', '..', '..', '..', 'configs', '.env')});
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, '..', '..', '..', '..', 'configs', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, '..', '..', '..', '..', 'configs', 'cert.pem')),
}

const jwt = require('jsonwebtoken');
const { toID } = require('../PSUtils');

app.use(cors({
    origin: 'https://localhost:8080',
    credentials: true
}));

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use(express.json({
    type: "application/json"
}));

app.post('/token', async (req, res) => {
    // `accessToken=${accessToken}; HttpOnly; Domain; Secure; SameSite=Strict`
    const token = req.cookies.refreshToken;
    if(!token) return res.sendStatus(401);

    try {
        const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);        
        const val = await pool.query('SELECT user_id, user_name, user_token_version FROM users WHERE user_name=$1', [payload.name]);
        console.log("hej 1")
        if(val.rows.length === 0) return res.sendStatus(403); // user does not exist
        console.log("hej 2")
        // if the refresh token version does not match the latest one, 
        // someone is trying to use an old token. Do not allow. Note that
        // this does not revoke the latest version of the refresh token.
        // And refresh token versions won't update unless explicitly stated.
        if(val.rows[0].user_token_version !== payload.token_version) return res.sendStatus(403);
        console.log("hej 3")
        const accessToken = generateAccessToken({id: payload.id, name: payload.name});

        // sen updated refresh token as long as user actively asks for refreshed access token
        sendRefreshToken(res, generateRefreshToken({id: payload.id, name: payload.name, token_version: payload.token_version}))
        return res.json({ accessToken });
    } catch (error) {
        console.log(error);
        return res.sendStatus(403);
    }
});

app.post('/register', async (req, res) => {
    console.log("recieved register request");
    const username = toID(req.body.username);
    const password = req.body.password;

    try {
        const val = await pool.query('SELECT user_name FROM users WHERE user_name=$1', [username]);
        if(val.rows.length !== 0) return res.sendStatus(422); // user already exists
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users(user_name, user_pw) VALUES ($1, $2)', [username, hashedPassword]);
        console.log(`Created user ${username}!`);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.sendStatus(422);
    }
});

app.post('/login', async (req, res) => {
    // Authenticate first
    const username = toID(req.body.username);
    const password = req.body.password;

    let id = '';
    let token_version = -1;

    try {
        const val = await pool.query('SELECT user_id, user_name, user_pw, user_token_version FROM users WHERE user_name=$1', [username]);
        if(val.rows.length === 0) return res.sendStatus(422); // user does not exist
        if(!await bcrypt.compare(password, val.rows[0].user_pw)) return res.sendStatus(422);
        id = val.rows[0].user_id;
        token_version = val.rows[0].user_token_version;
        // TODO: Alter last login time
        // await pool.query('INSERT INTO users(user_name, user_pw) VALUES ($1, $2)', [username, hashedPassword]);
        console.log(`User ${username} signed in!`);
        // TODO: store refresh token in database table
        res.status(200);
    } catch (err) {
        console.error(err);
        return res.sendStatus(422);
    }

    // Then return JWT

    // console.log(req.body.username);
    const name = username;
    const user = { id, name };
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken({token_version, ...user});
    sendRefreshToken(res, refreshToken);
    return res.json({ accessToken });
});

app.post('/logout', async (req, res) => {
    // Authenticate first
    const token = req.cookies.refreshToken;
    if(!token) return res.sendStatus(401);

    try {
        const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);        
        const val = await pool.query('SELECT user_id, user_name, user_token_version FROM users WHERE user_name=$1', [payload.name]);
        if(val.rows.length === 0) return res.sendStatus(403); // user does not exist
        // if the refresh token version does not match the latest one, 
        // someone is trying to use an old token. Do not allow. Note that
        // this does not revoke the latest version of the refresh token.
        // And refresh token versions won't update unless explicitly stated.
        if(val.rows[0].user_token_version !== payload.token_version) return res.sendStatus(403);

        // sen updated refresh token as long as user actively asks for refreshed access token
        sendRefreshToken(res, expireRefreshToken({id: payload.id, name: payload.name, token_version: payload.token_version}));
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(403);
    }
});

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

function generateRefreshToken(user) {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}

function expireRefreshToken(user) {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '0s' });
}

function sendRefreshToken(res, refreshToken) {
    // header info: https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies
    res.setHeader('Set-Cookie', [`refreshToken=${refreshToken}; HttpOnly; Domain; Secure; SameSite=Strict`])
}

//app.listen(4000);
https.createServer(httpsOptions, app).listen(4000);