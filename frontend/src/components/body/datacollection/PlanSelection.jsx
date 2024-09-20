import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PlanSelection = ({ setSelectedMenu, setSelectedPlan }) => {
    const [latestCaseNum, setLatestCaseNum] = useState('');
    const [planOptions, setPlanOptions] = useState([]);
    const [selectedPlanId, setSelectedPlanId] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [Cases, setLatestCaseNumber] = useState(null);
    const [countdown, setCountdown] = useState(null);

    useEffect(() => {
        // Define the function to fetch data
        const fetchLatestCaseNumber = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/Dc/get-latest-case-number/');
                setLatestCaseNumber(response.data); // Adjust according to the response structure
                console.log('setLatestCaseNumber:', response.data);
            } catch (err) {
                setError(err.message);
            }
        };

        // Call the function
        fetchLatestCaseNumber();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('access_token');

                // Fetch latest case number
                const caseResponse = await axios.get('http://127.0.0.1:8000/api/Dc/get-latest-case-number/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (caseResponse.data.CASE_NUM) {
                    setLatestCaseNum(caseResponse.data.CASE_NUM);
                }

                // Fetch available plans
                const plansResponse = await axios.get('http://127.0.0.1:8000/api/Dc/get-plan-names/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setPlanOptions(plansResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Error fetching data');
            }
        };

        fetchData();
    }, []);

    const handleSelectChange = (e) => {
        setSelectedPlanId(e.target.value);
        setSelectedPlan(e.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedPlanId) {
            setError('Please select a plan');
            return;
        }

        try {
            const token = localStorage.getItem('access_token');
            await axios.patch(
                `http://127.0.0.1:8000/api/Dc/Dc_cases/${Cases.CASE_ID}/`,
                {
                    PLAN_NAME: selectedPlanId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setError(null);
            setSuccess('Form submitted successfully');
            setCountdown(3); // Start 3-second countdown
        } catch (error) {
            console.error('Error submitting form:', error);
            setSuccess(null);
            setError('Error submitting form');
        }
    };

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);
        } else if (countdown === 0) {
            // Redirect based on selected plan
            setSelectedMenu('IncomeDetails');
        }
        return () => clearInterval(timer); // Clean up the timer on component unmount
    }, [countdown, selectedPlanId, setSelectedMenu]);

    return (
        <div>
            <div className="row d-flex justify-content-center m-3 mb-5">
                <div className="col bg-white rounded-3 shadow-sm p-3">
                    <h4 className="ps-3">Update Case</h4>
                </div>
            </div>
            <div className="row d-flex justify-content-center m-3">
                <div className="col bg-white rounded-3 shadow-sm p-3">
                    <form className="d-flex flex-column gap-4" onSubmit={handleSubmit}>
                        <div className="row d-flex">
                            <div className="col-4 d-flex flex-column">
                                <label htmlFor="case-num">Case Num</label>
                                <input
                                    id="case-num"
                                    type="text"
                                    value={latestCaseNum}
                                    readOnly
                                    placeholder="Case Number"
                                />
                            </div>
                            <div className="col-4 d-flex flex-column">
                                <label htmlFor="plan-id">Plan</label>
                                <select id="plan-id" value={selectedPlanId} onChange={handleSelectChange}>
                                    <option value="">Select Plan</option>
                                    {planOptions.map((plan) => (
                                        <option key={plan.PLAN_ID} value={plan.PLAN_NAME}>
                                            {plan.PLAN_NAME}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {error && <p className="text-danger">{error}</p>}
                        {success && (
                            <p className="text-success">
                                {success} {countdown ? `, wait you're beign redirect in ${countdown}s` : ''}
                            </p>
                        )}
                        <button type="submit" className="align-self-start px-3 py-1 rounded-1">
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PlanSelection;
