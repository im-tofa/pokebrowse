const { Sequelize } = require('sequelize');
const { Pool, Client } = require('pg');

require('dotenv').config();

const pool = new Pool();

// you can also use async/await
const res = pool.query('SELECT * FROM users;');
res.then(async (value) => {console.log(value.rows[0]); await pool.end()}, async (err) => {console.error(err); await pool.end()});

// const sequelize = new Sequelize(`postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`) // Example for postgres

// sequelize.authenticate()
//             .then(() => console.log('Connection has been established successfully.'), (error) => console.error('Unable to connect to the database:', error))
//             .finally(() => sequelize.close());