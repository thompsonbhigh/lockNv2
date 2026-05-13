const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async function(req, res){
    const { rows } = await db.query('SELECT * FROM exercises ORDER BY muscle ASC');
    const exercises = { exercises: rows };
    res.json(exercises);
});

router.get('/search', async (req, res) => {
    const query = req.query.query;
    const { rows } = await db.query('SELECT * FROM exercises WHERE name ILIKE $1 OR muscle ILIKE $1', [`%${query}%`]);
    const exercises = { exercises: rows };
    res.render('addExercise', exercises);
});

router.post('/', async (req, res) => {
    console.log(req.session);

    let index;
    const exerciseId = req.body.exerciseId;
    const userId = req.session.user.id;
    const day = req.body.day;

    const indexInfo = await db.query('SELECT index FROM workouts WHERE user_id = $1 AND day = $2 ORDER BY index DESC LIMIT 1', [userId, day]);
    if (!indexInfo.rows.at(0)) {
        index = 0;
    } else {
        index = indexInfo.rows.at(0).index + 1;
    }

    await db.query('INSERT INTO workouts (user_id, exercise_id, day, index) VALUES ($1, $2, $3, $4)', [userId, exerciseId, day, index]);
    res.json({msg: 'ok'});
});

module.exports = router;