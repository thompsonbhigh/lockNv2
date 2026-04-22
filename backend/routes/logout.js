const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    console.log(req.sessionID);
    req.session.destroy((err) => {
        if (err) {
            console.error('Failed to logout: ', err);
        }
    });
});

module.exports = router;