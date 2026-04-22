import { use } from "react";
import { useEffect, useState } from "react";

const Fitness = ({ userInfo }) => {
    const [workouts, setWorkouts] = useState({});
    const [loading, setLoading] = useState(true);

    async function getWorkoutData() {
        try {
            const response = await fetch('http://localhost:3000/fitness', {credentials: 'include'});
            const workoutData = await response.json();
            setWorkouts(workoutData);
        } catch (err) {
            console.error('Failed to get workout data: ', err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getWorkoutData();
    }, []);

    useEffect(() => {
        console.log('Workout data updated: ', workouts);
    }, [workouts]);

    const workoutName = typeof workouts?.workoutNames?.name === 'string' ? workouts.workoutNames.name : '';

    const workoutArray = Array.isArray(workouts.workouts) ? workouts.workouts : [];

    const filteredWorkoutList = workoutArray.filter(workout => 
        workout.name === workoutName
    );

    const workoutList = filteredWorkoutList.map(workout => 
        <tr key={workout.id}>
            <td>{workout.exercise_name}</td>
        </tr>
    )

    if (loading) {
        return <div className='center'><div className='loader'/></div>
    }

    return (
        <main>
            <h1 class="fitness-name">fitness</h1>
            <div class="page-grid">
                <div>
                    <p>rank: <span>{userInfo.workoutRank}</span></p>
                    <p>workouts completed: <span>{userInfo.workoutsCompleted}</span></p>
                    <p>last workout: <span>{userInfo.lastWorkout}</span></p>
                    <p>last workout date: <span>{userInfo.lastWorkoutDate}</span></p>
                </div>
                <div class="plan-container">
                    <table>
                        <thead>
                            <tr>
                                <th colSpan="3">
                                    {workoutName}
                                </th>
                            </tr>
                        </thead>
                        <thead>
                            <tr>
                                <th style={{textAlign: 'left', fontSize: 40 + 'px'}}>exercise</th>
                                <th style={{textAlign: 'left', fontSize: 40 + 'px'}}>sets</th>
                                <th style={{textAlign: 'left', fontSize: 40 + 'px'}}>reps</th>
                            </tr>
                        </thead>
                        <tbody>
                            {workoutList}
                        </tbody>
                    </table>
                    {/* <% if (hasWorkedOutToday) { %>
                        <p>Good job on working out today!</p>
                    <% } else {%>
                        <form action="/plan/finish" method="POST">
                            <button type="submit" value="<%=workoutNames.day%>" name="workoutday">finish workout</button>
                        </form>
                    <% } %>
                    <div class="fitness-btns">
                        <form action="/plan/back" method="POST">
                            <button type="submit" name="currentday" value="<%= workoutNames.day %>">back</button>
                        </form>
                        <form action="/plan/edit" method="POST">
                            <button type="submit" name="editday" value="<%= workoutNames.day %>">edit</button>
                        </form>
                        <form action="/plan/edit" method="POST">
                            <button type="submit">add</button>
                        </form>
                        <form action="/plan/next" method="POST">
                            <button type="submit" name="currentday" value="<%= workoutNames.day %>">next</button>
                        </form>
                    </div> */}
                </div>
            </div>
        </main>
    )
}

export default Fitness