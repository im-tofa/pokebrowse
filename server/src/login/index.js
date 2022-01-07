const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
// const https = require("https");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const { toID } = require("../utils/ps-utils");
const ApiError = require("../error/ApiError");
const apiErrorHandler = require("../error/api-error-handler");

require("dotenv").config({
  path: path.join(__dirname, "..", "..", "configs", ".env"),
});

const PORT = process.env.PORT || 4000;
const { Pool } = require("pg");
const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : new Pool();

// const httpsOptions = {
//   key: fs.readFileSync(path.join(__dirname, "..", "..", "configs", "key.pem")),
//   cert: fs.readFileSync(
//     path.join(__dirname, "..", "..", "configs", "cert.pem")
//   ),
// };

app.use(
  cors({
    origin: "https://www.pokebrow.se:8080",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use(
  express.json({
    type: "application/json",
  })
);

app.post("/token", async (req, res, next) => {
  const token = req.cookies.refreshToken;
  if (!token) return next(ApiError.unauthorized("User has not provided a jwt"));

  try {
    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const val = await pool.query(
      "SELECT user_id, user_name, user_token_version FROM users WHERE user_name=$1",
      [payload.name]
    );
    if (val.rows.length === 0)
      return next(ApiError.badRequest("User does not exist")); // user does not exist
    // if the refresh token version does not match the latest one,
    // someone is trying to use an old token. Do not allow. Note that
    // this does not revoke the latest version of the refresh token.
    // And refresh token versions won't update unless explicitly stated.
    if (val.rows[0].user_token_version !== payload.token_version)
      return next(ApiError.forbidden("User attempted to use revoked token"));
    const accessToken = generateAccessToken({
      id: payload.id,
      name: payload.name,
    });

    // send updated refresh token as long as user actively asks for refreshed access token
    sendRefreshToken(
      res,
      generateRefreshToken({
        id: payload.id,
        name: payload.name,
        token_version: payload.token_version,
      })
    );
    return res.json({ accessToken });
  } catch (error) {
    return next(ApiError.forbidden("Rejected jwt"));
  }
});

app.post("/register", async (req, res, next) => {
  // console.log("recieved register request");
  const username = toID(req.body.username);
  const password = req.body.password;

  try {
    const val = await pool.query(
      "SELECT user_name FROM users WHERE user_name=$1",
      [username]
    );
    if (val.rows.length !== 0)
      return next(ApiError.badRequest("User already exist")); // user already exists
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query("INSERT INTO users(user_name, user_pw) VALUES ($1, $2)", [
      username,
      hashedPassword,
    ]);
    console.log(`Created user ${username}!`);
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
});

app.post("/login", async (req, res, next) => {
  // Authenticate first
  const username = toID(req.body.username);
  const password = req.body.password;

  let id = "";
  let token_version = -1;

  try {
    const val = await pool.query(
      "SELECT user_id, user_name, user_pw, user_token_version FROM users WHERE user_name=$1",
      [username]
    );
    if (val.rows.length === 0)
      return next(ApiError.badRequest("User does not exist")); // user does not exist
    if (!(await bcrypt.compare(password, val.rows[0].user_pw)))
      return next(ApiError.badRequest("Incorrect password"));
    id = val.rows[0].user_id;
    token_version = val.rows[0].user_token_version;
    // TODO: Alter last login time
    // await pool.query('INSERT INTO users(user_name, user_pw) VALUES ($1, $2)', [username, hashedPassword]);
    console.log(`User ${username} signed in!`);
    // TODO: store refresh token in database table
    res.status(200);
  } catch (err) {
    return next(err);
  }

  // Then return JWT

  // console.log(req.body.username);
  const name = username;
  const user = { id, name };
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken({ token_version, ...user });
  sendRefreshToken(res, refreshToken);
  return res.json({ accessToken });
});

app.post("/logout", async (req, res, next) => {
  // Authenticate first
  const token = req.cookies.refreshToken;
  if (!token) return next(ApiError.badRequest("User is already signed out"));

  try {
    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const val = await pool.query(
      "SELECT user_id, user_name, user_token_version FROM users WHERE user_name=$1",
      [payload.name]
    );
    if (val.rows.length === 0)
      return next(ApiError.badRequest("User does not exist")); // user does not exist
    // if the refresh token version does not match the latest one,
    // someone is trying to use an old token. Do not allow. Note that
    // this does not revoke the latest version of the refresh token.
    // And refresh token versions won't update unless explicitly stated.
    if (val.rows[0].user_token_version !== payload.token_version)
      return next(ApiError.forbidden("User attempted to use revoked token"));

    // sen updated refresh token as long as user actively asks for refreshed access token
    sendRefreshToken(
      res,
      expireRefreshToken({
        id: payload.id,
        name: payload.name,
        token_version: payload.token_version,
      })
    );
    return res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
});

app.use(apiErrorHandler);

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}

function generateRefreshToken(user) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
}

function expireRefreshToken(user) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "0s" });
}

function sendRefreshToken(res, refreshToken) {
  // header info: https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies
  res.setHeader("Set-Cookie", [
    `refreshToken=${refreshToken}; HttpOnly; Domain; Secure; SameSite=Strict`,
  ]);
}

app.listen(PORT, () => {
  console.log(`login server is running!`);
});
// https.createServer(httpsOptions, app).listen(4000);
