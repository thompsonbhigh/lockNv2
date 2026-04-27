import React from 'react'

const Edit = ({ workouts, filteredWorkoutList, setDeleting }) => {

    async function handleDelete(id) {
        try {
            setDeleting(true);
            const response = await fetch('http://localhost:3000/fitness/delete', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({
                    workoutId: id
                }),
            });
            setDeleting(false);

        } catch (err) {
            console.error('Failed to delete exercise: ', err);
        }   
    };

    const workoutList = filteredWorkoutList.map(workout => 
        <tr key={workout.id}>
            <td>
                {workout.exercise_name}
            </td>
            <td style={{textAlign: 'right'}}>
                <button onClick={() => handleDelete(workout.id)}>−</button>
            </td>
        </tr>
    )

    return (
        <section>
            <div class="edit-container">
                <table>
                    <thead>
                        <tr>
                            <th colSpan="2">
                                <form id="confirmForm" action="/plan/confirm" method="POST">
                                    <input type="text" placeholder="Enter workout name" name="workoutname" defaultValue={ workouts.workoutNames.name } required />
                                </form>
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {workoutList}
                        <tr>
                            <td>
                                <form action="/plan/clear" method="POST">
                                    <button style={{fontWeight: 100}} type="submit" name="clearday" value="<%= day %>">CLEAR</button>
                                </form>
                            </td>
                            <td style={{textAlign: 'right'}}>
                                <form action="/plan" method="POST">
                                    <button type="submit" name="day" value="<%= day %>">+</button>
                                </form>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="button-flex">
                    <form action="/plan/cancel" method="POST">
                        <button class="cancel-btn" type="submit">CANCEL</button>
                    </form>
                    <button form="confirmForm" class="confirm-workout" type="submit">CONFIRM</button>
                </div>
            </div>
        </section>
    )
}

export default Edit