import React from 'react'
import { useState } from 'react';
import axios from 'axios';

const UpdateForm = ({ setShowPopup, worker, onUpdate }) => {
    const [error, setError] = useState(null)
    const [formData, setFormData] = useState(worker)
    // State to track updateform data (you can add more fields as necessary)
    // const [formData, setFormData] = useState({
    //     USERNAME: '',
    //     FULLNAME: '',
    //     EMAIL: '',
    //     PHNO: '',
    //     GENDER: '',
    //     SSN: '',
    //     DOB: ''
    // })

    // Function to handle form changes
    const handleUpdateInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Function to handle form submission
    const handleUpdateFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://127.0.0.1:8000/api/plans/casewrkacct/${worker.ACC_ID}/`, formData, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
            });

            // Pass the updated data back to ViewAccounts
            onUpdate(response.data);

            // Close the popup after successful update
            setShowPopup(false);
        } catch (error) {
            console.error('Error details:', error.response);
            setError('Error updating account', error.response);
        }
    };

    return (
        <div className="popup">
            <div className="popup-inner">
                <h2>Update Form</h2>
                {error && <p>Error: {error}</p>}
                <form onSubmit={handleUpdateFormSubmit}>
                    <div className="row d-flex justify-content-around">
                        <div className="col-4 d-flex flex-column">
                            <label htmlFor='USERNAME'>Username</label>
                            <input className='text-inp' type="text" name="USERNAME" id="username" onChange={handleUpdateInputChange} value={formData.USERNAME} required />
                        </div>
                        <div className="col-4 d-flex flex-column">
                            <label htmlFor='FULLNAME'>Fullname</label>
                            <input className='text-inp' type="text" name="FULLNAME" id="fullname" onChange={handleUpdateInputChange} value={formData.FULLNAME} required />
                        </div>
                        <div className="col-4 d-flex flex-column">
                            <label htmlFor='EMAIL'>Email address</label>
                            <input className='text-inp' type="email" name="EMAIL" id="email" onChange={handleUpdateInputChange} value={formData.EMAIL} required />
                        </div>
                    </div>
                    <div className="row d-flex justify-content-around">
                        <div className="col-4 d-flex flex-column">
                            <label htmlFor='PHNO'>Phone number</label>
                            <input className='text-inp' type="text" name="PHNO" id="phno" onChange={handleUpdateInputChange} value={formData.PHNO} required />
                        </div>
                        <div className="col-4 d-flex flex-column">
                            <label htmlFor='GENDER'>Gender</label>
                            <select className='select-inp' name="GENDER" id="gender" onChange={handleUpdateInputChange} value={formData.GENDER}>
                                <option value="">select</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                        <div className="col-4 d-flex flex-column">
                            <label htmlFor='SSN'>SSN</label>
                            <input className='text-inp' type="text" name="SSN" id="ssn" onChange={handleUpdateInputChange} value={formData.SSN} required />
                        </div>
                    </div>
                    <div className="row d-flex justify-content-start">
                        <div className="col-4 d-flex flex-column">
                            <label htmlFor='DOB'>Date Of Birth</label>
                            <input className='text-inp' type="date" name="DOB" id="dob" onChange={handleUpdateInputChange} value={formData.DOB} required />
                        </div>
                    </div>
                    <div className="d-flex gap-3 me-2 mt-2">
                        <button type="submit">Submit</button>
                        <button
                            type='button'
                            onClick={() => (setShowPopup(false))}
                        >Close</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UpdateForm