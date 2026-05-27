import { useState, useEffect } from 'react'

const MonthGoals = ({ goalInfo }) => {

    const goalArray = Array.isArray(goalInfo.goals) ? goalInfo.goals : [];

    const filteredGoals = goalArray.filter(goal => 
        goal.type === 'monthly'
    );

    const goalList = filteredGoals.map(goal => 
        <tr key={goal.id}>
            <td style={{textAlign: 'center', width: 3 + 'vh'}}>
                <button>✓</button>
            </td>
            <td>
                {goal.goal}
            </td>
            <td style={{textAlign: 'right'}}>
                <button>−</button>
            </td>
        </tr>
    );

    return (
        <section>
            <div>
                <table>
                    <tbody>
                        {goalList}
                        <tr>
                            <td colspan="3">
                                <form class="task-form" action="/goals/add" method="POST">
                                    <div>
                                        <input type="text" placeholder="enter a goal" name="goal" required />
                                        <input type="hidden" name="goaltype" value="weekly" />
                                    </div>
                                    <div>
                                        <button type="submit">+</button>
                                    </div>
                                </form>
                            </td>
                        </tr>
                    </tbody>
                </table>
                {/* <% if (isEmpty.weekly) { %>
                    <p>You haven't added any goals yet!</p>
                <% } else if (!incompleteWeeklyGoals) { %>
                    <p>You've completed all your weekly goals!</p>
                <% } %> */}
            </div>
        </section>
    )
}

export default MonthGoals