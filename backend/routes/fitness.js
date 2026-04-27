const express = require('express');
const router = express.Router();
const db = require('../db');
const { auth } = require('./login');

let workouts = [];
let isEditing = null;
let currDay;

router.get('/', auth, async function(req, res){
    workouts = [];
    isEditing = false;
    const username = req.session.user.username;
    const userId = req.session.user.id;

    const currDate = new Date();
    const today = currDate.toLocaleDateString('en-CA').slice(0, 10);

    const workedOutInfo = await db.query('SELECT last_workout_date FROM users WHERE id = $1', [userId]);
    const lastWorkoutDate = workedOutInfo.rows.at(0).last_workout_date;
    const hasWorkedOutToday = lastWorkoutDate ? lastWorkoutDate.toLocaleDateString('en-CA').slice(0, 10) === today : null;

    const getCurrentInfo = await db.query('SELECT current FROM workouts WHERE user_id = $1 AND current = TRUE', [userId]);
    const currentInfo = getCurrentInfo.rows.at(0);
    if (!currentInfo) {
        await db.query('UPDATE workouts SET current = TRUE WHERE user_id = $1 AND day = (select min(day) from workouts where user_id = 1$)', [userId]);
    }

    const workoutNamesInfo = await db.query('SELECT DISTINCT name, day FROM workouts WHERE user_id = $1 AND current = TRUE ORDER BY day ASC', [userId]);
    const workoutNames = workoutNamesInfo.rows.at(0);
    console.log(workoutNamesInfo);
    const {rows} = await db.query('SELECT exercises.name AS exercise_name, workouts.id, workouts.day, workouts.name FROM workouts JOIN exercises ON workouts.exercise_id = exercises.id WHERE user_id = $1 ORDER BY index ASC',
         [userId]);
    workouts = rows;

    if (!workoutNames) {
        // res.redirect('plan/edit');
    }

    const daysInfo = await db.query('SELECT DISTINCT day FROM workouts WHERE user_id = $1 ORDER BY day', [userId]);
    const dayIndexes = daysInfo.rows;
    let i = 0;
    let incorrectIndex = null;
    dayIndexes.some(day => {
        if (day.day != i) {
            incorrectIndex = i;
            return true;
        }
        i++;
    });

    if (incorrectIndex != null) {
        await db.query('UPDATE workouts SET day = day - 1 WHERE user_id = $1 AND day >= $2', [userId, incorrectIndex]);
    }

    const formattedLastWorkoutDate = lastWorkoutDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return res.json({
        workouts: workouts, 
        workoutNames: workoutNames, 
        hasWorkedOutToday: hasWorkedOutToday, 
        lastWorkoutDate: formattedLastWorkoutDate ? formattedLastWorkoutDate.toString() : null
    });
});

router.post('/', (req, res) => {
    req.session.day = req.body.day;
    res.redirect('../addExercise');
});

router.post('/delete', async (req,res) => {
    console.log(req.body);
    const userId = req.session.user.id;
    const workoutId = req.body.workoutId;

    const deletedIndexInfo = await db.query('DELETE FROM workouts WHERE id = $1 AND user_id = $2 RETURNING index, day', [workoutId, userId]);
    const deletedIndex = deletedIndexInfo.rows.at(0).index;

    await db.query('UPDATE workouts SET index = index - 1 WHERE user_id = $1 AND index > $2 AND day = $3', [userId, deletedIndex, deletedIndexInfo.rows.at(0).day]);
});

router.get('/edit', async (req, res) => {
    if (!currDay) {
        currDay = 0;
    }
    
    const newWorkoutsInfo = await db.query(
        'SELECT exercises.name, workouts.day, workouts.id, workouts.name AS workout_name FROM workouts JOIN exercises ON workouts.exercise_id = exercises.id WHERE user_id = $1 AND day = $2 ORDER BY index ASC',
         [id, currDay]);
    const newWorkouts = newWorkoutsInfo.rows;
    res.render('editWorkout', {workouts: newWorkouts, day: currDay});
});

