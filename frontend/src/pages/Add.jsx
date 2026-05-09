import { useState, useEffect } from 'react';

const Add = ({ currWorkoutDay, setAdding, setTrigger }) => {
    const [exercises, setExercises] = useState({});

    async function getExercises() {
        try {
            const response = await fetch('http://localhost:3000/addExercise', { credentials: 'include' });
            const result = await response.json();

            setExercises(result.exercises);
        } catch (err) {
            console.error('Failed to load exercises: ', err);
        }
    };

    async function addExercise(id) {
        setAdding(true);
        try {
            console.log('Attempting add');
            const response = await fetch('http://localhost:3000/addExercise', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({
                    exerciseId: id
                }),
            });
            console.log('Adding worked!');
        } catch (err) {
            console.error('Failed to add exercise: ', err);
        } finally {
            setAdding(false);
            setTrigger(false);
        }
    };

    useEffect(() => {
        getExercises();
    }, []);

    console.log(exercises);

    const exerciseArray = Array.isArray(exercises) ? exercises : [];

    const exerciseList = exerciseArray.map(exercise => 
        <tr key={exercise.id}>
            <td>{exercise.name}</td>
            <td style={{textAlign: 'center'}}>{exercise.muscle}</td>
            <td style={{textAlign: 'center'}}><button class='add-btn' onClick={() => addExercise(exercise.id)}>+</button></td>
        </tr>
    )

    return (
        <section>
            <div class="add-container">
                <table>
                    <thead>
                        <tr>
                            <th colSpan="3">
                                <form action="../addExercise/search" method="GET">
                                    <input type="text" name="query" placeholder="Search..." />
                                </form>
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {exerciseList}
                    </tbody>
                </table>
            </div>
        </section>
    )
}

export default Add