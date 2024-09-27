import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './UpdateForm.css';
import { API_BASE_URL } from '../../../../config';

const UpdateForm = ({ appReg, setShowPopup, onUpdate }) => {
    const [formData, setFormData] = useState({
        FULLNAME: appReg.FULLNAME,
        EMAIL: appReg.EMAIL,
        PHNO: appReg.PHNO,
        SSN: appReg.SSN,
        GENDER: appReg.GENDER,
    });

    useEffect(() => {
        setFormData({
            FULLNAME: appReg.FULLNAME,
            EMAIL: appReg.EMAIL,
            PHNO: appReg.PHNO,
            SSN: appReg.SSN,
            GENDER: appReg.GENDER,
        });
    }, [appReg]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataToUpdate = {
            FULLNAME: formData.FULLNAME,
            EMAIL: formData.EMAIL,
            PHNO: formData.PHNO,
            SSN: formData.SSN,
            GENDER: formData.GENDER,
        };
        try {
            const response = await axios.patch(`${API_BASE_URL}/api/Ar/appRegister/${appReg.APP_ID}/`, dataToUpdate, {
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
                    </div>
                    <button type="submit">Update</button>
                    <button type="button" onClick={() => setShowPopup(false)}>Cancel</button>
                </form>
            </div >
        </div >
    );
};

export default UpdateForm;
