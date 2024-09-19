import React, { useEffect, useState } from 'react';
import axios from 'axios';

const IncomeDetails = ({ setSelectedMenu, selectedPlan }) => {
    const [caseNum, setCaseNum] = useState('');
    const [empIncome, setEmpIncome] = useState('');
    const [propertyIncome, setPropertyIncome] = useState('');
    const [failure, setFailure] = useState(null); // Added state for error handling
    const [countdown, setCountdown] = useState(null);
    const [success, setSuccess] = useState('');

    // getting plan names
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('access_token');

                // Fetch the latest case number
                const caseResponse = await axios.get('http://127.0.0.1:8000/api/Dc/get-latest-case-number/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

                // Check the response and set the case number
                if (caseResponse.data.CASE_NUM) {
                    setCaseNum(caseResponse.data.CASE_NUM);
                }

                // Fetch plan names (if needed)
                const plansResponse = await axios.get('http://127.0.0.1:8000/api/Dc/get-plan-names/');
                // Handle plan options if necessary

            } catch (error) {
                console.error('Error fetching data:', error);
                setFailure('Error fetching data');
            }
        };

        fetchData();
    }, []);

    // Count down and redirecting
    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);
        } else if (countdown === 0) {
            if (selectedPlan === "AllInOne") {
                setSelectedMenu('KidsDetails')
            } else {
                setSelectedMenu('SummaryScreen')
            }
        }
        return () => clearInterval(timer); // Clean up the timer on component unmount
    }, [countdown]);

    //submitting data
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('access_token');

            // Prepare data to be sent to the server
            const data = {
                CASE_NUM: caseNum,
                EMP_INCOME: empIncome,
                PROPERTY_INCOME: propertyIncome,
            };

            // Send data to the server
            const response = await axios.post('http://127.0.0.1:8000/api/Dc/Dc_income/', data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            // Handle success
            setFailure(null);
            setSuccess('Form submitted successfully');
            setCountdown(3); // Start countdown from 3 seconds

        } catch (error) {
            // Check if the error response is available
            if (error.response) {
                console.error('Error submitting form:', error.response.data);
                setFailure(`Error: ${error.response.data.message || JSON.stringify(error.response.data)}`);
            } else {
                setFailure('Error submitting form. Please try again.');
            }

            setSuccess(null);
        }
    };

    return (
        <div>
            <div className="row d-flex justify-content-center m-3 mb-5">
                <div className="col bg-white rounded-3 shadow-sm p-3">
                    <h4 className='ps-3'>Income Details</h4>
                </div>
            </div>
            <div className="row d-flex justify-content-center m-3">
                <div className="col bg-white rounded-3 shadow-sm p-3">
                    <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
                        <div className="row d-flex justify-content-around">
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
                            <div className="col-4 d-flex flex-column">
                                <label htmlFor="empIncome" className="form-label">Employment Income</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="empIncome"
                                    value={empIncome}
                                    onChange={(e) => setEmpIncome(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col-4 d-flex flex-column">
                                <label htmlFor="propertyIncome" className="form-label">Property Income</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="propertyIncome"
                                    value={propertyIncome}
                                    onChange={(e) => setPropertyIncome(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        {failure && <p className="text-danger">{failure}</p>}
                        {success && <p className="text-success">{`${success} ${countdown ? `, wait you're beign redirect in ${countdown}s` : ''}`}</p>}
                        <button type="submit" className='align-self-start px-3 py-1 rounded-1'>Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default IncomeDetails;
