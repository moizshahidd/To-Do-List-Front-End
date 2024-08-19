import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation, json } from "react-router-dom";
import config from './config';


function UpdateEvent() {
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;


    const [Value, setValue] = useState({
        Id: '',
        EventName: '',
        UserId: ''
    });


    useEffect(() => {
        if (state) {
            setValue({
                Id: state.Id,
                EventName: state.EventName,
                UserId: state.UserId
            });
        }
    }, [state]);


    const Submit = async (e) => {
        e.preventDefault();
        axios.put(`${config.apiBaseUrl}/UpdateEvent/${Value.Id}`, Value, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => {
                alert(res.data || 'Event Updated!!');
            })
            .catch(err => {
                console.log(err);
            })

        navigate('/Events', { state: { LoginUser: Value.UserId } })
    }


    const NoSubmit = async (e) => {
        e.preventDefault();
        navigate('/Events', { state: { LoginUser: Value.UserId } })
    }

    return (
        <div className="container mt-4">
            <h1>Update Event Name:</h1>
            <form onSubmit={Submit}>
            <div className="col-md-3">
                <div className="mb-3">
                    <label className="form-label">Event Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={Value.EventName}
                        onChange={e => setValue({ ...Value, EventName: e.target.value })}
                    />
                </div>
                <div className="mb-3">
                <button className="btn btn-primary">Update</button>
                <button className="btn btn-secondary" onClick={NoSubmit}>Cancel</button>
                </div>
            </div>
            </form>
        </div>
    );
}

export default UpdateEvent;