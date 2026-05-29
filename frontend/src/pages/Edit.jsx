import { useState } from 'react'
import Add from './Add';
import Popup from '../components/Popup';

const Edit = ({ workouts, filteredWorkoutList, setDeleting, currWorkoutName, setTrigger, currWorkoutDay, setAdding, setConfirming, setClearing, newWorkout, setNewWorkout, setIsEditing }) => {
    const [workoutName, setWorkoutName] = useState(currWorkoutName);
    const [addPopup, setAddPopup] = useState(false);

    const backend = import.meta.env.VITE_BACKEND_URL;

    async function handleConfirm() {
        setConfirming(true);
        try {
            const response = await fetch(`${backend}/fitness/confirm`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    workoutname: workoutName,
                    currDay: currWorkoutDay
                }),
            });
        } catch (err) {
            console.error('Failed to confirm edit: ', err);
        } finally {
            setIsEditing(false);
            setNewWorkout(false);
            setConfirming(false);
            setTrigger(false);
        }
    };

    async function handleDelete(id) {
        try {
            setDeleting(true);
            const response = await fetch(`${backend}/fitness/delete`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({
                    workoutId: id
                }),
            });
            const result = await response.json();
            setDeleting(false);

        } catch (err) {
            console.error('Failed to delete exercise: ', err);
        }   
    };

    async function handleClear() {
        setClearing(true);
        try {
            const response = await fetch(`${backend}/fitness/clear`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({
                    clearDay: currWorkoutDay
                }),
            });
            setClearing(false);
        } catch (err) {
            console.error('Failed to clear workout: ', err);
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
            <Popup trigger={addPopup} setTrigger={setAddPopup} children={<Add currWorkoutDay={currWorkoutDay} setAdding={setAdding} setTrigger={setAddPopup} />} />
            <div class="edit-container">
                <table>
                    <thead>
                        <tr>
                            <th colSpan="2">
                                <input type="text" placeholder="Enter workout name" name="workoutname" defaultValue={ workoutName } required 
                                    onChange={e => setWorkoutName(e.target.value)}/>
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {workoutList}
                        <tr>
                            <td>
                                <button style={{fontWeight: 100}} onClick={handleClear}>CLEAR</button>
                            </td>
                            <td style={{textAlign: 'right'}}>
                                <button name="day" onClick={() => setAddPopup(true)}>+</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="button-flex">
                    <button onClick={handleConfirm}>CONFIRM</button>
                </div>
            </div>
        </section>
    )
}

export default Edit