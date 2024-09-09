import React, { useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {
        console.log('Logging out...');
        // Add your logout logic here
    };

    return (
        <Fragment>
            <nav className="navbar navbar-expand-lg sticky-top bg-white m-0 p-0">
                <div style={{ height: "4rem" }} className="container-fluid px-5 border border-2">
                    <p className='h2 montserrat-font'>
                        <a href="" className='text-decoration-none text-black'>INSURANCE</a>
                    </p>
                    <div className='d-flex align-items-center'>
                        <p style={{ fontSize: "1.4rem" }} className='mt-2'>Username</p>
                        <a
                            className="navbar-brand ms-md-4 m-0"
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
