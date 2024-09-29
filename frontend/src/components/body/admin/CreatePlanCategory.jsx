import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CreatePlanCategory.css'
import { API_BASE_URL } from '../../../../config';

const CreatePlanCategory = () => {
    const [categories, setCategories] = useState([])
    const [showModal, setShowModal] = useState(false);
    const [editCategory, setEditCategory] = useState(null);
    const [formData, setFormData] = useState({
        CATEGORY_NAME: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(`${API_BASE_URL}/api/plans/plancat/`, formData, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
            });
            console.log('Category successfully created:', response.data);
            setSuccess(true);
            setFormData({
                CATEGORY_NAME: '',
            });

            // Add the new category to the existing list
            setCategories(prevCategories => [response.data, ...prevCategories]);

            // Reset form data
            setFormData({
                CATEGORY_NAME: '',
            });
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    // Handle form submission for updating a category
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await axios.put(`${API_BASE_URL}/api/plans/plancat/${editCategory.CATEGORY_ID}/`, formData, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
            });
            console.log('Category successfully updated:', formData);
            setSuccess(true);
            setCategories(prevCategories => prevCategories.map(cat =>
                cat.CATEGORY_ID === editCategory.CATEGORY_ID ? { ...cat, ...formData } : cat
            ));
            setShowModal(false);
            setFormData({ CATEGORY_NAME: '' });
            setEditCategory(null);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    // Handle delete category
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await axios.delete(`${API_BASE_URL}/api/plans/plancat/${id}/`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    },
                });
                console.log('Category successfully deleted:', id);
                setCategories(prevCategories => prevCategories.filter(cat => cat.CATEGORY_ID !== id));
            } catch (err) {
                setError(err);
            }
        }
    };


    useEffect(() => {
        // Fetch data from the API
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/plans/plancat/`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
                });
                setCategories(response.data);  // Set the fetched data to state
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error fetching data: {error.message}</p>;

    return (
        <>
            <div className="row d-flex justify-content-center m-3 mb-5">
                <div className="col bg-white rounded-3 shadow-sm p-3">
                    <h4>Create Plan Category</h4>
                </div>
            </div>
            <div className="row d-flex justify-content-center m-3 mb-5">
                <div className="col bg-white rounded-3 shadow-sm p-3">
                    <form onSubmit={handleSubmit} className='d-flex flex-column gap-4'>
                        <div className="row d-flex gap-4">
                            <div className="col-4 d-flex flex-column">
                                <label htmlFor='CATEGORY_NAME'>Category Name</label>
                                <input
                                    type="text"
                                    name="CATEGORY_NAME"
                                    id="CATEGORY_NAME"
                                    value={formData.CATEGORY_NAME}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className='align-self-start px-3 py-1 rounded-1' disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>
                    </form>
                    <div className='mt-1'>
                        {success && <p className="success-message">Category created successfully!</p>}
                        {error && <p className="error-message">Error: {error.message}</p>}
                    </div>
                </div>

            </div>
            <div className="row d-flex justify-content-center m-3">
                <div className="col bg-white rounded-3 shadow-sm p-3">
                    <h4 className='pb-2 ps-2'>Plan Category List</h4>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <td>CATEGORY_ID</td>
                                <td>CATEGORY_NAME</td>
                                <td>CREATE_DATE</td>
                                <td>UPDATE_DATE</td>
                                <td>CREATED_BY</td>
                                <td>UPDATED_BY</td>
                                <td>UPDATE</td>
                                <td>DELETE</td>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map(cat => (
                                <tr key={cat.CATEGORY_ID}>
                                    <td>{cat.CATEGORY_ID}</td>
                                    <td>{cat.CATEGORY_NAME}</td>
                                    <td>{cat.CREATE_DATE}</td>
                                    <td>{cat.UPDATE_DATE}</td>
                                    <td>{cat.CREATED_BY}</td>
                                    <td>{cat.UPDATED_BY}</td>
                                    <td>
                                        <img
                                            style={{ cursor: 'pointer' }}
                                            src="https://img.icons8.com/color/20/restart--v1.png"
                                            alt="Update"
                                            onClick={() => {
                                                setEditCategory(cat);
                                                setFormData({
                                                    CATEGORY_NAME: cat.CATEGORY_NAME,
                                                });
                                                setShowModal(true);
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <img
                                            style={{ cursor: 'pointer' }}
                                            src="https://img.icons8.com/color/20/delete-forever.png"
                                            alt="Delete"
                                            onClick={() => handleDelete(cat.CATEGORY_ID)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Modal for updating category */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h4>Update Plan Category</h4>
                        <form onSubmit={handleUpdateSubmit} className='d-flex flex-column gap-4'>
                            <div className="row d-flex gap-4">
                                <div className="col d-flex flex-column gap-1">
                                    <label htmlFor='CATEGORY_NAME'>Category Name</label>
                                    <input
                                        className='ps-1'
                                        type="text"
                                        name="CATEGORY_NAME"
                                        id="CATEGORY_NAME"
                                        value={formData.CATEGORY_NAME}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className='d-flex gap-2'>
                                <button type="submit" className='align-self-start px-3 py-1 rounded-1' disabled={loading}>
                                    {loading ? 'Updating...' : 'Update'}
                                </button>
                                <button className='align-self-start px-3 py-1 rounded-1' onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default CreatePlanCategory