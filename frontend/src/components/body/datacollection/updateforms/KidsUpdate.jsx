import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../../../config';

const KidsUpdate = ({ selectedTable, setShowPopup, onUpdate }) => {
    const [formData, setFormData] = useState({
        CHILDREN_DOB: selectedTable.CHILDREN_DOB || '',
        CHILDREN_SSN: selectedTable.CHILDREN_SSN || '',
    });

    // Set form data when selectedTable changes
    useEffect(() => {
        setFormData({
            CHILDREN_DOB: selectedTable.CHILDREN_DOB || '',
            CHILDREN_SSN: selectedTable.CHILDREN_SSN || '',
        });
    }, [selectedTable]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.patch(
                `${API_BASE_URL}/api/Dc/Dc_children/${selectedTable.CHILDREN_ID}/`,
                formData,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
                }
            );
            onUpdate(response.data); // Call parent function to handle updated data
            setShowPopup(false); // Close the popup after submission
        } catch (error) {
            console.error('Error updating children record:', error?.response);
        }
    };

    return (
        <div className="popup">
            <div className="popup-inner">
                <h2>Update Child Record</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Children DOB:</label>
                        <input
                            type="date"
                            name="CHILDREN_DOB"
                            value={formData.CHILDREN_DOB}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Children SSN:</label>
                        <input
                            type="number"
                            name="CHILDREN_SSN"
                            value={formData.CHILDREN_SSN}
                            onChange={handleChange}
                            required
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

export default KidsUpdate;
