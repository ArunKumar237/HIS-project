import axios from 'axios';
import React, { useEffect, useState } from 'react'
import './ViewAccounts.css'
import UpdateForm from './UpdateForm';

const ViewAccounts = () => {
    const [Accounts, setAccounts] = useState('');
    const [error, setError] = useState(null);
    const [worker, setWorker] = useState({
        ACC_ID: '',
        USERNAME: '',
        FULLNAME: '',
        EMAIL: '',
        PHNO: '',
        GENDER: '',
        SSN: '',
        DOB: '',
        ACTIVE_SW: ''
    });
    // State to control popup visibility
    const [showPopup, setShowPopup] = useState(false);


    useEffect(() => {
        // Define the async function inside useEffect
        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/plans/casewrkacct/', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    },
                });
                setAccounts(response.data); // Set the response data to state

            } catch (error) {
                setError(error.message || 'Error fetching data');
            }
        };

        fetchData(); // Call the async function
    }, []);

    const toggleActiveStatus = async (accountId, isActive) => {
        const isConfirmed = window.confirm(`Are you sure you want ${isActive ? 'De-Activate' : 'Activate'} account ${accountId}?`);
        if (!isConfirmed) return;
        try {
            const response = await axios.patch(`http://127.0.0.1:8000/api/plans/casewrkacct/${accountId}/`, { ACTIVE_SW: !isActive }, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
            });

            // Update the accounts state using a function to ensure the latest state is used
            setAccounts(prevAccounts =>
                prevAccounts.map(account =>
                    account.ACC_ID === accountId
                        ? { ...account, ACTIVE_SW: !account.ACTIVE_SW }  // Toggle the active status
                        : account
                )
            );
        } catch (error) {
            console.error('Error details:', error.response);
            setError('Error updating status', error.response);
        }
    };

    const updateImg = (state) => {
        if (state) {
            return 'https://img.icons8.com/color/20/ok.png'
        } else {
            return 'https://img.icons8.com/color/20/cancel--v1.png'
        }
    };

    const handleDelete = async (accountId) => {
        const isConfirmed = window.confirm(`Are you sure you want to delete account ${accountId}?`);
        if (!isConfirmed) return;
        try {
            const response = await axios.delete(`http://127.0.0.1:8000/api/plans/casewrkacct/${accountId}/`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
            });

            // After successful deletion, remove the account from the Accounts state
            setAccounts(prevAccounts => prevAccounts.filter(account => account.ACC_ID !== accountId));
        } catch (error) {
            console.error('Error details:', error.response);
            setError('Error deleting account', error.response);
        }
    }


    // Function to open the popup
    const handleUpdateClick = async (accountId) => {
        const isConfirmed = window.confirm(`Are you sure you want to update account ${accountId}?`);
        if (!isConfirmed) return;
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/plans/casewrkacct/${accountId}/`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
            });
            setWorker(response.data)
            console.log('worker', worker)
            console.log('response data', response.data)
        } catch (error) {
            console.error('Error details:', error.response);
            setError('Error getting account', error.response);
        }
        setShowPopup(true);
    };

    const handleAccountUpdate = (updatedWorker) => {
        setAccounts((prevAccounts) =>
            prevAccounts.map((account) =>
                account.ACC_ID === updatedWorker.ACC_ID ? updatedWorker : account
            )
        );
    };


    return (
        <>
            <div className="row d-flex justify-content-center m-3 mb-5">
                <div className="col bg-white rounded-3 shadow-sm p-3">
                    <h4 className='ps-3'>View Accounts</h4>
                </div>
            </div>
            <div className="row d-flex justify-content-center m-3">
                <div className="col bg-white rounded-3 shadow-sm p-3">
                    {error && <p>Error: {error}</p>}
                    {Accounts ? (
                        <table className='w-100 text-center'>
                            <thead>
                                <tr>
                                    <th>id</th>
                                    <th>username</th>
                                    <th>fullname</th>
                                    <th>phno</th>
                                    <th>gender</th>
                                    <th>isActive</th>
                                    <th>update</th>
                                    <th>delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Accounts.map(worker => (
                                    <tr key={worker.ACC_ID}>
                                        <td>{worker.ACC_ID}</td>
                                        <td>{worker.USERNAME}</td>
                                        <td>{worker.FULLNAME}</td>
                                        <td>{worker.PHNO}</td>
                                        <td>{worker.GENDER}</td>
                                        <td>
                                            <img
                                                style={{ cursor: 'pointer' }}
                                                src={updateImg(worker.ACTIVE_SW)}
                                                onClick={() => toggleActiveStatus(worker.ACC_ID, worker.ACTIVE_SW)}
                                                alt="" />
                                        </td>
                                        <td>
                                            <img
                                                style={{ cursor: 'pointer' }}
                                                src="https://img.icons8.com/color/20/restart--v1.png"
                                                onClick={() => handleUpdateClick(worker.ACC_ID)}
                                                alt=""
                                            />
                                        </td>
                                        <td>
                                            <img
                                                style={{ cursor: 'pointer' }}
                                                src="https://img.icons8.com/color/20/delete-forever.png"
                                                onClick={() => handleDelete(worker.ACC_ID)}
                                                alt="" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Loading...</p>
                    )}

                    {/* Popup form */}
                    {showPopup && (
                        <UpdateForm worker={worker} setShowPopup={setShowPopup} onUpdate={handleAccountUpdate} />
                    )}
                </div>
            </div>
        </>
    )
}

export default ViewAccounts