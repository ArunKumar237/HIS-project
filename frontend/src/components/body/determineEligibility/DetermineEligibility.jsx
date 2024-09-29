import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../../config';

const DetermineEligibility = ({ setSelectedMenu }) => {
    const [caseNum, setCaseNum] = useState('');
    const [failure, setFailure] = useState('');
    const [success, setSuccess] = useState('');
    const [caseData, setCaseData] = useState(null); // State to store fetched case data
    const [isTableVisible, setIsTableVisible] = useState(false); // State to control table visibility

    // Fetch the latest case number on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('access_token');

                // Fetch the latest case number
                const caseResponse = await axios.get(
                    `${API_BASE_URL}/api/Dc/get-latest-case-number/`,
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
                console.error('Error fetching data:', error.response ? error.response.data : error.message);
                setFailure('Error fetching data');
            }
        };

        fetchData();
    }, []);

    // Fetch case data after eligibility check submission
    const fetchCaseData = async () => {
        try {
            const token = localStorage.getItem('access_token');

            // Fetch data related to the latest case number
            const response = await axios.get(
                `${API_BASE_URL}/api/eligible/eligibility/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Handle response when it returns an array
            console.log('caseNum:', caseNum);
            console.log('response data:', response.status === 200, 'and', response.data, Array.isArray(response.data), 'and', response.data.length > 0)
            if (response.status === 200 && Array.isArray(response.data) && response.data.length > 0) {
                // Filter to get the records that match the case number
                const matchingRecords = response.data.filter((record) => record.CASE_NUM === caseNum);
                console.log('matching records:', matchingRecords);

                // Display the latest record for the current case number
                if (matchingRecords.length > 0) {
                    setCaseData(matchingRecords[matchingRecords.length - 1]); // Display the latest entry
                    setIsTableVisible(true); // Show the table
                } else {
                    setFailure('No data found for this case number');
                }
            } else {
                console.error('Unexpected response structure:', response.data); // Log entire response for debugging
                setFailure('No data found for this case number');
            }
        } catch (error) {
            console.error('Error fetching case data:', error.response ? error.response.data : error.message);
            setFailure('Error fetching case data');
        }
    };

    // Handle form submission to trigger eligibility check
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('access_token');

            // Send a POST request to trigger eligibility check
            const response = await axios.post(
                `${API_BASE_URL}/api/eligible/eligibility/`,
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
                await fetchCaseData(); // Fetch the latest data after successful submission
            } else {
                setFailure('Eligibility check failed');
            }
        } catch (error) {
            console.error('Error during eligibility check:', error.response ? error.response.data : error.message);
            setFailure('Error during eligibility check');
        }
    };

    // Handle the "Generate Correspondence" button click
    const handleGenerateCorrespondence = () => {
        setSelectedMenu('ViewNotices');
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
                            <div>
                                {failure && <p className="text-danger">{failure}</p>}
                                {success && <p className="text-success">{success}</p>}
                                <button type="submit" className="align-self-start px-3 py-1 rounded-1">
                                    Check Eligibility
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Conditional rendering of the table based on isTableVisible state */}
            {isTableVisible && caseData && (
                <div className="row d-flex justify-content-center m-3 mb-5">
                    <div className="col bg-white rounded-3 shadow-sm p-3">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Plan Name</th>
                                    <th>Plan Status</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Benefit Amount</th>
                                    <th>Denial Reason</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{caseData.PLAN_NAME}</td>
                                    <td>{caseData.PLAN_STATUS}</td>
                                    <td>{caseData.PLAN_START_DATE || 'N/A'}</td>
                                    <td>{caseData.PLAN_END_DATE || 'N/A'}</td>
                                    <td>{caseData.BENEFIT_AMT || 'N/A'}</td>
                                    <td>{caseData.DENIAL_REASON || 'N/A'}</td>
                                </tr>
                            </tbody>
                        </table>
                        {/* Button to handle "Generate Correspondence" */}
                        <button
                            className="align-self-start px-3 py-1 rounded-1"
                            onClick={handleGenerateCorrespondence}
                        >
                            Generate Correspondence
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetermineEligibility;
