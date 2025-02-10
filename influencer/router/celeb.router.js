const express = require("express");
const Router = express.Router();
const {userauth} = require("../middleware/userauth");
const celebController = require('../controller/celeb.controller');

Router.post('/register', celebController.register);
Router.post('/login', celebController.login);
Router.get("/profile",userauth,celebController.profile);




module.exports = Router;


