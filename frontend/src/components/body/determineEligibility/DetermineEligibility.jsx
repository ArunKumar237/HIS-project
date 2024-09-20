import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DetermineEligibility = ({ setSelectedMenu }) => {
    const [caseNum, setCaseNum] = useState('');
    const [failure, setFailure] = useState('');
    const [success, setSuccess] = useState('');
    const [countdown, setCountdown] = useState(3); // Countdown state

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('access_token');

                // Fetch the latest case number
                const caseResponse = await axios.get(
                    'http://127.0.0.1:8000/api/Dc/get-latest-case-number/',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                // Check the response and set the case number
                if (caseResponse.data.CASE_NUM) {
                    setCaseNum(caseResponse.data.CASE_NUM);
                } else {
                    setFailure('No case number found');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setFailure('Error fetching data');
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        let timer;
        if (success && countdown > 0) {
            // Countdown logic
            timer = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);
        } else if (countdown === 0) {
            // Trigger action after countdown ends
            setSuccess(''); // Reset success message
            setCountdown(3); // Reset countdown for future use
            setSelectedMenu('Correspondence')
        }

        return () => clearInterval(timer); // Cleanup timer
    }, [success, countdown]);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        try {
            const token = localStorage.getItem('access_token');

            // Send a POST request to trigger eligibility check
            const response = await axios.post(
                'http://127.0.0.1:8000/api/eligible/eligibility/',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Handle success response
            if (response.status === 201) {
                setSuccess('Eligibility check successful');
                console.log('Eligibility data saved:', response.data);
            } else {
                setFailure('Eligibility check failed');
            }
        } catch (error) {
            console.error('Error during eligibility check:', error);
            setFailure('Error during eligibility check');
        }
    };

    return (
        <div>
            <div className="row d-flex justify-content-center m-3 mb-5">
                <div className="col bg-white rounded-3 shadow-sm p-3">
                    <h4 className="ps-3">Determine Eligibility</h4>
                </div>
            </div>
            <div className="row d-flex justify-content-center m-3">
                <div className="col bg-white rounded-3 shadow-sm p-3">
                    <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
                        <div className="col-4 d-flex flex-column gap-3">
                            <label htmlFor="caseNum" className="form-label">
                                Case Number
                            </label>
                            <input
                                type="number"
                                className="form-control"
                                id="caseNum"
                                value={caseNum}
                                readOnly
                            />
                            <button type="submit" className="align-self-start px-3 py-1 rounded-1">
                                Check Eligibility
                            </button>
                            {failure && <p className="text-danger">{failure}</p>}
                            {success && <p className="text-success">{`${success} ${countdown ? `, wait you're beign redirect in ${countdown}s` : ''}`}</p>}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DetermineEligibility;
