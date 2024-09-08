// import React from 'react'
import axios from '../../axios';
import { useState, useEffect } from 'react';

const Cases = () => {
    const [data, setdata] = useState('');

    useEffect(() => {
        // Call the async function inside useEffect
        const fetchProtectedData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/Dc/Dc_cases');
                setdata(response.data);
            } catch (error) {
                console.error('Error fetching protected data:', error);
                // Handle error
            }
        };

        fetchProtectedData();
    }, []);

    return (
        <div>
            {data.length > 0 ? (
                <ul>
                    {data.map((item, index) => (
                        <li key={index}>
                            <div className='d-flex gap-3'>
                                <p>Case ID: {item.CASE_ID}</p>
                                <p>Case Number: {item.CASE_NUM}</p>
                                <p>App ID: {item.APP_ID}</p>
                                <p>Plan ID: {item.PLAN_ID}</p>
                            </div>
                        </li> // Adjust this according to the structure of your data
                    ))}
                </ul>
            ) : (
                <p>No data available</p>
            )}
        </div>
    );
}

export default Cases



