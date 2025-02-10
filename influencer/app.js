const dotenv = require('dotenv');
dotenv.config()
const express = require('express');
const app = express();
const connect = require('./db/db');
connect();
const celebRoutes = require('./router/celeb.router');
const cookieParser = require('cookie-parser');


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use('/',celebRoutes)

module.exports = app