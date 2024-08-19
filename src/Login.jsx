import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import config from './config';


function Login() {
    const navigate = useNavigate();
    const [value, setValue] = useState({ Email: '', Password: '' });

    const Submit = async (e) => {
        e.preventDefault();
        if (!value.Email || !value.Password) {
            alert('Email and Password are required');
        } else {
            axios.get(`${config.apiBaseUrl}/Login`, { params: value })
                .then(res => {
                    localStorage.setItem('token', res.data.token);
                    navigate('/Events', { state: { LoginUser: res.data.userData.ID } });
                })
                .catch(err => {
                    if (err.response && err.response.status === 401) {
                        console.log('Invalid Email or Password');
                        alert('Invalid Email and Password');
                    } else {
                        console.log(err);
                    }
                });
        }
    };

    return (
        <div className="col-md-3">

        <form onSubmit={Submit} className="container mt-5">
            <div className="mb-3">
                <label><strong>Email:</strong></label>
                <input type='text' className="form-control" placeholder='Email'
                       onChange={e => setValue({ ...value, Email: e.target.value })} />
            </div>
            <div className="mb-3">
                <label><strong>Password:</strong></label>
                <input type='Password' className="form-control" placeholder='Password'
                       onChange={e => setValue({ ...value, Password: e.target.value })} />
            </div>
            <button type='submit' className="btn btn-primary">Login</button>
        </form>
        </div>
    );
}

export default Login;