router.post('/edit', async (req, res) => {
    const editDay = req.body?.editday;
    if (editDay) {
        currDay = editDay;
    } else if (!isEditing) {
        const dayInfo = await db.query('SELECT day FROM workouts WHERE user_id = $1 ORDER BY day DESC LIMIT 1', [userId]);
        currDay = dayInfo.rows.at(0)?.day;
        if (currDay == undefined) {
            currDay = 0;
        } else {
            currDay += 1;
        }
    }
    isEditing = true;
    const newWorkoutsInfo = await db.query(
        'SELECT exercises.name, workouts.day, workouts.id, workouts.name AS workout_name FROM workouts JOIN exercises ON workouts.exercise_id = exercises.id WHERE user_id = $1 AND day = $2 ORDER BY index ASC',
         [id, currDay]);
    const newWorkouts = newWorkoutsInfo.rows;
    res.render('editWorkout', {workouts: newWorkouts, day: currDay});
});

router.post('/confirm', async (req, res) => {
    isEditing = false;
    const name = req.body.workoutname;
    await db.query('UPDATE workouts SET current = FALSE WHERE user_id = $1', [userId]);
    await db.query('UPDATE workouts SET name = $1, current = TRUE WHERE user_id = $2 AND day = $3', [name, userId, currDay]);
    res.redirect('/plan');
});

router.post('/cancel', async (req, res) => {
    await db.query('DELETE FROM workouts WHERE name IS NULL AND user_id = $1', [userId]);
    res.redirect('/plan');
});

router.post('/clear', async (req, res) => {
    await db.query('DELETE FROM workouts WHERE user_id = $1 AND day = $2', [userId, req.body.clearday]);
    res.redirect('/plan/edit');
});

router.post('/back', async (req, res) => {
    const userId = req.session.user.id;
    const currentDay = req.body.currentday;

    await db.query('UPDATE workouts SET current = FALSE WHERE user_id = $1', [userId]);
    
    const leastDayInfo = await db.query('SELECT MIN(day) FROM workouts WHERE user_id = $1', [userId]);
    const leastDay = leastDayInfo.rows.at(0).min;

    let prevDay;
    let prevDayInfo;

    if (currentDay == leastDay) {
        prevDayInfo = await db.query('UPDATE workouts SET current = TRUE WHERE day = (SELECT MAX(day) FROM workouts where user_id = $1) AND user_id = $1 RETURNING name, day', [userId]);
    } else {
        prevDayInfo = await db.query('UPDATE workouts SET current = TRUE WHERE user_id = $1 AND day = $2 RETURNING name, day', [userId, currentDay - 1]);
    }

    prevDay = {
        name: prevDayInfo.rows.at(0).name,
        day: prevDayInfo.rows.at(0).day
    }

    res.json(prevDay);
});

router.post('/next', async (req, res) => {
    const userId = req.session.user.id;
    const currentDay = req.body.currentday;

    const lastDayInfo = await db.query('SELECT MAX(day) FROM workouts WHERE user_id = $1', [userId]);
    const lastDay = lastDayInfo.rows.at(0).max;
    
    let nextDay;
    let nextDayInfo;

    await db.query('UPDATE workouts SET current = FALSE WHERE user_id = $1', [userId]);

    if (currentDay == lastDay) {
        nextDayInfo = await db.query('UPDATE workouts SET current = TRUE WHERE day = 0 AND user_id = $1 RETURNING name, day', [userId]);
    } else {
        nextDayInfo = await db.query('UPDATE workouts SET current = TRUE WHERE user_id = $1 AND day = $2 RETURNING name, day', [userId, Number(currentDay) + 1]);
    }

    nextDay = {
        name: nextDayInfo.rows.at(0).name,
        day: nextDayInfo.rows.at(0).day
    }
    
    res.json(nextDay);
});

router.post('/finish', async (req, res) => {
    const finishDay = req.body.workoutday;
    const finishNameInfo = await db.query('SELECT DISTINCT name FROM workouts WHERE user_id = $1 AND day = $2', [userId, finishDay]);
    const finishName = finishNameInfo.rows.at(0).name;
    await db.query('UPDATE users SET last_workout = $1 WHERE id = $2', [finishName, userId]);

    const currentDate = new Date();
    const today = currentDate.toLocaleDateString('en-CA').slice(0, 10);
    await db.query('UPDATE users SET last_workout_date = $1 WHERE id = $2', [today, userId]);
    await db.query('UPDATE users SET workouts_completed = workouts_completed + 1 WHERE id = $1', [userId]);

    res.redirect('/plan');
})

module.exports = router;