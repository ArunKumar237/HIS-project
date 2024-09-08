// import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
    return (
        <div style={{ margin: '50px 45%' }}>
            <Link style={{ padding: "12px 20px", backgroundColor: 'blue', color: 'white', textDecoration: 'none' }} to="/login">Login</Link>
        </div>
    )
}

export default Navbar