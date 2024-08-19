import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import config from './config';

function SignUP() {
    const navigate = useNavigate();
    const [passwordError, setPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [value, setValue] = useState({
        FirstName: '',
        LastName: '',
        Email: '',
        Password: '',
        DOB: '',
        Gender: '',
        PhoneNo: ''
    });

    const handlePasswordChange = async (e) => {
        const password = e.target.value;
        setValue({ ...value, Password: password });
        const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordPattern.test(password)) {
            setPasswordError('Password must be at least 8 characters long, include a capital letter, a number, and a special character.');
        } else {
            setPasswordError('');
        }
    };

    const handleEmailChange = async (e) => {
        const email = e.target.value;
        setValue({ ...value, Email: email });
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailPattern.test(email)) {
            setEmailError('Invalid email format.');
            return;
        }

        try {
            setEmailError('Checking email availability...');
            const response = await axios.get(`${config.apiBaseUrl}/CheckEmail`, {
                params: { Email: email }
            });
            setEmailError(response.data);
        } catch (error) {
            console.error('Error details:', error);
            setEmailError('An error occurred while checking email availability.');
        }
    };

    const Submit = async (e) => {
        e.preventDefault();
        if (!passwordError && emailError === 'Email Available!') {
            axios.post(`${config.apiBaseUrl}/SignUP/`, value)
                .then(res => {
                    localStorage.setItem('token', res.data.token);
                    const user = res.data.ID;
                    navigate('/Events', { state: { user: user } });
                    alert('Signup successful!');
                })
                .catch(err => {
                    console.log(err);
                });
        } else {
            alert('Please Enter Correct Value of Data');
        }
    };

    return (
        <form onSubmit={Submit} className="container mt-5">
            <div className="mb-3">
                <label><strong>First Name:</strong></label>
                <input type='text' className="form-control" placeholder='First name'
                       onChange={e => setValue({ ...value, FirstName: e.target.value })} />
            </div>
            <div className="mb-3">
                <label><strong>Last Name:</strong></label>
                <input type='text' className="form-control" placeholder='Surname'
                       onChange={e => setValue({ ...value, LastName: e.target.value })} />
            </div>
            <div className="mb-3">
                <label><strong>Email:</strong></label>
                <input type='text' className="form-control" placeholder='Email'
                       onChange={handleEmailChange} />
                {emailError && <p style={{ color: 'red' }}>{emailError}</p>}
            </div>
            <div className="mb-3">
                <label><strong>Password:</strong></label>
                <input type='password' className="form-control" placeholder='Password'
                       onChange={handlePasswordChange} />
                {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
            </div>
            <div className="mb-3">
                <label><strong>Date of Birth:</strong></label>
                <input type='date' className="form-control"
                       onChange={e => setValue({ ...value, DOB: e.target.value })} />
            </div>
            <div className="mb-3">
                <label><strong>Gender:</strong></label>
                <div>
                    <label className="form-check-label me-2">
                        <input type='radio' className="form-check-input" name='gender'
                               value='Male' onChange={e => setValue({ ...value, Gender: e.target.value })} />
                        Male
                    </label>
                    <br></br>
                    <label className="form-check-label me-2">
                        <input type='radio' className="form-check-input" name='gender'
                               value='Female' onChange={e => setValue({ ...value, Gender: e.target.value })} />
                        Female
                    </label>
                    <br></br>
                    <label className="form-check-label">
                        <input type='radio' className="form-check-input" name='gender'
                               value='Other' onChange={e => setValue({ ...value, Gender: e.target.value })} />
                        Other
                    </label>
                </div>
            </div>
            <div className="mb-3">
                <label><strong>Phone No:</strong></label>
                <input type='tel' className="form-control" placeholder='Phone No'
                       onChange={e => setValue({ ...value, PhoneNo: e.target.value })} />
            </div>
            <button className="btn btn-primary">Signup</button>
        </form>
    );
}

export default SignUP;
