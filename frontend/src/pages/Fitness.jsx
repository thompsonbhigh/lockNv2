import { use } from "react";
import { useEffect, useState } from "react";
import Popup from "../components/Popup";
import Edit from './Edit';

const Fitness = ({ userInfo, setFinishWorkout }) => {
    const [workouts, setWorkouts] = useState({});
    const [loading, setLoading] = useState(true);
    const [popup, setPopup] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [adding, setAdding] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const [clearing, setClearing] = useState(false);
    const [newWorkout, setNewWorkout] = useState();
    const [isEditing, setIsEditing] = useState();
    const [editDay, setEditDay] = useState();

    async function getWorkoutData() {
        try {
            const response = await fetch(`${backend}/fitness`, {credentials: 'include'});
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
            const response = await fetch(`${backend}/fitness/next`, {
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

    async function handleBack() {
        try {
            const response = await fetch(`${backend}/fitness/back`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({
                    currentday: workouts.workoutNames.day,
                }),
            });
            const prevDay = await response.json();
            setWorkouts(prev => ({
                ...prev,
                workoutNames: {
                    name: prevDay.name,
                    day: prevDay.day
                }
            }));
            console.log('Prev day: ', prevDay);
        } catch (err) {
            console.error('Failed to get next workout: ', err);
        }
    }

    async function handleFinish(day) {
        try {
            const response = await fetch(`${backend}/fitness/finish`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({
                    workoutday: day
                }),
            });
        } catch (err) {
            console.error('Failed to finish workout: ', err);
        } finally {
            setFinishWorkout(true);
            getWorkoutData();
        }
    };

    useEffect(() => {
        getWorkoutData();
    }, [deleting, adding, confirming, clearing, newWorkout]);

    let workoutDay = typeof workouts?.workoutNames?.day === 'number' ? workouts.workoutNames.day : 0;

    let workoutName = typeof workouts?.workoutNames?.name === 'string' ? workouts.workoutNames.name : '';

    if (newWorkout) {
        workoutDay = workoutDay + 1 ? workoutDay + 1 : 0;
        workoutName = '';
    }
    
    if (isEditing) {
        workoutDay = editDay;
    }

    const workoutArray = Array.isArray(workouts.workouts) ? workouts.workouts : [];

    const filteredWorkoutList = workoutArray.filter(workout => 
        workout.day === workoutDay
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
        congratsMsg = <p>Good job on working out today!</p>;
    }

    return (
        <main>
            <Popup trigger={popup} setTrigger={setPopup} children={
                <Edit 
                workouts={workouts} 
                filteredWorkoutList={filteredWorkoutList} 
                setDeleting={setDeleting} 
                currWorkoutName={workoutName} 
                currWorkoutDay={workoutDay} 
                setTrigger={setPopup} 
                setAdding={setAdding}
                setConfirming={setConfirming}
                setClearing={setClearing}
                newWorkout={newWorkout}
                setNewWorkout={setNewWorkout}
                setIsEditing={setIsEditing}
                />
                } 
            />
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
                        <button onClick={handleBack}>back</button>

                        <button onClick={() => { setPopup(true); setIsEditing(true); setEditDay(workoutDay) }}>edit</button>

                        <button onClick={() => {handleFinish(workoutDay)}}>finish workout</button>

                        <button onClick={() => { setPopup(true); setNewWorkout(true)}}>add</button>

                        <button onClick={handleNext}>next</button>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Fitness