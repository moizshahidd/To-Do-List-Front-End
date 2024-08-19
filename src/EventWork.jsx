import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "./config";


function EventWork(props) {
    const navigate = useNavigate();
    const ID = props.Id;

    const [data, setData] = useState([]);
    const [selectedEvent, setselectedEvent] = useState([]);
    const [addValue, setAddValue] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [allSelected, setAllSelected] = useState(false);
    const [Eventvalue, setEventValue] = useState({
        UserId: props.Id,
        EventName: ''
    });



    const fetchData = async () => {
        await axios.get(`${config.apiBaseUrl}/getData/${ID}`, {
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
    }, [ID]);


    const Add = async () => {
        setAddValue(true);
    };


    const AddEvent = async () => {
        await axios.post(`${config.apiBaseUrl}/AddEvents/${ID}`, Eventvalue, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => {
                alert(res.data);
                setAddValue(false);
                fetchData();
            })
            .catch(err => {
                console.error(err);
            })
    };


    const List = async (Id) => {
        navigate('/Events', { state: { UserEventId: Id, LoginUser: props.Id } });
    }


    const handleCheckboxChange = async (Id) => {
        let newSelectedEvents;
        if (selectedEvent.includes(Id)) {
            newSelectedEvents = selectedEvent.filter(eventId => eventId !== Id);
        } else {
            newSelectedEvents = [...selectedEvent, Id];
        }
        setselectedEvent(newSelectedEvents);
        setAllSelected(newSelectedEvents.length === data.length);
    }


    const handleDelete = async () => {
        await axios.delete(`${config.apiBaseUrl}/DeleteEvent/${ID}`, {
            data: { selectedEvent },
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => {
                alert(res.data);
                setselectedEvent([]);
                fetchData();

            })
            .catch(err => {
                console.error(err);
            })
    }



    const handleUpdate = async (eventName) => {
        navigate('/UpdateEvent', { state: { Id: selectedEvent, UserId: props.Id, EventName: eventName } });
    }


    const Cencelevent = async () => {
        setAddValue(false);
    }


    const handleSelectAll = async () => {
        if (allSelected) {
            setselectedEvent([]);
        } else {
            const allEventIds = data.map(event => event.Id);
            setselectedEvent(allEventIds);
        }
        setAllSelected(!allSelected);
    };


    const filteredData = data.filter(
        (event) =>
            event.EventName.toLowerCase().includes(searchQuery.toLowerCase())
    )


    if (!addValue) {
        return (
            <div className="container mt-4">
                <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="btn btn-primary mb-3" onClick={Add}>+ Add New Event</button>
                {filteredData.length > 0 && selectedEvent.length > 0 && (
                    <div className="mb-3">
                        <button className="btn btn-secondary me-2" onClick={handleSelectAll}>
                            {allSelected ? "Deselect All" : "Select All"}
                        </button>
                        <button className="btn btn-danger" onClick={handleDelete}>Delete Selected</button>
                    </div>
                )}
                <table>
                    <tbody >
                    {filteredData.map((values, index) => (
                    <tr key={index}  className="form-check">
                            <td>
                            <input
                            type="checkbox"
                            className="form-check-input"
                            name="event"
                            value={values.Id}
                            onChange={() => handleCheckboxChange(values.Id)}
                            checked={selectedEvent.includes(values.Id)}
                            />
                            </td>
                            <td>
                            <button className="btn btn-link " onClick={() => List(values.Id)}>
                            {values.EventName}
                            </button>
                            </td>
                            <td>
                            {selectedEvent.includes(values.Id) && selectedEvent.length === 1 && (
                            <button className="btn btn-warning " onClick={() => handleUpdate(values.EventName)}>
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
                <h2>New Event</h2>
                <label className="form-label">Enter New Event name:</label>
                <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Event name"
                    onChange={e => setEventValue({ ...Eventvalue, EventName: e.target.value })}
                />
                <button className="btn btn-success me-2" onClick={AddEvent}>Submit</button>
                <button className="btn btn-secondary" onClick={Cencelevent}>Cancel</button>
            </div>
        );
    }
}


export default EventWork;