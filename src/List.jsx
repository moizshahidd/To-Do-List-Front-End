import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "./config";


function List(props) {
    const navigate = useNavigate();
    const EventID = props.Id;
    const UserID = props.UserId;


    const [Data, setData] = useState([]);
    const [AddTask, setAddTask] = useState(false);
    const [selectedList, setselectedList] = useState([]);
    const [allSelected, setAllSelected] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [TaskValue, setTaskValue] = useState({
        TaskName: '',
        Date: '',
        Time: '',
        TaskDone: ''
    });


    const fetchData = async () => {
        await axios.get(`${config.apiBaseUrl}/getTaskData/${EventID}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => {
                setData(res.data);
            })
            .catch(err => {
                console.error(err);
            })
    };


    useEffect(() => {
        fetchData();
    }, [EventID]);


    const Add = async () => {
        setAddTask(true);
    };


    const AddTaskValue = async () => {
        await axios.post(`${config.apiBaseUrl}/AddTask/${EventID}`, TaskValue, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => {
                alert(res.data);
                setAddTask(false);
                fetchData();
            })
            .catch(err => {
                console.error(err);
            })
    };


    const CencelTask = async () => {
        setAddTask(false);
    }


    const handleDelete = async () => {
        await axios.delete(`${config.apiBaseUrl}/DeleteTask/${EventID}`, {
            data: { selectedList },
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => {
                alert(res.data);
                setselectedList([]);
                fetchData();
            })
            .catch(err => {
                console.error(err);
            })
    }


    const handleChangeUpdate = async () => {
        const allTasksDone = selectedList.every(id => {
            const task = Data.find(task => task.Id === id);
            return task && task.TaskDone === "Yes";
        });
        const TaskDone = allTasksDone ? "No" : "Yes";
        await axios.put(`${config.apiBaseUrl}/UpdateTaskDone/${EventID}`, { selectedList, TaskDone }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => {
                alert(res.data);
                setselectedList([]);
                fetchData();
            })
            .catch(err => {
                console.error(err);
            });
    }


    const handleUpdate = async (Values) => {
        navigate('/UpdateList', { state: { Values, UserID } });
    }


    const handleCheckboxChange = async (Id) => {
        let newSelectedLists;
        if (selectedList.includes(Id)) {
            newSelectedLists = selectedList.filter(ListId => ListId !== Id);
        } else {
            newSelectedLists = [...selectedList, Id];
        }
        setselectedList(newSelectedLists);
        setAllSelected(newSelectedLists.length === Data.length);
    }


    const handleSelectAll = async () => {
        if (allSelected) {
            setselectedList([]);
        } else {
            const allListIds = Data.map(list => list.Id);
            setselectedList(allListIds);
        }
        setAllSelected(!allSelected);
    };


    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatTime = (timeString) => {
        const options = { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' };
        return new Date(timeString).toLocaleTimeString(undefined, options);
    }

    const filteredData = Data.filter(
        (list) =>
            list.TaskName.toLowerCase().includes(searchQuery.toLowerCase())
    )


    if (!AddTask) {
        const allTasksDone = selectedList.every(id => {
            const task = Data.find(task => task.Id === id);
            return task && task.TaskDone === "Yes";
        });
        const allTasksNotDone = selectedList.every(id => {
            const task = Data.find(task => task.Id === id);
            return task && task.TaskDone === "No";
        });
    
        return (
            <div className="container mt-4">
                <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Search Task..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="btn btn-primary mb-3" onClick={Add}>+ Add New Task</button>
                {filteredData.length > 0 && selectedList.length > 0 && (
                    <div className="mb-3">
                        <button className="btn btn-secondary me-2" onClick={handleSelectAll}>
                            {allSelected ? 'Deselect All' : 'Select All'}
                        </button>
                        <button className="btn btn-danger me-2" onClick={handleDelete}>Delete Selected</button>
                        {allTasksDone && (
                            <button className="btn btn-warning me-2" onClick={handleChangeUpdate}>
                                I have not done this
                            </button>
                        )}
                        {allTasksNotDone && (
                            <button className="btn btn-success" onClick={handleChangeUpdate}>
                                I have done this
                            </button>
                        )}
                    </div>
                )}
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Task Name</th>
                            <th>Time</th>
                            <th>Date</th>
                            <th>Task Completed</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((Values, index) => (
                            <tr key={index}>
                                <td>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        name="event"
                                        value={Values.Id}
                                        onChange={() => handleCheckboxChange(Values.Id)}
                                        checked={selectedList.includes(Values.Id)}
                                    />
                                </td>
                                <td>{Values.TaskName}</td>
                                <td>{formatTime(Values.Time)}</td>
                                <td>{formatDate(Values.Date)}</td>
                                <td>{Values.TaskDone}</td>
                                <td>
                                    {selectedList.includes(Values.Id) && selectedList.length === 1 && (
                                        <button className="btn btn-warning" onClick={() => handleUpdate(Values)}>
                                            Update
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    } else {
        return (
            <div className="container mt-4">
                <h2>New Task</h2>
                <label className="form-label">Enter New Task name:</label>
                <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Task name"
                    onChange={e => setTaskValue({ ...TaskValue, TaskName: e.target.value })}
                />
                <label className="form-label">Enter Date:</label>
                <input
                    type="date"
                    className="form-control mb-3"
                    onChange={e => setTaskValue({ ...TaskValue, Date: e.target.value })}
                />
                <label className="form-label">Enter Time:</label>
                <input
                    type="time"
                    className="form-control mb-3"
                    onChange={e => setTaskValue({ ...TaskValue, Time: e.target.value })}
                />
                <label className="form-label">Task Done:</label>
                <div className="form-check">
                    <label className="form-check-label">
                        <input
                            type="radio"
                            className="form-check-input"
                            name="taskDone"
                            value="Yes"
                            onChange={e => setTaskValue({ ...TaskValue, TaskDone: e.target.value })}
                        />
                        Yes
                    </label>
                    <label className="form-check-label ms-3">
                        <input
                            type="radio"
                            className="form-check-input"
                            name="taskDone"
                            value="No"
                            onChange={e => setTaskValue({ ...TaskValue, TaskDone: e.target.value })}
                        />
                        No
                    </label>
                </div>
                <button className="btn btn-success me-2" onClick={AddTaskValue}>Submit</button>
                <button className="btn btn-secondary" onClick={CencelTask}>Cancel</button>
            </div>
        );
    }
}

export default List;