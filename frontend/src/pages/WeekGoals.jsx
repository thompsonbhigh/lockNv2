import { useState, useEffect } from 'react'

const WeekGoals = ({ goalInfo, handleComplete, handleDelete, newGoal, setNewGoal, handleNewGoal }) => {

    const goalArray = Array.isArray(goalInfo.goals) ? goalInfo.goals : [];

    const filteredGoals = goalArray.filter(goal => 
        goal.type === 'weekly' && goal.status === false
    );

    const goalList = filteredGoals.map(goal => 
        <tr key={goal.id}>
            <td style={{textAlign: 'center', width: 3 + 'vh'}}>
                <button onClick={e => handleComplete(goal.id)}>✓</button>
            </td>
            <td>
                {goal.goal}
            </td>
            <td style={{textAlign: 'right'}}>
                <button onClick={e => handleDelete(goal.id)}>−</button>
            </td>
        </tr>
    );

    return (
        <section>
            <div>
                <table>
                    <tbody>
                        {goalList}
                    </tbody>
                </table>
                {/* <% if (isEmpty.weekly) { %>
                    <p>You haven't added any goals yet!</p>
                <% } else if (!incompleteWeeklyGoals) { %>
                    <p>You've completed all your weekly goals!</p>
                <% } %> */}
                    <div class='new-task'>
                        <input type="text" placeholder="enter a goal" value={newGoal} required onChange={e => setNewGoal(e.target.value)}/>
                        <button onClick={e => handleNewGoal('weekly')}>+</button>
                    </div>
            </div>
        </section>
    )
}

export default WeekGoals