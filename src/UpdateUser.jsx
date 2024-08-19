import { React, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import config from './config';


function UpdateUser() {
    const navigate = useNavigate();
    const location = useLocation();
    const { Data } = location.state ;


    const [passwordError, setPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [Value, setValue] = useState({
        ID: '',
        FirstName: '',
        LastName: '',
        Email: '',
        Password: '',
        DOB: '',
        Gender: '',
        PhoneNo: ''
    })


    const Id = Value.ID;


    useEffect(() => {
        if (Data) {
            setValue(Data);
        }
    }, [Data]);

    const PasswordChange = async (e) => {
        const password = e.target.value;
        setValue({ ...Value, Password: password });
        const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordPattern.test(password)) {
            setPasswordError('Password must be at least 8 characters long, include a capital letter, a number, and a special character.');
        } else {
            setPasswordError('');
        }
    };

    const EmailChange = async (e) => {
        const email = e.target.value;
        setValue(prevValue => ({ ...prevValue, Email: email }));
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email)) {
            setEmailError('Invalid email format.');
            return;
        }
        if (email === Data.Email) {
            setEmailError('');
            setValue({ ...Value, Email: email });
            return;
        }
        try {
            setEmailError('Checking email availability...');
            const response = await axios.get(`${config.apiBaseUrl}/CheckEmail`, {
                params: { Email: email }
            });
            setEmailError(response.data);
            if (response.data === 'Email Available!') {
                setValue({ ...Value, Email: email });
            }
        }
        catch (error) {
            console.error('Error details:', error);
            setEmailError('An error occurred while checking email availability.');
        }
    };

    const Update = async (e) => {
        e.preventDefault();
        if (!passwordError && (emailError === '' || emailError === 'Email Available!')) {
            axios.put(`${config.apiBaseUrl}/UpdateUser/${Id}`, Value, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(res => {
                    navigate('/Events', { state: { LoginUser: Id } });
                    alert(`Signup successful!\nResponse: ${(res.data)}`);

                })
                .catch(err => {
                    console.log(err);
                })

        }
        else {
            alert(`Please Enter Correct Value of Data`);
        }
    }

    const NotUpdate = async (e) => {
        e.preventDefault();
        navigate('/Events', { state: { LoginUser: Id } });
    }

    return (
        <div className="container mt-4">
            <form onSubmit={Update}>
            <div className="col-md-3">
                <div className="mb-3">
                    <label className="form-label"><strong>First Name:</strong></label>
                    <input
                        type="text"
                        className="form-control"
                        value={Value.FirstName}
                        onChange={e => setValue({ ...Value, FirstName: e.target.value })}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label"><strong>Last Name:</strong></label>
                    <input
                        type="text"
                        className="form-control"
                        value={Value.LastName}
                        onChange={e => setValue({ ...Value, LastName: e.target.value })}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label"><strong>Email:</strong></label>
                    <input
                        type="email"
                        className="form-control"
                        value={Value.Email}
                        onChange={EmailChange}
                    />
                    {emailError && <p className="text-danger">{emailError}</p>}
                </div>
                <div className="mb-3">
                    <label className="form-label"><strong>Password:</strong></label>
                    <input
                        type="password"
                        className="form-control"
                        value={Value.Password}
                        onChange={PasswordChange}
                    />
                    {passwordError && <p className="text-danger">{passwordError}</p>}
                </div>
                <div className="mb-3">
                    <label className="form-label"><strong>Date of Birth:</strong></label>
                    <input
                        type="date"
                        className="form-control"
                        value={Value.DOB}
                        onChange={e => setValue({ ...Value, DOB: e.target.value })}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label"><strong>Gender:</strong></label>
                    <div className="form-check">
                        <input
                            type="radio"
                            className="form-check-input"
                            name="gender"
                            value="Male"
                            checked={Value.Gender === "Male"}
                            onChange={e => setValue({ ...Value, Gender: e.target.value })}
                        />
                        <label className="form-check-label">Male</label>
                    </div>
                    <div className="form-check">
                        <input
                            type="radio"
                            className="form-check-input"
                            name="gender"
                            value="Female"
                            checked={Value.Gender === "Female"}
                            onChange={e => setValue({ ...Value, Gender: e.target.value })}
                        />
                        <label className="form-check-label">Female</label>
                    </div>
                    <div className="form-check">
                        <input
                            type="radio"
                            className="form-check-input"
                            name="gender"
                            value="Other"
                            checked={Value.Gender === "Other"}
                            onChange={e => setValue({ ...Value, Gender: e.target.value })}
                        />
                        <label className="form-check-label">Other</label>
                    </div>
                </div>
                <div className="mb-3">
                    <label className="form-label"><strong>Phone Number:</strong></label>
                    <input
                        type="tel"
                        className="form-control"
                        placeholder="Phone Number"
                        value={Value.PhoneNo}
                        onChange={e => setValue({ ...Value, PhoneNo: e.target.value })}
                    />
                </div>
                <div className="mb-3">
                <button type="submit" className="btn btn-primary">Update</button>
                <button type="button" className="btn btn-secondary ms-2" onClick={NotUpdate}>Cancel</button>
                </div>
            </div>
            </form>
        </div>
    );
    
}
export default UpdateUser;