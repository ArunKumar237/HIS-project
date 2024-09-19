import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './UpdateForm.css';

const UpdateForm = ({ appReg, setShowPopup, onUpdate }) => {
    const [formData, setFormData] = useState(appReg);

    useEffect(() => {
        setFormData(appReg);
    }, [appReg]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.patch(`http://127.0.0.1:8000/api/Ar/appRegister/${formData.APP_ID}/`, formData, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
            });
            onUpdate(response.data);
            setShowPopup(false);
        } catch (error) {
            console.error('Error details:', error.response);
        }
    };

    return (
        <div className="popup">
            <div className="popup-inner">
                <h2>Update Record</h2>
                <form onSubmit={handleSubmit}>
                    <div className='d-flex gap-3'>
                        <div>
                            <label>Fullname:</label>
                            <input type="text" name="FULLNAME" value={formData.FULLNAME} onChange={handleChange} />
                        </div>
                        <div>
                            <label>Email:</label>
                            <input type="email" name="EMAIL" value={formData.EMAIL} onChange={handleChange} />
                        </div>
                    </div>
                    <div className='d-flex gap-3'>
                        <div>
                            <label>Phone Number:</label>
                            <input type="text" name="PHNO" value={formData.PHNO} onChange={handleChange} />
                        </div>
                        <div>
                            <label>SSN:</label>
                            <input type="text" name="SSN" value={formData.SSN} onChange={handleChange} />
                        </div>
                    </div>
                    <div className='d-flex gap-3'>
                        <div>
                            <label>Gender:</label>
                            <input type="text" name="GENDER" value={formData.GENDER} onChange={handleChange} />
                        </div>
                        {/* <div>
                            <label>State Name:</label>
                            <input type="text" name="STATE_NAME" value={formData.STATE_NAME} onChange={handleChange} />
                        </div> */}
                    </div>
                    {/* <div>
                        <div>
                            <label>Case Number:</label>
                            <input type="number" name="CASE_NUM" value={formData.CASE_NUM} onChange={handleChange} />
                        </div>
                    </div> */}
                    <button type="submit">Update</button>
                    <button type="button" onClick={() => setShowPopup(false)}>Cancel</button>
                </form>
            </div >
        </div >
    );
};

export default UpdateForm;
