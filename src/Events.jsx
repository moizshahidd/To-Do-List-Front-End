import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import EventWork from "./EventWork";
import List from "./List";
import config from "./config";

function Events() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, LoginUser, UserEventId} = location.state || {};
    const ID = user || LoginUser;

    const [uploadImageValue, setUploadImageValue] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageButton, setImageButton] = useState(false);
    const [removeImage, setRemoveImage] = useState(false);
    const [data, setData] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const [settingValue, setSettingValue] = useState(false);
    const [deleteAccount, setDeleteAccount] = useState(false);
    const [EventList, setEventList] = useState(true);

    const [disableButtons, setDisableButtons] = useState(false); 

    useEffect(() => {
        if (ID) {
            axios.get(`${config.apiBaseUrl}/DatabyID/${ID}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }).then(res => {
                setData(res.data.userData);
                if (res.data.imageData) {
                    setImageUrl(`data:image/jpeg;base64,${res.data.imageData}`);
                }
            }).catch(err => {
                console.log(err);
            });
        }
    }, [ID]);

    const handleFileChange = async (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('image', selectedFile);
        const userToSend = ID;

        if (userToSend) {
            formData.append('user', userToSend);
        }

        try {
            await axios.post(`${config.apiBaseUrl}/ImageUpload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            }).then(res => {
                alert(res.data || 'File uploaded successfully.');
                setUploadImageValue(false);
                setSettingValue(false);
                setDisableButtons(false); 
                window.location.reload();
                navigate('/Events', { state: { LoginUser: userToSend } });
            });
        } catch (error) {
            console.error(error);
        }
    };

    const notUpload = async () => {
        setUploadImageValue(false);
        setImageButton(false);
        setDisableButtons(false); 
        setEventList(!EventList);
        window.location.reload();
        navigate('/Events', { state: { LoginUser: ID } });
    };

    const deleteImage = async (e) => {
        e.preventDefault();
        if (ID) {
            try {
                await axios.delete(`${config.apiBaseUrl}/DeleteImage/${ID}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }).then(res => {
                    alert(res.data);
                    setDisableButtons(false); 
                    window.location.reload();
                    navigate('/Events', { state: { LoginUser: ID } });
                });
            } catch (err) {
                console.log(err);
            }
        } else {
            alert('No ID passed');
        }
    };

    const deleteAccountPermanent = async (e) => {
        e.preventDefault();
        if (ID) {
            try {
                await axios.delete(`${config.apiBaseUrl}/DeleteAccount/${ID}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }).then(res => {
                    alert(res.data);
                    navigate('/');
                });
            } catch (err) {
                console.log(err);
            }
        } else {
            alert('No ID passed');
        }
    };

    const signOut = async (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleButtonClick = (buttonType) => {
        setDisableButtons(true);
        if (buttonType === "aboutImage") {
            setImageButton(true);
            setDeleteAccount(false);
            setEventList(false);
        } else if (buttonType === "deleteAccount") {
            setDeleteAccount(true);
            setImageButton(false);
            setEventList(false);
        }
    };

    if(!user){
    return (
        <div className="container mt-3">
            <div className="row">
                {/* User Profile Column */}
                <div className="col-md-3">
                    <button className="btn btn-primary w-100 mb-3" onClick={() => setSettingValue(!settingValue)}>Settings</button>
                    {settingValue && (
                        <div className="profile-settings p-3 border rounded">
                            {imageUrl && <img src={imageUrl} alt='Profile' className="img-thumbnail rounded-circle mb-3" />}
                            <p className="mb-3"><strong>{data.FirstName} {data.LastName}</strong></p>
                            <button
                                className="btn btn-secondary w-100 mb-2"
                                onClick={() => handleButtonClick("aboutImage")}
                                disabled={disableButtons && !imageButton}
                            >
                                About Image
                            </button>
                            <button
                                className="btn btn-secondary w-100 mb-2"
                                onClick={() => navigate('/UpdateUser', { state: { Data: data } })}
                                disabled={disableButtons}
                            >
                                Change Account Settings
                            </button>
                            <button
                                className="btn btn-danger w-100 mb-2"
                                onClick={() => handleButtonClick("deleteAccount")}
                                disabled={disableButtons && !deleteAccount}
                            >
                                Delete Account
                            </button>
                            <button className="btn btn-warning w-100" onClick={signOut} disabled={disableButtons}>Sign Out</button>
                        </div>
                    )}
                </div>

                {/* Middle Column for Events */}
                <div className="col-md-9">
                    {EventList ? (
                        <div className="card p-3">
                            {UserEventId ? <List Id={UserEventId} UserId={LoginUser} /> : <EventWork Id={data.ID} />}
                        </div>
                    ) : (
                        <div>
                            {imageButton && (
                                <div className="mb-3">
                                    {!imageUrl ? (
                                        <button
                                            className="btn btn-secondary w-100 mb-2"
                                            onClick={() => {
                                                setImageButton(!imageButton);
                                                setUploadImageValue(true);
                                            }}
                                        >
                                            Upload Image
                                        </button>
                                    ) : (
                                        <span className="d-flex flex-column">
                                            <button
                                                className="btn btn-secondary w-100 mb-2"
                                                onClick={() => {
                                                    setImageButton(!imageButton);
                                                    setUploadImageValue(true);
                                                }}
                                            >
                                                Upload Image
                                            </button>
                                            <button
                                                className="btn btn-danger w-100"
                                                onClick={() => {
                                                    setImageButton(!imageButton);
                                                    setRemoveImage(true);
                                                }}
                                            >
                                                Remove Image
                                            </button>
                                        </span>
                                    )}
                                </div>
                            )}

                            {uploadImageValue && (
                                <form className="mb-3" onSubmit={(e) => { e.preventDefault(); handleUpload(); }}>
                                    <div className="mb-2">
                                        <label className="form-label">Image:</label>
                                        <input type='file' className="form-control" name='image' onChange={handleFileChange} />
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <button type='submit' className="btn btn-primary">Upload</button>
                                        <button type='button' className="btn btn-secondary" onClick={notUpload}>Maybe Later</button>
                                    </div>
                                </form>
                            )}
                            {removeImage && (
                                <div className="mb-3">
                                    <label className="d-block mb-2">Are you sure you want to delete your image?</label>
                                    <div className="d-flex justify-content-between">
                                        <button className="btn btn-danger" onClick={deleteImage}>Yes</button>
                                        <button className="btn btn-secondary" onClick={() => { setEventList(!EventList); setRemoveImage(false); setDisableButtons(false); }}>No</button>
                                    </div>
                                </div>
                            )}
                            {deleteAccount && (
                                <div className="mb-3">
                                    <label className="d-block mb-2">Are you sure you want to delete your account?</label>
                                    <div className="d-flex justify-content-between">
                                        <button className="btn btn-danger" onClick={deleteAccountPermanent}>Yes</button>
                                        <button className="btn btn-secondary" onClick={() => { setEventList(!EventList); setDeleteAccount(false);  setDisableButtons(false); }}>No</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="col-md-2">
                {/* Content for the right column can go here */}
            </div>
        </div>
    );
}

else if (user) {
    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="col-md-6">
                <form className="mb-3" onSubmit={(e) => { e.preventDefault(); handleUpload(); }}>
                    <div className="mb-2">
                        <label className="form-label">Image:</label>
                        <input type='file' className="form-control" name='image' onChange={handleFileChange} />
                    </div>
                    <div className="d-flex justify-content-between">
                        <button type='submit' className="btn btn-primary w-48">Upload</button>
                        <button type='button' className="btn btn-secondary w-48" onClick={notUpload}>Maybe Later</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

}

export default Events;
