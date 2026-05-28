import { Link } from 'react-router-dom';
import { useEffect } from "react";

const Home = ({userInfo}) => {

    return (
        <section>
            <h1 class="home-name">LOCKN</h1>
            <div class="flex-container">
                <div class="home-card">
                    <h2>fitness</h2>
                    <p>rank: <span>{userInfo.workoutRank}</span></p>
                    <Link to='/fitness' />
                </div>

                <div class="home-card">
                    <h2>tasks</h2>
                    <p>rank: <span>{userInfo.taskRank}</span></p>
                    <Link to='/tasks' />
                </div>

                <div class="home-card">
                    <h2>goals</h2>
                    <p>rank: <span>{userInfo.goalRank}</span></p>
                    <Link to='/goals/week' />
                </div>
            </div>
            <div class="path-flex">
                <div class="home-card">
                    <h2>rankings</h2>
                    <p></p>
                    <a href="/leaderboard"></a>
                </div>
                <div class="home-card">
                    <h2>groups</h2>
                    <p>coming soon</p>
                    {/* <a href="/groups"></a> */}
                </div>
            </div>
        </section>
    )
}

export default Home;