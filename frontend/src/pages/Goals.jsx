import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const Goals = ({ userInfo, goalInfo }) => {

    return (
        <section>
        <h1 class="fitness-name">goals</h1>
        <div class="page-grid">

            <div>
                <p>rank: <span>{userInfo.goalRank}</span></p>
                <p>goals completed: <span>{userInfo.goalsCompleted}</span></p>
                <p>week: <span>{goalInfo.goalsWeek}</span></p>
                <p>month: <span>{goalInfo.goalsMonth}</span></p>
                <p>year: <span>{goalInfo.goalsYear}</span></p>
            </div>

            <div class="plan-container" id="goal-plan-container">
                <div class="goal-btns">
                    <NavLink to='/goals/week' end>Week</NavLink>
                    <NavLink to='/goals/month' end>Month</NavLink>
                    <NavLink to='/goals/year' end>Year</NavLink>
                </div>
                <Outlet />

            </div>
        </div>
        </section>
    )
}

export default Goals