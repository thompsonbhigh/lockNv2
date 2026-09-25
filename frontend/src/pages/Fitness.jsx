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

    const backend = import.meta.env.VITE_BACKEND_URL;

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

    const ProgressBar = ({ progress }) => {
        const containerStyle = {
            height: 10,
            width: '100%',
            backgroundColor: '#0a0f1b',
            borderRadius: 50
        };

        const fillerStyle = {
            height: '100%',
            width: `${progress}%`,
            backgroundImage: 'linear-gradient(to right, #3f008e, #d2bbff)',
            borderRadius: 'inherit',
            transition: 'width 1s eas-in-out'
        };

        return (
            <div style={containerStyle}>
                <div style={fillerStyle} />
            </div>
        );
    };

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

            <div className="fitness-grid">
                <div className="ranking">
                    <div className="card-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width='24' height='24' fill='#d2bbff' viewBox="0 0 640 640"><path d="M353.8 118.1L330.2 70.3C326.3 62 314.1 61.7 309.8 70.3L286.2 118.1L233.9 125.6C224.6 127 220.6 138.5 227.5 145.4L265.5 182.4L256.5 234.5C255.1 243.8 264.7 251 273.3 246.7L320.2 221.9L366.8 246.3C375.4 250.6 385.1 243.4 383.6 234.1L374.6 182L412.6 145.4C419.4 138.6 415.5 127.1 406.2 125.6L353.9 118.1zM288 320C261.5 320 240 341.5 240 368L240 528C240 554.5 261.5 576 288 576L352 576C378.5 576 400 554.5 400 528L400 368C400 341.5 378.5 320 352 320L288 320zM80 384C53.5 384 32 405.5 32 432L32 528C32 554.5 53.5 576 80 576L144 576C170.5 576 192 554.5 192 528L192 432C192 405.5 170.5 384 144 384L80 384zM448 496L448 528C448 554.5 469.5 576 496 576L560 576C586.5 576 608 554.5 608 528L608 496C608 469.5 586.5 448 560 448L496 448C469.5 448 448 469.5 448 496z"/></svg>
                        <p>Rankings</p>
                    </div>
                    <div className="rank-bubble">
                        <span>GLOBAL</span>
                        <span className="rank-num">14</span>
                    </div>
                    <div className="rank-bubble">
                        <span>GROUP</span>
                        <span className="rank-num">5</span>
                    </div>
                    <div className="rank-bubble">
                        <span>FRIENDS</span>
                        <span className="rank-num">2</span>
                    </div>
                </div>

                <div className="reward">
                    <div className="card-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#f9bd22" class="bi bi-award" viewBox="0 0 16 16">
                            <path d="M9.669.864 8 0 6.331.864l-1.858.282-.842 1.68-1.337 1.32L2.6 6l-.306 1.854 1.337 1.32.842 1.68 1.858.282L8 12l1.669-.864 1.858-.282.842-1.68 1.337-1.32L13.4 6l.306-1.854-1.337-1.32-.842-1.68zm1.196 1.193.684 1.365 1.086 1.072L12.387 6l.248 1.506-1.086 1.072-.684 1.365-1.51.229L8 10.874l-1.355-.702-1.51-.229-.684-1.365-1.086-1.072L3.614 6l-.25-1.506 1.087-1.072.684-1.365 1.51-.229L8 1.126l1.356.702z"/>
                            <path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1z"/>
                        </svg>
                        <p>Rewards</p>
                    </div>
                    <div className="progress-info">
                        <p className="progress-num">75%</p>
                        <p className="progress-text">MILESTONE 3 / 4</p>
                    </div>
                    <ProgressBar progress={75}/>
                    <div className="card-info">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                        </svg>
                        <p>Complete the required amount of workouts to level up and receive a case.</p>
                    </div>
                </div>

                <div className="pr">
                    <div className="card-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#4cd7f6" class="bi bi-trophy" viewBox="0 0 16 16">
                        <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5q0 .807-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33 33 0 0 1 2.5.5m.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935m10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935M3.504 1q.01.775.056 1.469c.13 2.028.457 3.546.87 4.667C5.294 9.48 6.484 10 7 10a.5.5 0 0 1 .5.5v2.61a1 1 0 0 1-.757.97l-1.426.356a.5.5 0 0 0-.179.085L4.5 15h7l-.638-.479a.5.5 0 0 0-.18-.085l-1.425-.356a1 1 0 0 1-.757-.97V10.5A.5.5 0 0 1 9 10c.516 0 1.706-.52 2.57-2.864.413-1.12.74-2.64.87-4.667q.045-.694.056-1.469z"/>
                        </svg>
                        <p>PRs</p>
                    </div>
                    <div className="pr-bubble">
                        <div>
                            <p className="top-bubble">NEW PERSONAL RECORD</p>
                            <p className="mid-bubble">Bench Press</p>
                        </div>
                        <p className="num-bubble">315<span className="sub-text">LBS</span></p>
                    </div>
                    <div className="card-title-sec">
                        <p>RECENT ACTIVITY</p>
                    </div>
                </div>

                <div className="current-workout">
                    <div className="card-title">
                        <p>Today's Workout</p>
                    </div>
                </div>

                <div className="other-workout">
                    <h2>Other Workouts</h2>
                </div>
            </div>

            {/* <h1 class="fitness-name">fitness</h1>
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
            </div> */}
        </main>
    )
}

export default Fitness