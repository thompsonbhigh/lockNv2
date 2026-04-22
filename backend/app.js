const express         = require('express'),
      { login, auth } = require('./routes/login.js'),
      plan            = require('./routes/plan.js'),
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
    secret: '72Ghis^%&nDjhs8@^bDj8',
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
app.use('/plan', plan);
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

    userWorkoutRank = userWorkoutInfo.rows.at(0).rank;
    userTaskRank = userTaskInfo.rows.at(0).rank;
    userGoalRank = userGoalInfo.rows.at(0).rank;

    res.json({workoutRank: userWorkoutRank, taskRank: userTaskRank, goalRank: userGoalRank});
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});