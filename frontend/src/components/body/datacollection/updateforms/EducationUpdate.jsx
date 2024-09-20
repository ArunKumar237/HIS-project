// EducationUpdate.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EducationUpdate = ({ selectedTable, setShowPopup, onUpdate }) => {
    const [formData, setFormData] = useState(selectedTable);

    useEffect(() => {
        setFormData(selectedTable);
    }, [selectedTable]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.patch(
                `http://127.0.0.1:8000/api/Dc/Dc_education/${formData.EDU_ID}/`,
                formData,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
                }
            );
            onUpdate(response.data);
            setShowPopup(false);
        } catch (error) {
            console.error('Error updating education record:', error?.response);
        }
    };

    return (
        <div className="popup">
            <div className="popup-inner">
                <h2>Update Education Record</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Highest Qualification:</label>
                        <input
                            type="text"
                            name="HIGHEST_QUALIFICATION"
                            value={formData.HIGHEST_QUALIFICATION}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Graduation Year:</label>
                        <input
                            type="date"
                            name="GRADUATION_YEAR"
                            value={formData.GRADUATION_YEAR}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit">Update</button>
                    <button type="button" onClick={() => setShowPopup(false)}>
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EducationUpdate;
