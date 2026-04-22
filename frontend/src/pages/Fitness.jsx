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

    async function handleNext() {
        try {
            const response = await fetch('http://localhost:3000/fitness/next', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({
                    currentday: workouts.workoutNames.day,
                }),
            });
            const nextDay = await response.json();
            setWorkouts(prev => ({
                ...prev,
                workoutNames: {
                    name: nextDay.name,
                    day: nextDay.day
                }
            }));
            console.log('Next day: ', nextDay);
        } catch (err) {
            console.error('Failed to get next workout: ', err);
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

    let congratsMsg;
    if (workouts.hasWorkedOutToday) {
        congratsMsg = <p>Good job on working out today!'</p>;
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
                                <th className="fitness-subheader" style={{width: '30%'}}>exercise</th>
                                <th className="fitness-subheader" style={{width: '5%'}}>sets</th>
                                <th className="fitness-subheader" style={{width: '40%'}}>reps</th>
                            </tr>
                        </thead>
                        <tbody>
                            {workoutList}
                        </tbody>
                    </table>
                        {congratsMsg}
                    <div class="fitness-btns">
                        <button name="currentday" value="<%= workoutNames.day %>">back</button>
                        <form action="/plan/edit" method="POST">
                            <button type="submit" name="editday" value="<%= workoutNames.day %>">edit</button>
                        </form>
                        <button type="submit" value="<%=workoutNames.day%>" name="workoutday">finish workout</button>
                        <form action="/plan/edit" method="POST">
                            <button type="submit">add</button>
                        </form>
                        <button type="submit" name="currentday" value="<%= workoutNames.day %>" onClick={handleNext}>next</button>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Fitness