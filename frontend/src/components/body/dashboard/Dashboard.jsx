import React, { useState, useEffect } from 'react'
import './Dashborad.css'
import axios from 'axios';

const Dashboard = () => {
    // State to hold the API data
    const [dashboardData, setDashboardData] = useState({
        plans: 0,
        approvedCitizens: 0,
        deniedCitizens: 0,
        benefitsGiven: 0,
        dateRange: "Jan 2022 to May 2023" // Default date range
    });

    // Fetch data from API when component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Replace with your API endpoint
                const response = await axios.get('http://127.0.0.1:8000/api/eligible/eligibilityFilter/stats', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    }
                });

                // Assuming the API returns an object like:
                // { plans: 24, approvedCitizens: 2423423, deniedCitizens: 24342, benefitsGiven: 24344352 }
                setDashboardData({
                    plans: response.data.total_plans,
                    approvedCitizens: response.data.total_approved,
                    deniedCitizens: response.data.total_denied,
                    benefitsGiven: response.data.total_benefit,
                    firstDate: response.data.first_date,
                    lastDate: response.data.last_date
                });
            } catch (error) {
                console.error('Error fetching dashboard data', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <div className="row d-flex justify-content-center m-3 mb-5">
                <div className="col bg-white rounded-3 shadow-sm p-3">
                    <h4 className="ps-3">Dashboard</h4>
                </div>
            </div>
            <div className="row d-flex justify-content-center m-3">
                <div className="col bg-white rounded-3 shadow-sm p-3">
                    <div className="row">
                        <div className="col-3">
                            <div id='card-1' style={{ height: "18rem" }} className="w-90 px-3 py-4 rounded-2 shadow-sm border border-1">
                                <p className="text-white fs-5 fw-medium m-0">No. of Plans</p>
                                <p className='text-white fs-1 fw-medium m-0'>{dashboardData.plans}</p>
                                <p className='text-white fs-5 fw-medium'>{`${dashboardData.firstDate} to ${dashboardData.lastDate}`}</p>
                                <div className="row d-flex justify-content-end">
                                    <img style={{ width: "7rem" }} src="https://img.icons8.com/?size=100&id=j3XI41kBOIXY&format=png&color=FFFFFF" alt="" />
                                </div>
                            </div>
                        </div>
                        <div className="col-3">
                            <div id='card-2' style={{ height: "18rem" }} className="w-90 px-3 py-4 rounded-2 shadow-sm border border-1">
                                <p className="text-white fs-5 fw-medium m-0">Citizens Approved</p>
                                <p className='text-white fs-1 fw-medium m-0'>{dashboardData.approvedCitizens}</p>
                                <p className='text-white fs-5 fw-medium'>{`${dashboardData.firstDate} to ${dashboardData.lastDate}`}</p>
                                <div className="row d-flex justify-content-end">
                                    <img style={{ width: "7rem" }} src="https://img.icons8.com/?size=100&id=5eocsnCvaiRd&format=png&color=FFFFFF" alt="" />
                                </div>
                            </div>
                        </div>
                        <div className="col-3">
                            <div id='card-3' style={{ height: "18rem" }} className="w-90 px-3 py-4 rounded-2 shadow-sm border border-1">
                                <p className="text-white fs-5 fw-medium m-0">Citizens Denied</p>
                                <p className='text-white fs-1 fw-medium m-0'>{dashboardData.deniedCitizens}</p>
                                <p className='text-white fs-5 fw-medium'>{`${dashboardData.firstDate} to ${dashboardData.lastDate}`}</p>
                                <div className="row d-flex justify-content-end">
                                    <img style={{ width: "7rem" }} src="https://img.icons8.com/?size=100&id=11220&format=png&color=FFFFFF" alt="" />
                                </div>
                            </div>
                        </div>
                        <div className="col-3">
                            <div id='card-4' style={{ height: "18rem" }} className="w-90 px-3 py-4 rounded-2 shadow-sm border border-1">
                                <p className="text-white fs-5 fw-medium m-0">Benefits Given</p>
                                <p className='text-white fs-1 fw-medium m-0'>{dashboardData.benefitsGiven}</p>
                                <p className='text-white fs-5 fw-medium'>{`${dashboardData.firstDate} to ${dashboardData.lastDate}`}</p>
                                <div className="row d-flex justify-content-end">
                                    <img style={{ width: "7rem" }} src="https://img.icons8.com/?size=100&id=37975&format=png&color=FFFFFF" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard