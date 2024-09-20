import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChildrensDetails = ({ setSelectedMenu, selectedPlan }) => {
    const [caseNum, setCaseNum] = useState('');
    const [children, setChildren] = useState([{ dob: '', ssn: '' }]);
    const [failure, setFailure] = useState(null);
    const [success, setSuccess] = useState('');
    const [countdown, setCountdown] = useState(null);

    // Fetch the latest case number on component load
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('access_token');

                const caseResponse = await axios.get('http://127.0.0.1:8000/api/Dc/get-latest-case-number/', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (caseResponse.data.CASE_NUM) {
                    setCaseNum(caseResponse.data.CASE_NUM);
                }
            } catch (error) {
                setFailure('Error fetching case number');
            }
        };

        fetchData();
    }, []);

    // Function to handle adding a new child input group
    const handleAddChild = () => {
        setChildren([...children, { dob: '', ssn: '' }]);
    };

    // Function to handle removing a child input group
    const handleRemoveChild = (index) => {
        const newChildren = [...children];
        newChildren.splice(index, 1);
        setChildren(newChildren);
    };

    // Function to handle changes to child input fields
    const handleChildChange = (index, field, value) => {
        const newChildren = [...children];
        newChildren[index][field] = value;
        setChildren(newChildren);
    };

    const handleDateChange = (index, field, value) => {
        const updatedChildren = [...children];
        updatedChildren[index][field] = value; // value will be in YYYY-MM-DD format
        setChildren(updatedChildren);
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('access_token');

            // Debugging: Log the caseNum value
            console.log('Submitting CASE_NUM:', caseNum);

            const data = {
                CASE_NUM: caseNum,
                CHILDREN: children.map(child => ({
                    CHILDREN_DOB: child.dob,
                    CHILDREN_SSN: child.ssn
                }))
            };

            const response = await axios.post('http://127.0.0.1:8000/api/Dc/Dc_children/', data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Response:', response.data);
            setSuccess('Form submitted successfully');
            setCountdown(3); // Start countdown from 3 seconds
            setFailure(null);
        } catch (error) {
            console.error('Error submitting form:', error.response ? error.response.data : error);
            setFailure('Error submitting form');
            setSuccess(null);
        }
    };

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);
        } else if (countdown === 0) {
            console.log('kids selectedplan', selectedPlan)
            if (selectedPlan === "AllInOne") {
                setSelectedMenu('EducationDetails')
            } else {
                setSelectedMenu('SummaryScreen')
            }// Redirect to the next form (if any)
        }
        return () => clearInterval(timer); // Clean up the timer on component unmount
    }, [countdown]);

    return (
        <div>
            <div className="row d-flex justify-content-center m-3 mb-5">
                <div className="col bg-white rounded-3 shadow-sm p-3">
                    <h4 className='ps-3'>Children Details</h4>
                </div>
            </div>
            <div className="row d-flex justify-content-center m-3">
                <div className="col bg-white rounded-3 shadow-sm p-3">
                    <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
                        <div className="row d-flex">
                            <div className="col-4 d-flex flex-column">
                                <label htmlFor="caseNum" className="form-label">Case Number</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="caseNum"
                                    value={caseNum}
                                    readOnly
                                />
                            </div>
                        </div>

                        {children.map((child, index) => (
                            <div key={index} className="row d-flex ">
                                <div className="col-4 d-flex flex-column">
                                    <label htmlFor={`dob-${index}`} className="form-label">Child Date of Birth</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={child.dob}
                                        onChange={(e) => handleDateChange(index, 'dob', e.target.value)}
                                    />

                                </div>
                                <div className="col-4 d-flex flex-column">
                                    <label htmlFor={`ssn-${index}`} className="form-label">Child SSN</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id={`ssn-${index}`}
                                        value={child.ssn}
                                        onChange={(e) => handleChildChange(index, 'ssn', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-2 d-flex align-items-end">
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => handleRemoveChild(index)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}

                        {failure && <p className="text-danger">{failure}</p>}
                        {success && <p className="text-success">{`${success} ${countdown ? `, wait you're beign redirect in ${countdown}s` : ''}`}</p>}
                        <div className="d-flex gap-3">
                            <button type="button" className="align-self-start px-3 py-1 rounded-1" onClick={handleAddChild}>Add Child</button>
                            <button type="submit" className='align-self-start px-3 py-1 rounded-1'>Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChildrensDetails;
