import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({setIsLoggedIn, setUser}) {
    const [incorrectLogin, setIncorrectLogin] = useState();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const backend = process.env.BACKEND_URL;
    
    const navigate = useNavigate();

    async function tryLogin(event) {
        event.preventDefault();
        try {
            const response = await fetch(`${backend}/login`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            const loginInfo = await response.json();
            if (loginInfo.failed) {
                setIncorrectLogin(loginInfo.message);
            } else {
                setUser(loginInfo);
                setIsLoggedIn(true);
                navigate('/home', {replace: true});
            }

        } catch (err) {
            console.error('Failed to get login info: ', err);
        }
    }

    return (
        <section>
            <div class="login-container">
                <h2>Login to Your Account</h2>
                <p>{incorrectLogin}</p>
                <form onSubmit={tryLogin}>
                    <div>
                        <input type="text" size="20%" placeholder="Username" name="uname" required onChange={e => setUsername(e.target.value)}/>
                    </div>

                    <div>
                        <input type="password" size="20%" placeholder="Password"  name="psw" required onChange={e => setPassword(e.target.value)}/>
                    </div>

                    <button type="submit">Login</button>
                </form>
                <a href="../createAccount">Create Account</a>
            </div>
        </section>
    )
}