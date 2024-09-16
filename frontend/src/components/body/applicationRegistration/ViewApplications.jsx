import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './ViewApplications.css';
import UpdateForm from './UpdateForm';

const ViewApplications = ({ onSelectDetail }) => {
    const [appRegs, setAppRegs] = useState([]);
    const [error, setError] = useState(null);
    const [selectedAppReg, setSelectedAppReg] = useState(null);
    const [showUpdatePopup, setShowUpdatePopup] = useState(false);
    const [selectedCaseNum, setSelectedCaseNum] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/Ar/appRegister/');
                setAppRegs(response.data);
            } catch (error) {
                setError(error.message || 'Error fetching data');
            }
        };

        fetchData();
    }, []);

    const handleUpdateClick = async (appId) => {
        const isConfirmed = window.confirm(`Are you sure you want to update the record ${appId}?`);
        if (!isConfirmed) return;
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/Ar/appRegister/${appId}/`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
            });
            setSelectedAppReg(response.data);
            setShowUpdatePopup(true);
        } catch (error) {
            console.error('Error details:', error.response);
            setError('Error getting record', error.response);
        }
    };

    const handleAccountUpdate = (updatedAppReg) => {
        setAppRegs((prevAppRegs) =>
            prevAppRegs.map((appReg) =>
                appReg.APP_ID === updatedAppReg.APP_ID ? updatedAppReg : appReg
            )
        );
    };

    const handleDelete = async (appId) => {
        const isConfirmed = window.confirm(`Are you sure you want to delete record ${appId}?`);
        if (!isConfirmed) return;
        try {
            await axios.delete(`http://127.0.0.1:8000/api/Ar/appRegister/${appId}/`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
            });
            setAppRegs(prevAppRegs => prevAppRegs.filter(appReg => appReg.APP_ID !== appId));
        } catch (error) {
            console.error('Error details:', error.response);
            setError('Error deleting record', error.response);
        }
    };

    const handleDetailClick = (appId) => {
        // Call the function passed from the parent component
        console.log('clicked')
        onSelectDetail(appId);
    };

    return (
        <div>
            <div className="row d-flex justify-content-center m-3 mb-5">
                <div className="col bg-white rounded-3 shadow-sm p-3">
                    <h4 className='ps-3'>ViewApplications</h4>
                </div>
            </div>
            <div className="row d-flex justify-content-center m-3">
                <div className="col bg-white rounded-3 shadow-sm p-3">
                    {error && <p>Error: {error}</p>}
                    {appRegs.length ? (
                        <table className='w-100 text-center'>
                            <thead>
                                <tr>
                                    <th>Case Number</th>
                                    <th>App ID</th>
                                    <th>Fullname</th>
                                    <th>Email</th>
                                    <th>Phone Number</th>
                                    <th>SSN</th>
                                    <th>Gender</th>
                                    <th>State</th>
                                    <th>Update</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appRegs.map(appReg => (
                                    <tr key={appReg.APP_ID}>
                                        <td style={{ cursor: 'pointer' }} onClick={() => handleDetailClick(appReg.APP_ID)}>
                                            {appReg.CASE_NUM}
                                        </td>
                                        <td>{appReg.APP_ID}</td>
                                        <td>{appReg.FULLNAME}</td>
                                        <td>{appReg.EMAIL}</td>
                                        <td>{appReg.PHNO}</td>
                                        <td>{appReg.SSN}</td>
                                        <td>{appReg.GENDER}</td>
                                        <td>{appReg.STATE_NAME}</td>
                                        <td>
                                            <img
                                                style={{ cursor: 'pointer' }}
                                                src="https://img.icons8.com/color/20/restart--v1.png"
                                                onClick={() => handleUpdateClick(appReg.APP_ID)}
                                                alt="Update"
                                            />
                                        </td>
                                        <td>
                                            <img
                                                style={{ cursor: 'pointer' }}
                                                src="https://img.icons8.com/color/20/delete-forever.png"
                                                onClick={() => handleDelete(appReg.APP_ID)}
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

                    {/* Popup forms */}
                    {showUpdatePopup && (
                        <UpdateForm appReg={selectedAppReg} setShowPopup={setShowUpdatePopup} onUpdate={handleAccountUpdate} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default ViewApplications