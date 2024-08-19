import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import config from './config';


function UpdateList() {
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;


    const [Value, setValue] = useState({
        Id: '',
        TaskName: '',
        TaskDone: '',
        Time: '',
        Date: '',
        EventId: ''
    });


    useEffect(() => {
        if (state) {
            setValue({
                Id: state.Values.Id,
                TaskName: state.Values.TaskName,
                TaskDone: state.Values.TaskDone,
                Time: state.Values.Time,
                Date: state.Values.Date,
                EventId: state.Values.EventId
            });
        }

    }, [state]);


    const Submit = async () => {
        axios.put(`${config.apiBaseUrl}/UpdateTask/${Value.Id}`, Value, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => {
                alert(res.data || 'Task Updated!!');
            })
            .catch(err => {
                console.log(err);
            })

        navigate('/Events', { state: { UserEventId: Value.EventId, LoginUser: state.UserID } })
    }


    const NoSubmit = async () => {
        navigate('/Events', { state: { UserEventId: Value.EventId, LoginUser: state.UserID } })
    }


    return (
        <div className="container mt-4">
            <h1>Update Task</h1>
            <form onSubmit={Submit}>
            <div className="col-md-3">
                <div className="mb-3">
                    <label className="form-label"><strong>Enter New Task Name:</strong></label>
                    <input
                        type="text"
                        className="form-control"
                        value={Value.TaskName}
                        onChange={e => setValue({ ...Value, TaskName: e.target.value })}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label"><strong>Enter Date:</strong></label>
                    <input
                        type="date"
                        className="form-control"
                        value={Value.Date ? Value.Date.split('T')[0] : ''}
                        onChange={e => setValue({ ...Value, Date: e.target.value })}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label"><strong>Enter Time:</strong></label>
                    <input
                        type="time"
                        className="form-control"
                        value={Value.Time ? Value.Time.split('T')[1].substring(0, 5) : ''}
                        onChange={e => setValue({ ...Value, Time: e.target.value })}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label"><strong>Task Done:</strong></label>
                    <div className="form-check">
                        <input
                            type="radio"
                            className="form-check-input"
                            name="taskDone"
                            value="Yes"
                            checked={Value.TaskDone === "Yes"}
                            onChange={e => setValue({ ...Value, TaskDone: e.target.value })}
                        />
                        <label className="form-check-label">Yes</label>
                    </div>
                    <div className="form-check">
                        <input
                            type="radio"
                            className="form-check-input"
                            name="taskDone"
                            value="No"
                            checked={Value.TaskDone === "No"}
                            onChange={e => setValue({ ...Value, TaskDone: e.target.value })}
                        />
                        <label className="form-check-label">No</label>
                    </div>
                </div>
                <div className="mb-3">
                <button type="submit" className="btn btn-primary">Submit</button>
                <button type="button" className="btn btn-secondary ms-2" onClick={NoSubmit}>Cancel</button>
                </div>
            </div>
            </form>
        </div>
    );
    
}

export default UpdateList;