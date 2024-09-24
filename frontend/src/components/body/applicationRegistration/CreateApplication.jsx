import React, { useState } from 'react';
import axios from 'axios';

const CreateApplication = () => {
    const [formData, setFormData] = useState({
        FULLNAME: '',
        EMAIL: '',
        PHNO: '',
        DOB: '',  // Added DOB state
        SSN: '',
        GENDER: '',
        STATE_NAME: '',
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('access_token');
            // Post the form data to the API endpoint
            const response = await axios.post('http://127.0.0.1:8000/api/Ar/appRegister/', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setFormData({
                FULLNAME: '',
                EMAIL: '',
                PHNO: '',
                DOB: '',  // Reset DOB state
                SSN: '',
                GENDER: '',
                STATE_NAME: '',
            });
            setSuccess('Successfully submitted');
            setError(null);
        } catch (error) {
            setError('Failed to submit data. Please try again.');
            setSuccess(null);
            console.error('Error submitting data:', error);
        }
    };

    return (
        <div>
            <div className="row d-flex justify-content-center m-3 mb-5">
                <div className="col bg-white rounded-3 shadow-sm p-3">
                    <h4 className="ps-3">Create Application</h4>
                </div>
            </div>
            <div className="row d-flex justify-content-center m-3">
                <div className="col bg-white rounded-3 shadow-sm p-3">
                    <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
                        <div className="row d-flex justify-content-start">
                            <div className="col-4 d-flex flex-column">
                                <label htmlFor="FULLNAME">Full Name</label>
                                <input
                                    type="text"
                                    name="FULLNAME"
                                    id="FULLNAME"
                                    value={formData.FULLNAME}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="col-4 d-flex flex-column">
                                <label htmlFor="EMAIL">Email</label>
                                <input
                                    type="email"
                                    name="EMAIL"
                                    id="EMAIL"
                                    value={formData.EMAIL}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="col-4 d-flex flex-column">
                                <label htmlFor="PHNO">Phone Number</label>
                                <input
                                    type="number"
                                    name="PHNO"
                                    id="PHNO"
                                    value={formData.PHNO}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="col-4 d-flex flex-column">
                                <label htmlFor="DOB">Date of Birth</label>  {/* DOB Field */}
                                <input
                                    type="date"
                                    name="DOB"
                                    id="DOB"
                                    value={formData.DOB}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="col-4 d-flex flex-column">
                                <label htmlFor="SSN">SSN</label>
                                <input
                                    type="number"
                                    name="SSN"
                                    id="SSN"
                                    value={formData.SSN}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="col-4 d-flex flex-column">
                                <label htmlFor="GENDER">Gender</label>
                                <select
                                    name="GENDER"
                                    id="GENDER"
                                    value={formData.GENDER}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>

                            <div className="col-4 d-flex flex-column">
                                <label htmlFor="STATE_NAME">State Name</label>
                                <input
                                    type="text"
                                    name="STATE_NAME"
                                    id="STATE_NAME"
                                    value={formData.STATE_NAME}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <button className="align-self-start px-3 py-1 rounded-1" type="submit">Submit</button>
                        {error && <p className="error-message">{error}</p>}
                        {success && <p>{success}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateApplication;
