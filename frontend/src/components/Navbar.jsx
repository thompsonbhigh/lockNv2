import { NavLink, useNavigate } from "react-router-dom";
import locknLogo from '../assets/lockNWhite-01.png';

const Navbar = ({ handleHomeClick, isLoggedIn, handleLogout }) => {

    const navigate = useNavigate();

    const activeLink = ({ isActive }) => ({
        color: isActive ? '#A476FF' : '',
        textDecoration: isActive ? 'underline' : 'none',
        
    });

    const loginBtn = !isLoggedIn ? <button onClick={e => navigate('/login')} className="login-btn">LOGIN</button> : <button onClick={handleLogout} className="login-btn">LOGOUT</button>;

    return (
        <div className="navbar">
            <img class="logo" src={locknLogo} onClick={handleHomeClick}/>
            <div className="navbar-links">
                <NavLink to='/fitness' style={activeLink}>FITNESS</NavLink>
                <NavLink to='/tasks' style={activeLink}>TASKS</NavLink>
                <NavLink to='/goals' style={activeLink}>GOALS</NavLink>
                <NavLink to='/rankings' style={activeLink}>RANKINGS</NavLink>
            </div>
            {loginBtn}
        </div>
    )
}

export default Navbar