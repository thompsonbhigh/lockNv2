require('dotenv').config();

const express         = require('express'),
      { login, auth } = require('./routes/login.js'),
      fitness            = require('./routes/fitness.js'),
      addExercise     = require('./routes/addExercise.js'),
      createAccount   = require('./routes/createAccount.js'),
      logout          = require('./routes/logout.js'),
      tasks           = require('./routes/tasks.js'),
      goals           = require('./routes/goals.js'),
      leaderboard     = require('./routes/leaderboard.js'),
      db              = require('./db.js'),
      groups          = require('./routes/groups.js'),
      ai              = require('./routes/ai.js');

const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');   
const app = express();
const port = 3000;

app.use(cors({
    origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
    credentials: true,
}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
}));

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use('/login', login);
app.use('/fitness', fitness);
app.use('/addExercise', addExercise);
app.use('/createAccount', createAccount);
app.use('/logout', logout);
app.use('/tasks', tasks);
app.use('/goals', goals);
app.use('/leaderboard', leaderboard);
app.use('/groups', groups);
app.use('/ai', ai);

user = null;
app.get('/', async (req, res) => {
    user = req.cookies.user;
    if (!user) {
        user = 0;
    }
    res.json(user);
});
    
app.post('/user-info', async (req, res) => {
    const username = req.body.username;
    const userId = req.body.id;

    const userWorkoutInfo = await db.query('SELECT rank from workout_leaderboard WHERE username = $1', [username]);
    const userTaskInfo = await db.query('SELECT rank FROM task_leaderboard WHERE username = $1', [username]);
    const userGoalInfo = await db.query('SELECT rank FROM goal_leaderboard WHERE username = $1', [username]);
    const userBasicInfo = await db.query('SELECT tasks_completed, goals_completed, workouts_completed, group_name, last_workout_date, last_workout FROM users WHERE id = $1', [userId]);

    userWorkoutRank = userWorkoutInfo.rows.at(0)?.rank;
    userTaskRank = userTaskInfo.rows.at(0)?.rank;
    userGoalRank = userGoalInfo.rows.at(0)?.rank;
    basicInfo = userBasicInfo.rows.at(0);

    res.json(
        {
            workoutRank: userWorkoutRank,
            taskRank: userTaskRank, 
            goalRank: userGoalRank,
            workoutsCompleted: basicInfo?.workouts_completed,
            tasksCompleted: basicInfo?.tasks_completed,
            goalsCompleted: basicInfo?.goals_completed,
            lastWorkoutDate: basicInfo?.last_workout_date ? basicInfo.last_workout_date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }) : null,
            lastWorkout: basicInfo?.last_workout,
            group: basicInfo?.group_name
        }
    );
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});