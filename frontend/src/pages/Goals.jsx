import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const Goals = ({ userInfo, goalInfo }) => {
    const tabsStyle = ({ isActive }) => ({
        color: isActive ? '#F8F9FA' : '#495057',
        backgroundColor: 'transparent',
        border: 'none',
        textAlign: 'center',
        textDecoration: 'none'
    });

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
                    <NavLink to='/goals/week' style={tabsStyle} end>Week</NavLink>
                    <NavLink to='/goals/month' style={tabsStyle} end>Month</NavLink>
                    <NavLink to='/goals/year' style={tabsStyle} end>Year</NavLink>
                </div>
                <Outlet />

            </div>
        </div>
        </section>
    )
}

export default Goals