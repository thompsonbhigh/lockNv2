const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db');

router.post('/', async (req, res) => {
    let statusMsg = '';
    let accountStatus = false;
    const username = req.body.username;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    const usernameExistsInfo = await db.query('SELECT COUNT(*) FROM users WHERE username = $1', [username]);
    const usernameExistsCount = usernameExistsInfo.rows.at(0).count;
    if (usernameExistsCount > 0) {
        statusMsg = 'That username is taken'
    } else if (username.length < 5) {
        statusMsg = 'Username must be at least 5 characters';
    } else if (!(password.length >= 8 && /[a-z]+/.test(password) && /[A-Z]+/.test(password) && /\d+/.test(password) && /[^\w\d\s]+/.test(password))) {
        statusMsg = 'Passwords must be at least 8 characters long and contain: uppercase, lowercase, number, special character';
    } else if (!(password === confirmPassword)) {
        statusMsg = 'Passwords do not match';
    }

    const salt = 10;

    bcrypt.hash(password, salt, async function(err, hash) {
        if (err) {
            console.error(err);
            statusMsg = 'There was an error creating your account';
        }
        try {
            await db.query('INSERT INTO users (username, hash) VALUES ($1, $2)', [username, hash]);
            const result = await db.query('SELECT id FROM users WHERE username = $1', [username]);
            const userId = result.rows.at(0).id;
            accountStatus = true;
        } catch (error) {
            console.error(error);
            statusMsg = 'There was an error creating your account';
        }

    });

    res.json({ statusMsg: statusMsg });
});

module.exports = router;