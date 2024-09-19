import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IncomeUpdate from './updateforms/IncomeUpdate';
import KidsUpdate from './updateforms/KidsUpdate';
import EducationUpdate from './updateforms/EducationUpdate';

const SummaryScreen = ({ setSelectedMenu }) => {
    const [incomeDetails, setIncomeDetails] = useState([]);
    const [kidsDetails, setKidsDetails] = useState([]);
    const [educationDetails, setEducationDetails] = useState([]);
    const [error, setError] = useState(null);
    const [selectedTable, setSelectedTable] = useState(null);
    const [showUpdatePopup, setShowUpdatePopup] = useState(false);
    const [updateType, setUpdateType] = useState(null);
    const [countdown, setCountdown] = useState(null);
    const [isCountdownActive, setIsCountdownActive] = useState(false);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('access_token');

            const [incomeRes, kidsRes, educationRes] = await Promise.all([
                axios.get('http://127.0.0.1:8000/api/Dc/Dc_income/', {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get('http://127.0.0.1:8000/api/Dc/Dc_children/', {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get('http://127.0.0.1:8000/api/Dc/Dc_education/', {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            setIncomeDetails(incomeRes.data);
            setKidsDetails(kidsRes.data);
            setEducationDetails(educationRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Error fetching data');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        let timer;
        if (isCountdownActive && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        } else if (countdown === 0) {
            // Redirect or perform some action when countdown reaches 0
            setIsCountdownActive(false);
            console.log('Countdown finished');
            setSelectedMenu('DetermineEligibility')
        }

        return () => clearInterval(timer);
    }, [isCountdownActive, countdown]);

    const handleUpdateClick = async (id, table, type) => {
        const isConfirmed = window.confirm(`Are you sure you want to update the record ${id}?`);
        if (!isConfirmed) return;

        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/Dc/${table}/${id}/`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
            });
            setSelectedTable(response.data);
            setUpdateType(type);
            setShowUpdatePopup(true);
        } catch (error) {
            console.error('Error details:', error?.response);
            setError('Error getting record');
        }
    };

    const handleDelete = async (id, table) => {
        const isConfirmed = window.confirm(`Are you sure you want to delete the record ${id}?`);
        if (!isConfirmed) return;

        try {
            await axios.delete(`http://127.0.0.1:8000/api/Dc/${table}/${id}/`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
            });
            fetchData(); // Refresh the data after deletion
        } catch (error) {
            console.error('Error deleting record:', error?.response);
            setError('Error deleting record');
        }
    };

    const handleAccountUpdate = async () => {
        setShowUpdatePopup(false);
        await fetchData();
    };

    const handleProceedClick = () => {
        setCountdown(3); // Set countdown duration (e.g., 3 seconds)
        setIsCountdownActive(true);
    };

    return (
        <div>
            <div className="row d-flex justify-content-center m-3 mb-5">
                <div className="col bg-white rounded-3 shadow-sm p-3">
                    <h4 className="ps-3">Summary</h4>
                </div>
            </div>

            {/* Income Table */}
            <div className="row d-flex justify-content-center m-3">
                <div className="col bg-white rounded-3 shadow-sm p-3">
                    <h5>Income Details</h5>
                    {incomeDetails.length ? (
                        <table className="w-100 text-center">
                            <thead>
                                <tr>
                                    <th>Income ID</th>
                                    <th>Case Num</th>
                                    <th>Employee Income</th>
                                    <th>Property Income</th>
                                    <th>Update</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {incomeDetails.map((income) => (
                                    <tr key={income.INCOME_ID}>
                                        <td>{income.INCOME_ID}</td>
                                        <td>{income.CASE_NUM}</td>
                                        <td>{income.EMP_INCOME}</td>
                                        <td>{income.PROPERTY_INCOME}</td>
                                        <td>
                                            <img
                                                style={{ cursor: 'pointer' }}
                                                src="https://img.icons8.com/color/20/restart--v1.png"
                                                onClick={() => handleUpdateClick(income.INCOME_ID, 'Dc_income', 'income')}
                                                alt="Update"
                                            />
                                        </td>
                                        <td>
                                            <img
                                                style={{ cursor: 'pointer' }}
                                                src="https://img.icons8.com/color/20/delete-forever.png"
                                                onClick={() => handleDelete(income.INCOME_ID, 'Dc_income')}
                                                alt="Delete"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </div>

            {/* Kids Table */}
            <div className="row d-flex justify-content-center m-3">
                <div className="col bg-white rounded-3 shadow-sm p-3">
                    <h5>Kids Details</h5>
                    {kidsDetails.length ? (
                        <table className="w-100 text-center">
                            <thead>
                                <tr>
                                    <th>Children ID</th>
                                    <th>Case Num</th>
                                    <th>Child DOB</th>
                                    <th>Child SSN</th>
                                    <th>Update</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {kidsDetails.map((child) => (
                                    <tr key={child.CHILDREN_ID}>
                                        <td>{child.CHILDREN_ID}</td>
                                        <td>{child.CASE_NUM}</td>
                                        <td>{child.CHILDREN_DOB}</td>
                                        <td>{child.CHILDREN_SSN}</td>
                                        <td>
                                            <img
                                                style={{ cursor: 'pointer' }}
                                                src="https://img.icons8.com/color/20/restart--v1.png"
                                                onClick={() => handleUpdateClick(child.CHILDREN_ID, 'Dc_children', 'kids')}
                                                alt="Update"
                                            />
                                        </td>
                                        <td>
                                            <img
                                                style={{ cursor: 'pointer' }}
                                                src="https://img.icons8.com/color/20/delete-forever.png"
                                                onClick={() => handleDelete(child.CHILDREN_ID, 'Dc_children')}
                                                alt="Delete"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </div>

            {/* Education Table */}
            <div className="row d-flex justify-content-center m-3">
                <div className="col bg-white rounded-3 shadow-sm p-3">
                    <h5>Education Details</h5>
                    {educationDetails.length ? (
                        <table className="w-100 text-center">
                            <thead>
                                <tr>
                                    <th>Education ID</th>
                                    <th>Case Num</th>
                                    <th>Qualification</th>
                                    <th>Graduation Yr</th>
                                    <th>Update</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {educationDetails.map((edu) => (
                                    <tr key={edu.EDU_ID}>
                                        <td>{edu.EDU_ID}</td>
                                        <td>{edu.CASE_NUM}</td>
                                        <td>{edu.HIGHEST_QUALIFICATION}</td>
                                        <td>{edu.GRADUATION_YEAR}</td>
                                        <td>
                                            <img
                                                style={{ cursor: 'pointer' }}
                                                src="https://img.icons8.com/color/20/restart--v1.png"
                                                onClick={() => handleUpdateClick(edu.EDU_ID, 'Dc_education', 'education')}
                                                alt="Update"
                                            />
                                        </td>
                                        <td>
                                            <img
                                                style={{ cursor: 'pointer' }}
                                                src="https://img.icons8.com/color/20/delete-forever.png"
                                                onClick={() => handleDelete(edu.EDU_ID, 'Dc_education')}
                                                alt="Delete"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Loading...</p>
                    )}
                    {isCountdownActive && <p className="text-success mt-3">{`${countdown ? `, wait you're beign redirect in ${countdown}s` : ''}`}</p>}
                </div>
            </div>

            {/* Proceed Button */}
            <div className="row d-flex justify-content-center m-3">
                <div className="col">
                    <button
                        type="button"
                        className='align-self-start px-3 py-1 rounded-1'
                        onClick={handleProceedClick}
                    >
                        Proceed
                    </button>
                </div>
            </div>

            {/* Popup forms */}
            {showUpdatePopup && updateType === 'income' && (
                <IncomeUpdate
                    selectedTable={selectedTable}
                    setShowPopup={setShowUpdatePopup}
                    onUpdate={handleAccountUpdate}
                />
            )}
            {showUpdatePopup && updateType === 'kids' && (
                <KidsUpdate
                    selectedTable={selectedTable}
                    setShowPopup={setShowUpdatePopup}
                    onUpdate={handleAccountUpdate}
                />
            )}
            {showUpdatePopup && updateType === 'education' && (
                <EducationUpdate
                    selectedTable={selectedTable}
                    setShowPopup={setShowUpdatePopup}
                    onUpdate={handleAccountUpdate}
                />
            )}
        </div>
    );
};

export default SummaryScreen;
