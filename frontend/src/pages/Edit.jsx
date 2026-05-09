import { useState } from 'react'
import Add from './Add';
import Popup from '../components/Popup';

const Edit = ({ workouts, filteredWorkoutList, setDeleting, currWorkoutName, setTrigger, currWorkoutDay, setAdding, setConfirming }) => {
    const [workoutName, setWorkoutName] = useState(currWorkoutName);
    const [addPopup, setAddPopup] = useState(false);

    async function handleConfirm() {
        setConfirming(true);
        try {
            console.log('Starting confirm');
            const response = await fetch('http://localhost:3000/fitness/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    workoutname: workoutName,
                    currDay: filteredWorkoutList?.at(0)?.day
                }),
            });
            console.log('Worked');
        } catch (err) {
            console.error('Failed to confirm edit: ', err);
        } finally {
            setConfirming(false)
            setTrigger(false);
        }
    };

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
            <Popup trigger={addPopup} setTrigger={setAddPopup} children={<Add currWorkoutDay={currWorkoutDay} setAdding={setAdding} setTrigger={setAddPopup} />} />
            <div class="edit-container">
                <table>
                    <thead>
                        <tr>
                            <th colSpan="2">
                                <input type="text" placeholder="Enter workout name" name="workoutname" defaultValue={ workouts.workoutNames.name } required 
                                    onChange={e => setWorkoutName(e.target.value)}/>
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