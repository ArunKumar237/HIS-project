import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CreatePlans.css'; // Ensure this file has styles for the modal

const CreatePlans = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        PLAN_NAME: '',
        PLAN_START_DATE: '',
        PLAN_END_DATE: '',
        PLAN_CATEGORY_ID: '',
    });
    const [editPlan, setEditPlan] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/plans/planmat/', formData, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
            });
            setPlans(prevPlans => [response.data, ...prevPlans]);
            setFormData({
                PLAN_NAME: '',
                PLAN_START_DATE: '',
                PLAN_END_DATE: '',
                PLAN_CATEGORY_ID: '',
            });
            alert('Plan created successfully!');
        } catch (error) {
            alert('Failed to create plan. Please try again.');
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://127.0.0.1:8000/api/plans/planmat/${editPlan.PLAN_ID}/`, formData, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
            });
            setPlans(prevPlans => prevPlans.map(plan =>
                plan.PLAN_ID === editPlan.PLAN_ID ? { ...plan, ...formData } : plan
            ));
            setShowModal(false);
            setFormData({
                PLAN_NAME: '',
                PLAN_START_DATE: '',
                PLAN_END_DATE: '',
                PLAN_CATEGORY_ID: '',
            });
        } catch (error) {
            alert('Failed to update plan. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this plan?')) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/plans/planmat/${id}/`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
                });
                setPlans(prevPlans => prevPlans.filter(plan => plan.PLAN_ID !== id));
            } catch (error) {
                alert('Failed to delete plan. Please try again.');
            }
        }
    };

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/plans/planmat/', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
                });
                setPlans(response.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error fetching data: {error.message}</p>;

    return (
        <>
            <div className="row d-flex justify-content-center m-3 mb-5">
                <div className="col bg-white rounded-3 shadow-sm p-3">
                    <h4 className='ps-3'>Create Plans</h4>
                </div>
            </div>
            <div className="row d-flex justify-content-center m-3">
                <div className="col bg-white rounded-3 shadow-sm p-3">
                    <form onSubmit={handleSubmit} className='d-flex flex-column gap-4'>
                        <div className="row d-flex gap-4">
                            <div className="col-4 d-flex flex-column">
                                <label htmlFor='PLAN_NAME'>Plan Name</label>
                                <input className='text-inp' type="text" name="PLAN_NAME" id="plan_name" onChange={handleInputChange} value={formData.PLAN_NAME} required />
                            </div>

                            <div className="col-4 d-flex flex-column">
                                <label htmlFor='PLAN_CATEGORY_ID'>Plan Category ID</label>
                                <input className='text-inp' type="number" name="PLAN_CATEGORY_ID" id="plan_category_id" onChange={handleInputChange} value={formData.PLAN_CATEGORY_ID} required />
                            </div>

                            <div className="col-4 d-flex flex-column">
                                <label htmlFor='PLAN_START_DATE'>Plan Start Date</label>
                                <input className='text-inp' type="date" name="PLAN_START_DATE" id="plan_start_date" onChange={handleInputChange} value={formData.PLAN_START_DATE} required />
                            </div>

                            <div className="col-4 d-flex flex-column">
                                <label htmlFor='PLAN_END_DATE'>Plan End Date</label>
                                <input className='text-inp' type="date" name="PLAN_END_DATE" id="plan_end_date" onChange={handleInputChange} value={formData.PLAN_END_DATE} required />
                            </div>
                        </div>
                        <button className='align-self-start px-3 py-1 rounded-1' type="submit">Submit</button>
                    </form>
                </div>
            </div>
            <div className="row d-flex justify-content-center m-3">
                <div className="col bg-white rounded-3 shadow-sm p-3">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Plan ID</th>
                                <th>Plan Name</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Category ID</th>
                                <th>Active Status</th>
                                <th>Create Date</th>
                                <th>Update Date</th>
                                <th>Update</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {plans.map(plan => (
                                <tr key={plan.PLAN_ID}>
                                    <td>{plan.PLAN_ID}</td>
                                    <td>{plan.PLAN_NAME}</td>
                                    <td>{plan.PLAN_START_DATE}</td>
                                    <td>{plan.PLAN_END_DATE}</td>
                                    <td>{plan.PLAN_CATEGORY_ID}</td>
                                    <td>{plan.ACTIVE_SW ? 'Yes' : 'No'}</td>
                                    <td>{plan.CREATE_DATE}</td>
                                    <td>{plan.UPDATE_DATE}</td>
                                    <td>
                                        <img
                                            style={{ cursor: 'pointer' }}
                                            src="https://img.icons8.com/color/20/restart--v1.png"
                                            alt="Update"
                                            onClick={() => {
                                                setEditPlan(plan);
                                                setFormData({
                                                    PLAN_NAME: plan.PLAN_NAME,
                                                    PLAN_START_DATE: plan.PLAN_START_DATE,
                                                    PLAN_END_DATE: plan.PLAN_END_DATE,
                                                    PLAN_CATEGORY_ID: plan.PLAN_CATEGORY_ID,
                                                });
                                                setShowModal(true);
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <img
                                            style={{ cursor: 'pointer', marginLeft: '10px' }}
                                            src="https://img.icons8.com/color/20/delete-forever.png"
                                            alt="Delete"
                                            onClick={() => handleDelete(plan.PLAN_ID)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for updating plan */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h4>Update Plan</h4>
                        <form onSubmit={handleUpdateSubmit} className='d-flex flex-column gap-4'>
                            <div className="row d-flex gap-4">
                                <div className="col-4 d-flex flex-column">
                                    <label htmlFor='PLAN_NAME'>Plan Name</label>
                                    <input
                                        className='text-inp'
                                        type="text"
                                        name="PLAN_NAME"
                                        id="plan_name"
                                        value={formData.PLAN_NAME}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="col-4 d-flex flex-column">
                                    <label htmlFor='PLAN_CATEGORY_ID'>Plan Category ID</label>
                                    <input
                                        className='text-inp'
                                        type="number"
                                        name="PLAN_CATEGORY_ID"
                                        id="plan_category_id"
                                        value={formData.PLAN_CATEGORY_ID}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="col-4 d-flex flex-column">
                                    <label htmlFor='PLAN_START_DATE'>Plan Start Date</label>
                                    <input
                                        className='text-inp'
                                        type="date"
                                        name="PLAN_START_DATE"
                                        id="plan_start_date"
                                        value={formData.PLAN_START_DATE}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="col-4 d-flex flex-column">
                                    <label htmlFor='PLAN_END_DATE'>Plan End Date</label>
                                    <input
                                        className='text-inp'
                                        type="date"
                                        name="PLAN_END_DATE"
                                        id="plan_end_date"
                                        value={formData.PLAN_END_DATE}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <button className='align-self-start px-3 py-1 rounded-1' type="submit">Update</button>
                            <button className='align-self-start px-3 py-1 rounded-1' type="button" onClick={() => setShowModal(false)}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default CreatePlans;
