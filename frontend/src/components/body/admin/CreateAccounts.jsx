import React, { useState } from 'react'

const CreateAccounts = () => {
    const [formData, setFormData] = useState({
        username: '',
        fullname: '',
        email: '',
        phno: '',
        gender: '',
        ssn: '',
        dob: ''
    })

    const handleSubmit = () => {

    }

    const handleInputChange = () => {

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
                                <label id='username'>Username</label>
                                <input className='text-inp' type="text" name="username" id="username" onChange={handleInputChange} value={FormData.username} />
                            </div>
                            <div className="col-4 d-flex flex-column">
                                <label id='fullname'>Fullname</label>
                                <input className='text-inp' type="text" name="fullname" id="fullname" onChange={handleInputChange} value={FormData.fullname} />
                            </div>
                            <div className="col-4 d-flex flex-column">
                                <label id='email'>Email address</label>
                                <input className='text-inp' type="email" name="email" id="email" onChange={handleInputChange} value={FormData.email} />
                            </div>
                        </div>
                        <div className="row d-flex justify-content-around">
                            <div className="col-4 d-flex flex-column">
                                <label id='phno'>Phone number</label>
                                <input className='text-inp' type="text" name="phno" id="phno" onChange={handleInputChange} value={FormData.phno} />
                            </div>
                            <div className="col-4 d-flex flex-column">
                                <label id='gender'>Gender</label>
                                {/* <input className='text-inp' type="email" name="email" id="email" onChange={handleInputChange} value={FormData.email} /> */}
                                <select className='select-inp' name="gender" id="gender" onChange={handleInputChange} value={FormData.gender}>
                                    <option value="">select</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                            <div className="col-4 d-flex flex-column">
                                <label id='ssn'>SSN</label>
                                <input className='text-inp' type="text" name="ssn" id="ssn" onChange={handleInputChange} value={FormData.ssn} />
                            </div>
                        </div>
                        <div className="row d-flex justify-content-start">
                            <div className="col-4 d-flex flex-column">
                                <label id='dob'>Date Of Birth</label>
                                <input className='text-inp' type="date" name="dob" id="dob" onChange={handleInputChange} value={FormData.dob} />
                            </div>
                        </div>
                        <button className='align-self-start px-3 py-1 rounded-1' type="submit">Submit</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default CreateAccounts