import { useState } from 'react'

const Tasks = ({ userInfo, taskInfo }) => {
    const [tasks, setTasks] = useState();

    const taskArray = Array.isArray(taskInfo.tasks) ? taskInfo.tasks : [];

    const incompleteTasks = taskArray.filter(task => 
        task.status === false
    );

    const taskList = incompleteTasks.map(task => 
        <tr key={task.id}>
            <td style={{textAlign: 'center', width: 3 + 'vh'}}><button>✓</button></td>
            <td>{task.task}</td>
            <td style={{textAlign: 'right'}}><button>−</button></td>
        </tr>
    );

    return (
        <section>
            <h1 class="fitness-name">tasks</h1>
            <div class="page-grid">
                <div>
                    <p>rank: <span>{userInfo.taskRank}</span></p>
                    <p>tasks completed: <span>{userInfo.tasksCompleted}</span></p>
                    <p>today: <span></span></p>
                    <p>week: <span></span></p>
                    <p>month: <span></span></p>
                </div>
                <div class="plan-container">
                    <table>
                        <tbody>
                            {taskList}
                            <tr>
                                <td colspan="3">
                                    <form class="task-form" action="/tasks/add" method="POST">
                                        <div>
                                            <input type="text" placeholder="enter a task" name="task" required />
                                        </div>
                                        <div style={{textAlign: 'right'}}>
                                            <button type="submit">+</button>
                                        </div>
                                    </form>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    {/* <% if (isEmpty) { %>
                        <p>You haven't added any tasks!</p>
                    <% } else if (!incompleteTasks) { %>
                        <p>You've completed all your tasks!</p>
                    <% } %> */}
                </div>
            </div>
        </section>
    )
}

export default Tasks