import { useState, useEffect, Suspense } from 'react'
import './style1.css'
import locknLogo from './assets/lockNWhite-01.png';
import Loading from './components/Loading';
import { Home, Login, Fitness, Tasks, Goals, WeekGoals, MonthGoals, YearGoals, Rankings } from './pages';
import {BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [finishWorkout, setFinishWorkout] = useState(false);
    const [taskInfo, setTaskInfo] = useState({});
    const [goalInfo, setGoalInfo] = useState({});
    const [newGoal, setNewGoal] = useState('');
    const [rankings, setRankings] = useState({});

    const navigate = useNavigate();
    const location = useLocation();

    function HomeTitle() {
        return (
            <h1 class="home-name">LOCKN</h1>
        )
    }

    async function getRankingInfo() {
        try {
            const response = await fetch('http://localhost:3000/leaderboard', { credentials: 'include'});
            const result = await response.json();

            console.log('Rankings: ', result);
            setRankings(result);
        } catch (err) {
            console.error('Failed to get rankings: ', err);
        }
    };

    async function handleNewGoal(goalType) {
        try {
            const response = await fetch('http://localhost:3000/goals/add', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({
                    goal: newGoal,
                    goalType: goalType
                }),
            });
            const result = await response.json();
        } catch (err) {
            console.error('Failed to add task: ', err);
        } finally {
            getGoalInfo();
            setNewGoal('');
        }
    };

    async function handleGoalComplete(id) {
        try {
            const response = await fetch('http://localhost:3000/goals/complete', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({
                    goalid: id
                }),
            });
            const result = response.json();
        } catch (err) {
            console.error('Failed to complete goal: ', err);
        } finally {
            getGoalInfo();
            getUserData();
        }
    };

    async function handleGoalDelete(id) {
        try {
            const response = await fetch('http://localhost:3000/goals/delete', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({
                    goalid: id
                }),
            });
            const result = await response.json();
        } catch (err) {
            console.error('Failed to delete goal: ', err);
        } finally {
            getGoalInfo();
        }
    };

    async function handleLogout() {
        try {
            setIsLoggedIn(false);
            setUserInfo({});
            setUser({});
            const response = await fetch('http://localhost:3000/logout', {credentials: 'include'});
        } catch (err) {
            console.error('Failed to logout: ', err);
        }
    }

    async function getUserData() {
        try {
            const response = await fetch(`http://localhost:3000/user-info`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({
                    id: user.id,
                    username: user.username,
                }),
            });
            const userData = await response.json();
            console.log(userData);
            setUserInfo(userData);
        } catch (err) {
            console.error('Failed to get user data: ', err);
        } finally {
            setLoading(false);
        }
    }

    async function checkIsLoggedIn() {
        try {
            const response = await fetch('http://localhost:3000/login/auth', {credentials: 'include'});
            const loginInfo = await response.json();

            if (loginInfo.isLoggedIn === true) {
                setUser(loginInfo.user);
                setIsLoggedIn(true);

                if (location.pathname === '/') {
                    navigate('/home', {replace: true});
                }

            } else {
                setIsLoggedIn(false);
                navigate('/', {replace: true});
            }
        } catch (err) {
            console.error('Failed to get login info: ', err);
        } finally {
            setLoading(false);
        }
    }

    async function getTaskInfo() {
        try {
            const response = await fetch('http://localhost:3000/tasks', {credentials: 'include'});
            const result = await response.json();
            setTaskInfo(result);
        } catch (err) {
            console.error('Failed to get task info: ', err);
        }
    };

    async function getGoalInfo() {
        try {
            const response = await fetch('http://localhost:3000/goals', {credentials: 'include'});
            const result = await response.json();
            console.log('Goal info: ', result);
            setGoalInfo(result);
        } catch (err) {
            console.error('Failed to get goal info: ', err);
        }
    };

    function handleHomeClick() {
        navigate('/home');
        checkIsLoggedIn();
    }

    useEffect(() => {
        checkIsLoggedIn();
        if (isLoggedIn) {
            setLoading(true);
            getUserData();
            getTaskInfo();
            getGoalInfo();
            getRankingInfo();
        }
    }, [isLoggedIn]);

    useEffect(() => {
        getUserData();
    }, [finishWorkout]);

    let loginContent;
    if (!isLoggedIn) {
        loginContent = <Link to='/login' class="login">login</Link>
    } else {
        loginContent = <Link to='/' class="login" onClick={handleLogout}>logout</Link>
    }

    if (loading) {
        return <Loading />
    }

    return (
        <main>
            <div class="mainHeader">
                <img class="logo" src={locknLogo} onClick={handleHomeClick}/>
                <br/>
                {loginContent}
            </div>

                <Routes>
                    <Route path='/' element={<HomeTitle />} />
                    <Route path='/home' element={<Home userInfo={userInfo} />} />
                    <Route path='/login' element={<Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
                    <Route path='/fitness' element={<Fitness userInfo={userInfo} setFinishWorkout={setFinishWorkout} />} />
                    <Route path='/tasks' element={<Tasks userInfo={userInfo} taskInfo={taskInfo} getTaskInfo={getTaskInfo} getUserData={getUserData} />} />
                    <Route path='/goals' element={<Goals userInfo={userInfo} goalInfo={goalInfo} getGoalInfo={getGoalInfo} getUserData={getUserData} />} >
                        <Route path='week' element={<WeekGoals goalInfo={goalInfo} newGoal={newGoal} setNewGoal={setNewGoal}
                        handleComplete={handleGoalComplete} handleDelete={handleGoalDelete} handleNewGoal={handleNewGoal} />} />
                        <Route path='month' element={<MonthGoals goalInfo={goalInfo} newGoal={newGoal} setNewGoal={setNewGoal}
                        handleComplete={handleGoalComplete} handleDelete={handleGoalDelete} handleNewGoal={handleNewGoal} />} />
                        <Route path='year' element={<YearGoals goalInfo={goalInfo} newGoal={newGoal} setNewGoal={setNewGoal}
                        handleComplete={handleGoalComplete} handleDelete={handleGoalDelete} handleNewGoal={handleNewGoal} />} />
                    </Route>
                    <Route path='/rankings' element={<Rankings rankings={rankings} />} />
                </Routes>

        </main>
    )
}

export default App
