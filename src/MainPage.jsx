import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


function MainPage() {
    return (
        <div className="container text-center mt-5">
            <button className="btn btn-primary me-3">
                <Link to='/Login' className="text-white text-decoration-none">Login</Link>
            </button>
            <button className="btn btn-secondary">
                <Link to='/SignUP' className="text-white text-decoration-none">SignUp</Link>
            </button>
        </div>
    );
}

export default MainPage;
