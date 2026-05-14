import { useState, useEffect, Suspense } from 'react'
import './style1.css'
import locknLogo from './assets/lockNWhite-01.png';
import Loading from './components/Loading';
import { Home, Login, Fitness, Tasks } from './pages';
import {BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [finishWorkout, setFinishWorkout] = useState(false);
    const [taskInfo, setTaskInfo] = useState({});

    const navigate = useNavigate();
    const location = useLocation();

    function HomeTitle() {
        return (
            <h1 class="home-name">LOCKN</h1>
        )
    }

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
            console.log(result);
            setTaskInfo(result);
        } catch (err) {
            console.error('Failed to get task info: ', err);
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
                    <Route path='/tasks' element={<Tasks userInfo={userInfo} taskInfo={taskInfo} />} />
                </Routes>

        </main>
    )
}

export default App
