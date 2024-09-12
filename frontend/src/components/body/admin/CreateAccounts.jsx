import React, { useState } from 'react'
import axios from 'axios'

const CreateAccounts = () => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [FormData, setFormData] = useState({
        USERNAME: '',
        FULLNAME: '',
        EMAIL: '',
        PHNO: '',
        GENDER: '',
        SSN: '',
        DOB: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/plans/casewrkacct/', FormData, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
            });
            setSuccess('Account created successfully!')
            setError('');
            console.log('Response data:', response.data)
        } catch (error) {
            if (error.response) {
                // Server responded with a status other than 200 range
                setError(`Error: ${error.response.data.detail || 'Something went wrong'}`)
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);
            } else if (error.request) {
                // Request was made but no response received
                setError('Error: No response from server');
                console.error('Error request:', error.request);
            } else {
                // Something else happened in setting up the request
                setError(`Error: ${error.message}`);
                console.error('Error message:', error.message);
            }
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...FormData,
            [name]: value
        });
    }

    return (
        <>
            <div className="row d-flex justify-content-center m-3 mb-5">
                <div className="col bg-white rounded-3 shadow-sm p-3">
                    <h4 className='ps-3'>Create Account</h4>
                </div>
            </div>
            <div className="row d-flex justify-content-center m-3">
                <div className="col bg-white rounded-3 shadow-sm p-3">
                    <form onSubmit={handleSubmit} className='d-flex flex-column gap-4'>
                        <div className="row d-flex justify-content-around">
                            <div className="col-4 d-flex flex-column">
                                <label htmlFor='USERNAME'>Username</label>
                                <input className='text-inp' type="text" name="USERNAME" id="username" onChange={handleInputChange} value={FormData.USERNAME} required />
                            </div>
                            <div className="col-4 d-flex flex-column">
                                <label htmlFor='FULLNAME'>Fullname</label>
                                <input className='text-inp' type="text" name="FULLNAME" id="fullname" onChange={handleInputChange} value={FormData.FULLNAME} required />
                            </div>
                            <div className="col-4 d-flex flex-column">
                                <label htmlFor='EMAIL'>Email address</label>
                                <input className='text-inp' type="email" name="EMAIL" id="email" onChange={handleInputChange} value={FormData.email} required />
                            </div>
                        </div>
                        <div className="row d-flex justify-content-around">
                            <div className="col-4 d-flex flex-column">
                                <label htmlFor='PHNO'>Phone number</label>
                                <input className='text-inp' type="text" name="PHNO" id="phno" onChange={handleInputChange} value={FormData.phno} required />
                            </div>
                            <div className="col-4 d-flex flex-column">
                                <label htmlFor='GENDER'>Gender</label>
                                <select className='select-inp' name="GENDER" id="gender" onChange={handleInputChange} value={FormData.GENDER}>
                                    <option value="">select</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                            <div className="col-4 d-flex flex-column">
                                <label htmlFor='SSN'>SSN</label>
                                <input className='text-inp' type="text" name="SSN" id="ssn" onChange={handleInputChange} value={FormData.ssn} required />
                            </div>
                        </div>
                        <div className="row d-flex justify-content-start">
                            <div className="col-4 d-flex flex-column">
                                <label htmlFor='DOB'>Date Of Birth</label>
                                <input className='text-inp' type="date" name="DOB" id="dob" onChange={handleInputChange} value={FormData.DOB} required />
                            </div>
                        </div>
                        {error && <div>{error}</div>}
                        {success && <div>{success}</div>}
                        <button className='align-self-start px-3 py-1 rounded-1' type="submit">Submit</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default CreateAccounts