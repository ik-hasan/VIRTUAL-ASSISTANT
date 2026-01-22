const express = require('express');
const { Login, logOut, signUp } = require('../controllers/auth.controllers');

const authRouter = express.Router();

authRouter.post('/signup', signUp);
authRouter.post('/signin', Login);
authRouter.get('/logout', logOut);

module.exports = authRouter;