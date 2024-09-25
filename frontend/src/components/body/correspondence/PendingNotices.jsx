import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Import for table support
import axios from 'axios';
import './ViewNotices.css';

const ViewNotices = () => {
    const [loadingStates, setLoadingStates] = useState({}); // Track loading state for each notice
    const [confirmationMessages, setConfirmationMessages] = useState({}); // Track messages for each notice
    const [searchNotices, setSearchNotices] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // State to store the search term


    const generatePdfForNotice = (notice) => {
        const doc = new jsPDF();

        // Add a title at the top
        doc.setFontSize(18);
        doc.setTextColor(40, 40, 100); // Dark blue title color
        doc.text(`Notice for Insurance Plan: ${notice.PLAN_NAME}`, 10, 20);

        // Add a horizontal line below the title
        doc.setDrawColor(0, 0, 0); // Black line color
        doc.setLineWidth(0.5);
        doc.line(10, 25, 200, 25);

        // Set font size and color for the main content
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0); // Black text color

        // Prepare the headers and values
        const headers = [
            { header: 'Plan Status', dataKey: 'planStatus' },
            { header: 'Start Date', dataKey: 'startDate' },
            { header: 'End Date', dataKey: 'endDate' },
            { header: 'Benefit Amount', dataKey: 'benefitAmount' },
        ];

        const data = [
            {
                planStatus: notice.PLAN_STATUS || 'N/A',
                startDate: notice.PLAN_START_DATE || 'N/A',
                endDate: notice.PLAN_END_DATE || 'N/A',
                benefitAmount: notice.BENEFIT_AMT || 'N/A',
            },
        ];

        // Conditionally add the Denial Reason if it exists
        if (notice.DENIAL_REASON) {
            headers.push({ header: 'Denial Reason', dataKey: 'denialReason' });
            data[0].denialReason = notice.DENIAL_REASON;
        }

        // Configure the table options
        doc.autoTable({
            startY: 30, // Start position below the title
            head: [headers.map((h) => h.header)], // Extract headers
            body: [headers.map((h) => data[0][h.dataKey])], // Extract corresponding values
            styles: {
                halign: 'center', // Center align text horizontally
                valign: 'middle', // Middle align text vertically
                fontSize: 11,
                cellPadding: 5,
            },
            theme: 'grid', // Use grid theme to add borders to cells
            headStyles: { fillColor: [0, 102, 204], textColor: 255 }, // Blue header with white text
        });

        // Add a footer with the current date
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 10, doc.internal.pageSize.height - 10);

        // Open the generated PDF in a new window
        return doc.output('blob')
    };

    // Function to fetch notices with optional search term
    const fetchNotices = async (search = '') => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get(`http://127.0.0.1:8000/api/eligible/pendingNotices/?search=${search}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSearchNotices(response.data);
        } catch (error) {
            console.error('Error fetching notices:', error.response ? error.response.data : error.message);
        }
    };

    // Fetch notices on component mount or when searchTerm changes
    useEffect(() => {
        fetchNotices(searchTerm);
    }, [searchTerm]);

    // Handler for search input change
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const sendNotice = async (notice) => {
        setLoadingStates((prevState) => ({ ...prevState, [notice.ELIG_ID]: true })); // Set loading state

        try {
            const token = localStorage.getItem('access_token');

            // (Generate the PDF with content, as you did in the `generatePdfForNotice` function)
            const pdfBlob = await generatePdfForNotice(notice); // Make sure PDF is generated before continuing

            if (!pdfBlob) {
                throw new Error("Failed to generate PDF");
            }

            // Create FormData to send the PDF file
            const formData = new FormData();
            formData.append('pdf', pdfBlob, 'notice.pdf'); // Append the PDF blob with a file name

            // Send the request with FormData
            const response = await axios.post(
                `http://127.0.0.1:8000/api/eligible/pendingNotices/${notice.ELIG_ID}/send_notice/`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data', // Specify content type for file upload
                    },
                }
            );

            // Show confirmation message and remove the loading state
            setConfirmationMessages((prevState) => ({ ...prevState, [notice.ELIG_ID]: response.data.message }));
            setLoadingStates((prevState) => ({ ...prevState, [notice.ELIG_ID]: false }));

            // Optionally refresh notices to reflect updated data
            fetchNotices();
        } catch (error) {
            console.error('Error sending notice:', error.response ? error.response.data : error.message);
            setLoadingStates((prevState) => ({ ...prevState, [notice.ELIG_ID]: false })); // Remove loading state on error
        }
    };

    return (
        <div>
            <div className="row d-flex justify-content-center m-3 mb-5">
                <div className="col bg-white rounded-3 shadow-sm p-3 d-flex justify-content-between align-items-center">
                    <h4 className="ps-3">Pending Notices</h4>
                    {/* Search Input Field */}
                    <input
                        type="text"
                        placeholder="Search notices..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className='rounded'
                        style={{ padding: '8px', width: '300px' }}
                    />
                </div>
            </div>
            <div className="row d-flex justify-content-center m-3 mb-5">
                <div className="col bg-white rounded-3 shadow-sm p-3">
                    <table className="table text-center">
                        <thead className="align-middle">
                            <tr>
                                <th>Case Num</th>
                                <th>Plan Name</th>
                                <th>Plan Status</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Benefit Amount</th>
                                <th>Send Notice</th>
                            </tr>
                        </thead>
                        <tbody>
                            {searchNotices.map((notice) => (
                                <tr key={notice.ELIG_ID} className="align-middle">
                                    <td>{notice.CASE_NUM}</td>
                                    <td>{notice.PLAN_NAME}</td>
                                    <td>{notice.PLAN_STATUS}</td>
                                    <td>{notice.PLAN_START_DATE || 'N/A'}</td>
                                    <td>{notice.PLAN_END_DATE || 'N/A'}</td>
                                    <td>{notice.BENEFIT_AMT || 'N/A'}</td>
                                    <td className="d-flex align-items-center justify-content-center">
                                        {loadingStates[notice.ELIG_ID] ? (
                                            <img
                                                className='loading-icon'
                                                src="https://img.icons8.com/ios/30/spinner-frame-5.png" // Loading icon
                                                alt="Loading..."
                                                style={{ width: '30px', height: '30px' }}
                                            />
                                        ) : confirmationMessages[notice.ELIG_ID] ? (
                                            <img
                                                src="https://img.icons8.com/color/48/000000/checkmark.png" // Success icon
                                                alt="Mail sent successfully"
                                                style={{ width: '30px', height: '30px' }}
                                            />
                                        ) : (
                                            <img
                                                src="https://img.icons8.com/pulsar-color/48/send.png"
                                                alt="Send notice"
                                                style={{ cursor: 'pointer', width: '30px', height: '30px' }}
                                                onClick={() => sendNotice(notice)}
                                            />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ViewNotices;
