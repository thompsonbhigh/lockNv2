const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const session = require('express-session');
const bcrypt = require('bcrypt');
const db = require('../db');
require('dotenv').config();

let incorrectLogin = null;

const authJWT = (req, res, next) => {
    const token = req.session.user.token;

    if (!token) {
        return res.json({ isLoggedIn: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        return res.json({ isLoggedIn: true, user: req.session.user });
    } catch (error) {
        console.error('Failed to authorize: ', error);
        return res.json({ isLoggedIn: false });;
    }
};

router.get('/auth', (req, res) => {
    const token = req.session?.user?.token;
    console.log('Auth happens here', req.sessionID);

    if (!token) {
        return res.json({ isLoggedIn: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        return res.json({ isLoggedIn: true, user: req.session.user });
    } catch (error) {
        return res.json({ isLoggedIn: false });;
    }
});

router.post('/', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    let user;

    try {
        const { rows } = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        const hashedPassword = rows.at(0).hash;
        const match = await bcrypt.compare(password, hashedPassword);
        if (match) {
            user = {
                id: rows.at(0).id,
                username: rows.at(0).username
            };
        }
    } catch (error) {
        console.error(error);
    }

    if (!user) {
        incorrectLogin = 'Username or password is incorrect'
        return res.json({failed: true, message: incorrectLogin});
    }
    incorrectLogin = null;

    const payload = {
        id: user.id,
        username: user.username
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '24h'});

    req.session.user = {
        id: user.id,
        username: user.username,
        token: token,
    }

    res.json(req.session.user);
});

module.exports = {
    login: router, 
    auth: authJWT
}