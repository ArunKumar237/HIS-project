import React, { useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {
        console.log('Logging out...');

        // Remove the JWT token from localStorage
        localStorage.removeItem('access_token');

        // Redirect to login page
        navigate('/');
    };

    const handleClick = (event) => {
        event.preventDefault();  // Prevents the default action (page reload/navigation)
        console.log("Link click prevented!");
    };

    return (
        <Fragment>
            <nav className="navbar navbar-expand-lg sticky-top bg-white m-0 p-0">
                <div style={{ height: "4rem" }} className="container-fluid px-5 border-bottom d-flex justify-content-between">
                    <p className='h2 montserrat-font'>
                        <a onClick={handleClick} className='text-decoration-none text-black'>AIA</a>
                    </p>
                    <p className='h2 caveat-font'>
                        <a onClick={handleClick} className='text-decoration-none text-black'>Welcome to Arun Insurance Agency</a>
                    </p>
                    <div className='d-flex gap-2 align-items-center'>
                        <p style={{ fontSize: "1.4rem" }} className='mt-2'>Welcome! {localStorage.getItem('username')}</p>
                        <a
                            href="#"
                            onClick={toggleDropdown}
                        >
                            <img
                                style={{ height: "2.5rem" }}
                                id="logo"
                                src="https://img.icons8.com/material-rounded/96/user-male-circle.png"
                                alt="User Profile"
                            />
                        </a>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <ul className="dropdown-menu show position-absolute" style={{ right: '10px', top: '70px' }}>
                                <li><Link className="dropdown-item" to="#">Profile</Link></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                            </ul>
                        )}
                    </div>
                </div>
            </nav>
        </Fragment>
    );
};

export default Navbar;
