import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce";

const CreateAccount = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [statusMsg, setStatusMsg] = useState('');
    const [userDebounce] = useDebounce(username, 1000);
    const [passwordDebounce] = useDebounce(password, 1000);
    const [confirmPasswordDebounce] = useDebounce(confirmPassword, 1000);

    const backend = import.meta.env.VITE_BACKEND_URL;

    const navigate = useNavigate();

    async function tryCreateAcc(event) {
        event.preventDefault();
        try {
            const response = await fetch(`${backend}/createAccount`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    username: username,
                    password: password,
                    confirmPassword: confirmPassword
                }),
            });

            const result = await response.json();
            console.log(result);
            setStatusMsg(result.statusMsg);

            if (result.statusMsg === '') {
                navigate('/login', {replace: true});
            }
        } catch (err) {
            console.error('Failed to create account: ', err);
        }
    };

    useEffect(() => {
        if (username.length < 5) {
            setStatusMsg('Username must be at least 5 characters');
        } else if (!(password.length >= 8 && /[a-z]+/.test(password) && /[A-Z]+/.test(password) && /\d+/.test(password) && /[^\w\d\s]+/.test(password))) {
            setStatusMsg('Passwords must be at least 8 characters long and contain: uppercase, lowercase, number, special character');
        } else if (!(password === confirmPassword)) {
            setStatusMsg('Passwords do not match');
        } else if (statusMsg != 'That username is taken') {
            setStatusMsg('');
        }
    }, [userDebounce, passwordDebounce, confirmPasswordDebounce]);

    return (
        <section>
            <div class="login-container">
                <h2>Create an Account</h2>
                <p>{statusMsg}</p>
                <form onSubmit={tryCreateAcc}>
                    <div>
                        <input type="text" size="20%" placeholder="Username" name="uname" required onChange={e => setUsername(e.target.value)}/>
                    </div>

                    <div>
                        <input type="password" size="20%" placeholder="Password"  name="psw" required onChange={e => setPassword(e.target.value)}/>
                    </div>

                    <div>
                        <input type="password" size="20%" placeholder="Confirm Password"  name="confpsw" required onChange={e => setConfirmPassword(e.target.value)}/>
                    </div>

                    <button type="submit">Create Account</button>
                </form>
                <Link to='/login'>Login</Link>
            </div>
        </section>
    )
}

export default CreateAccount