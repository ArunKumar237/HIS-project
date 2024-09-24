import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx'; // For Excel download
import jsPDF from 'jspdf'; // For PDF download
import 'jspdf-autotable'; // For table in PDF

const Reports = () => {
    // State for filter inputs
    const [planName, setPlanName] = useState('');
    const [planStatus, setPlanStatus] = useState('');
    const [gender, setGender] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [results, setResults] = useState([]); // State to hold the fetched results

    // Example options for dropdowns (you might want to fetch these from your API)
    const planNames = ['SNAP', 'CCAP', 'MEDICARE', 'NJW'];
    const planStatuses = ['Approved', 'Rejected'];
    const genders = ['Male', 'Female'];

    // Fetch all data when the component mounts
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const token = localStorage.getItem('access_token'); // Assuming you're using JWT for authentication
                const response = await axios.get('http://127.0.0.1:8000/api/eligible/eligibilityFilter/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setResults(response.data); // Populate the table with all data
            } catch (error) {
                console.error('Error fetching initial data:', error.response ? error.response.data : error.message);
            }
        };

        fetchAllData();
    }, []); // Empty dependency array to fetch data once on mount

    // Handle filter submission
    const handleFilterSubmit = async (e) => {
        e.preventDefault();

        // Build the query parameters
        const params = {
            PLAN_NAME: planName,
            PLAN_STATUS: planStatus,
            GENDER: gender,
            START_DATE: startDate,
            END_DATE: endDate,
        };
        console.log("params:", params)
        try {
            const token = localStorage.getItem('access_token'); // Assuming you're using JWT for authentication
            const response = await axios.get('http://127.0.0.1:8000/api/eligible/eligibilityFilter/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: params,
            });

            // Update the results state with the fetched data
            setResults(response.data);
            console.log(response.data); // For debugging
        } catch (error) {
            console.error('Error fetching data:', error.response ? error.response.data : error.message);
        }
    };

    // Function to download data as Excel
    const downloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(results);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Reports');
        XLSX.writeFile(workbook, 'Reports.xlsx');
    };

    // Function to download data as PDF
    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text("Reports", 20, 10);
        doc.autoTable({
            head: [['S.No', 'Name', 'Email', 'Mobile Number', 'Gender', 'SSN']],
            body: results.map((item, index) => [
                index + 1,
                item.FULLNAME,
                item.EMAIL,
                item.PHNO,
                item.GENDER,
                item.SSN,
            ]),
        });
        doc.save('Reports.pdf');
    };

    return (
        <div>
            <div className="row d-flex justify-content-center m-3 mb-5">
                <div className="col bg-white rounded-3 shadow-sm p-3">
                    <h4 className="ps-3">Reports</h4>
                </div>
            </div>
            <div className="row d-flex justify-content-center m-3">
                <div className="col bg-white rounded-3 shadow-sm p-3">
                    <form onSubmit={handleFilterSubmit}>
                        <div className="d-flex gap-3">
                            <div className="mb-3">
                                <label htmlFor="planName" className="form-label">Plan Name</label>
                                <select
                                    id="planName"
                                    className="form-select"
                                    value={planName}
                                    onChange={(e) => setPlanName(e.target.value)}
                                >
                                    <option value="">Select Plan Name</option>
                                    {planNames.map((name) => (
                                        <option key={name} value={name}>{name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="planStatus" className="form-label">Plan Status</label>
                                <select
                                    id="planStatus"
                                    className="form-select"
                                    value={planStatus}
                                    onChange={(e) => setPlanStatus(e.target.value)}
                                >
                                    <option value="">Select Plan Status</option>
                                    {planStatuses.map((status) => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="gender" className="form-label">Gender</label>
                                <select
                                    id="gender"
                                    className="form-select"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                >
                                    <option value="">Select Gender</option>
                                    {genders.map((genderOption) => (
                                        <option key={genderOption} value={genderOption}>{genderOption}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="startDate" className="form-label">Plan Start Date</label>
                                <input
                                    type="date"
                                    id="startDate"
                                    className="form-control"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="endDate" className="form-label">Plan End Date</label>
                                <input
                                    type="date"
                                    id="endDate"
                                    className="form-control"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <button type="submit" className="align-self-start px-3 py-1 rounded-1">Apply Filters</button>
                    </form>
                </div>
            </div>

            {/* Display results after fetching */}
            <div className="row d-flex justify-content-center m-3">
                <div className="col bg-white rounded-3 shadow-sm p-3">
                    <h5 className="ps-3">Results</h5>
                    <div className="d-flex gap-2 mb-3">
                        <button className="btn btn-primary" onClick={downloadExcel}>Download Excel</button>
                        <button className="btn btn-danger" onClick={downloadPDF}>Download PDF</button>
                    </div>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Mobile Number</th>
                                <th>Gender</th>
                                <th>SSN</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((item, index) => (
                                <tr key={item.ELIG_ID}>
                                    <td>{index + 1}</td>
                                    <td>{item.FULLNAME}</td>
                                    <td>{item.EMAIL}</td>
                                    <td>{item.PHNO}</td>
                                    <td>{item.GENDER}</td>
                                    <td>{item.SSN}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Reports;
