import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './IncomeUpdate.css'; // Make sure your CSS file has the necessary styles

const IncomeUpdateForm = ({ selectedTable, setShowPopup, onUpdate }) => {
    // Initialize the state with the selected income data passed as props
    const [formData, setFormData] = useState(selectedTable);

    // Sync the form data with the selectedTable whenever it changes
    useEffect(() => {
        setFormData(selectedTable);
    }, [selectedTable]);

    // Handle input changes and update the formData state
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Update the record via an API call
            const response = await axios.patch(
                `http://127.0.0.1:8000/api/Dc/Dc_income/${formData.INCOME_ID}/`,
                formData,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
                }
            );
            onUpdate(response.data); // Call the onUpdate function passed from the parent component
            setShowPopup(false); // Close the popup
        } catch (error) {
            console.error('Error updating income record:', error?.response);
        }
    };

    return (
        <div className="popup">
            <div className="popup-inner">
                <h2>Update Income Record</h2>
                <form onSubmit={handleSubmit}>
                    <div className="d-flex gap-3">
                        <div>
                            <label>Income ID:</label>
                            <input
                                type="text"
                                name="INCOME_ID"
                                value={formData.INCOME_ID}
                                onChange={handleChange}
                                readOnly
                            />
                        </div>
                        <div>
                            <label>Case Number:</label>
                            <input
                                type="text"
                                name="CASE_NUM"
                                value={formData.CASE_NUM}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="d-flex gap-3">
                        <div>
                            <label>Employee Income:</label>
                            <input
                                type="number"
                                name="EMP_INCOME"
                                value={formData.EMP_INCOME}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Property Income:</label>
                            <input
                                type="number"
                                name="PROPERTY_INCOME"
                                value={formData.PROPERTY_INCOME}
                                onChange={handleChange}
                            />
                        </div>
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

export default IncomeUpdateForm;
