import { useEffect } from 'react';
import { useState } from 'react'

const Tasks = ({ userInfo, taskInfo, getTaskInfo, getUserData }) => {
    const [tasks, setTasks] = useState();
    const [newTask, setNewTask] = useState('');

    async function handleNewTask() {
        try {
            const response = await fetch('http://localhost:3000/tasks/add', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({
                    task: newTask
                }),
            });
            const result = await response.json();
        } catch (err) {
            console.error('Failed to add task: ', err);
        } finally {
            getTaskInfo();
            setNewTask('');
        }
    };

    async function handleComplete(id) {
        try {
            const response = await fetch('http://localhost:3000/tasks/complete', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({
                    taskid: id
                }),
            });
            const result = response.json();
        } catch (err) {
            console.error('Failed to complete task: ', err);
        } finally {
            getTaskInfo();
            getUserData();
        }
    };

    async function handleDelete(id) {
        try {
            const response = await fetch('http://localhost:3000/tasks/delete', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({
                    taskid: id
                }),
            });
            const result = await response.json();
        } catch (err) {
            console.error('Failed to delete task: ', err);
        } finally {
            getTaskInfo();
        }
    };

    const taskArray = Array.isArray(taskInfo.tasks) ? taskInfo.tasks : [];

    const incompleteTasks = taskArray.filter(task => 
        task.status === false
    );

    const taskList = incompleteTasks.map(task => 
        <tr key={task.id}>
            <td style={{textAlign: 'center', width: 3 + 'vh'}}><button onClick={e => handleComplete(task.id)}>✓</button></td>
            <td>{task.task}</td>
            <td style={{textAlign: 'right'}}><button onClick={e => handleDelete(task.id)}>−</button></td>
        </tr>
    );

    let statusMsg;
    if (taskInfo.isEmpty) {
        statusMsg = <p>You haven't added any tasks!</p>
    } else if (taskInfo.incompleteTasks === 0) {
        statusMsg = <p>You've completed all your tasks!</p>
    }

    return (
        <section>
            <h1 class="fitness-name">tasks</h1>
            <div class="page-grid">
                <div>
                    <p>rank: <span>{userInfo.taskRank}</span></p>
                    <p>tasks completed: <span>{userInfo.tasksCompleted}</span></p>
                    <p>today: <span>{taskInfo.tasksToday}</span></p>
                    <p>week: <span>{taskInfo.tasksWeek}</span></p>
                    <p>month: <span>{taskInfo.tasksMonth}</span></p>
                </div>
                <div class="plan-container">
                    <table>
                        <tbody>
                            {taskList}
                        </tbody>
                    </table>
                    {statusMsg}
                    <div class='new-task'>
                        <input type="text" placeholder="enter a task" value={newTask} required onChange={e => setNewTask(e.target.value)}/>
                        <button onClick={handleNewTask}>+</button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Tasks