import { useState, useEffect } from 'react';
import Loading from '../components/Loading';
import { useDebounce } from 'use-debounce';

const Add = ({ currWorkoutDay, setAdding, setTrigger }) => {
    const [exercises, setExercises] = useState({});
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [timeout] = useDebounce(search, 500);

    const backend = import.meta.env.VITE_BACKEND_URL;

    async function handleSearch() {
        try {
            const response = await fetch(`${backend}/addExercise/search`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({
                    query: search
                }),
            });
            const result = await response.json();
            console.log('Searched exercises: ', result.exercises);
            setExercises(result.exercises);
        } catch (err) {
            console.error('Failed to search: ', err);
        }
    };

    async function getExercises() {
        setLoading(true);
        try {
            const response = await fetch(`${backend}/addExercise`, { credentials: 'include' });
            const result = await response.json();

            setExercises(result.exercises);
        } catch (err) {
            console.error('Failed to load exercises: ', err);
        } finally {
            setLoading(false);
        }
    };

    async function addExercise(id) {
        setAdding(true);
        setLoading(true);
        try {
            const response = await fetch(`${backend}/addExercise`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({
                    exerciseId: id,
                    day: currWorkoutDay
                }),
            });
            setAdding(false);
            setLoading(false);
            const result = await response.json();
            setTrigger(false);
        } catch (err) {
            console.error('Failed to add exercise: ', err);
        }
    };

    useEffect(() => {
        getExercises();
    }, []);

    useEffect(() => {
        handleSearch();
    }, [timeout]);

    const exerciseArray = Array.isArray(exercises) ? exercises : [];

    const exerciseList = exerciseArray.map(exercise => 
        <tr key={exercise.id}>
            <td>{exercise.name}</td>
            <td style={{textAlign: 'center'}}>{exercise.muscle}</td>
            <td style={{textAlign: 'center'}}><button class='add-btn' onClick={() => addExercise(exercise.id)}>+</button></td>
        </tr>
    )

    if (loading) {
        return <Loading />
    }

    return (
        <section>
            <div class="add-container">
                <table>
                    <thead>
                        <tr>
                            <th colSpan="3">
                                <input type="text" name="query" placeholder="Search..." onChange={e => setSearch(e.target.value)}/>
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