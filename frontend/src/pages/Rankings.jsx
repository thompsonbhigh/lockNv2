import React from 'react'

const Rankings = ({ rankings }) => {
    const username = rankings.username;

    const workoutRankArray = Array.isArray(rankings.workoutLeaderboard) ? rankings.workoutLeaderboard : [];

    let i = 0;
    const workoutRankings = workoutRankArray.map(row => 
        <tr key={i++}>
            <td style={username === row.username ? {color: 'gold'} : {color: '#F8F9FA'}}>{row.rank}</td>
            <td style={username === row.username ? {color: 'gold'} : {color: '#F8F9FA'}}>{row.username}</td>
            <td style={username === row.username ? {color: 'gold'} : {color: '#F8F9FA'}}>{row.workouts_completed}</td>
        </tr>
    )

    const taskRankArray = Array.isArray(rankings.taskLeaderboard) ? rankings.taskLeaderboard : [];

    const taskRankings = taskRankArray.map(row => 
        <tr key={i++}>
            <td style={username === row.username ? {color: 'gold'} : {color: '#F8F9FA'}}>{row.rank}</td>
            <td style={username === row.username ? {color: 'gold'} : {color: '#F8F9FA'}}>{row.username}</td>
            <td style={username === row.username ? {color: 'gold'} : {color: '#F8F9FA'}}>{row.tasks_completed}</td>
        </tr>
    )

    const goalRankArray = Array.isArray(rankings.goalLeaderboard) ? rankings.goalLeaderboard : [];

    const goalRankings = goalRankArray.map(row => 
        <tr key={i++}>
            <td style={username === row.username ? {color: 'gold'} : {color: '#F8F9FA'}}>{row.rank}</td>
            <td style={username === row.username ? {color: 'gold'} : {color: '#F8F9FA'}}>{row.username}</td>
            <td style={username === row.username ? {color: 'gold'} : {color: '#F8F9FA'}}>{row.goals_completed}</td>
        </tr>
    )

    return (
        <section>
            <h1 class="rankings-name">rankings</h1>
            <div class="leaderboard-container">
                    <table>
                        <thead class="theader">
                            <tr colSpan="3">
                                <th>WORKOUTS</th>
                            </tr>
                        </thead>
                        <thead class="subheader">
                            <tr>
                                <th>Rank</th>
                                <th>Username</th>
                                <th>Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {workoutRankings}
                        </tbody>
                    </table>
                    <table>
                        <thead class="theader">
                            <tr colSpan="3">
                                <th>TASKS</th>
                            </tr>
                        </thead>
                        <thead class="subheader">
                            <tr>
                                <th>Rank</th>
                                <th>Username</th>
                                <th>Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {taskRankings}
                        </tbody>
                    </table>
                    <table>
                        <thead class="theader">
                            <tr colSpan="3">
                                <th>GOALS</th>
                            </tr>
                        </thead>
                        <thead class="subheader">
                            <tr>
                                <th>Rank</th>
                                <th>Username</th>
                                <th>Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {goalRankings}
                        </tbody>
                    </table>
            </div>
        </section>
    )
}

export default Rankings