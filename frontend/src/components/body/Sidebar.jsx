import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ onSelectMenu }) => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [submenuVisible, setSubmenuVisible] = useState(false);

    // Submenu data
    const menus = [
        {
            text: "Dashboard",
            src: "https://img.icons8.com/ios/30/dashboard.png",
            submenu: [] // No submenu for Dashboard
        },
        {
            text: "Application Registration",
            src: "https://img.icons8.com/ios/30/edit-user-male.png",
            submenu: ["Create Application", "View Applications"] // Submenu items for Application Registration
        },
        {
            text: "Data Collection",
            src: "https://img.icons8.com/ios/30/data-backup.png",
            submenu: ["Plan Selection", "Income Details", "Education Details", "Kids Details", "Summary Screen"] // Submenu items for Data Collection
        },
        {
            text: "Eligibility Determination",
            src: "https://img.icons8.com/external-solid-adri-ansyah/30/external-startup-startup-and-new-business-solid-adri-ansyah-10.png",
            submenu: ["Determine Eligibility"] // Submenu items for Eligibility Determination
        },
        {
            text: "Correspondence",
            src: "https://img.icons8.com/ios/30/secured-letter--v1.png",
            submenu: ["View Notices", "Pending Notices", "History Notices"]
        },
        {
            text: "Benefit Issuance",
            src: "https://img.icons8.com/external-outline-geotatah/30/external-benefit-datanomics-outline-geotatah.png",
            submenu: []
        },
        {
            text: "Reports",
            src: "https://img.icons8.com/ios/30/graph-report.png",
            submenu: []
        },
        {
            text: "Admin",
            src: "https://img.icons8.com/ios/30/administrator-male--v1.png",
            submenu: ["Create Accounts", "View Accounts", "Create Plan Category", "Create Plans"]
        }
    ];

    // Handle click to show/hide submenu
    const handleClick = (index, e) => {
        e.preventDefault();
        if (activeIndex === index) {
            setSubmenuVisible(!submenuVisible); // Toggle submenu visibility
        } else {
            setActiveIndex(index);
            setSubmenuVisible(true); // Show submenu for the clicked item
        }
    };

    return (
        <ul className='list-unstyled d-flex flex-column w-100 mb-5 bg-light shadow-sm'>
            {menus.map((item, index) => (
                <li key={index} className='list-item'>
                    <a
                        style={{ fontSize: "1rem" }}
                        className='text-decoration-none text-black'
                        href="#"
                        onClick={(e) => handleClick(index, e)}
                    >
                        <div className={`p-3 ${activeIndex === index ? 'active-bg' : 'hover-bg'}`}>
                            <img className='list-menu-img' src={item.src} alt={item.text} />
                            &nbsp;&nbsp;{item.text}
                        </div>
                    </a>
                    {activeIndex === index && item.submenu.length > 0 && (
                        <ul className={`submenu ${submenuVisible ? 'visible' : ''} list-unstyled`}>
                            {item.submenu.map((submenuItem, subIndex) => (
                                <div onClick={() => onSelectMenu(submenuItem.trim().replaceAll(' ', ''))} style={{ fontSize: "1rem", cursor: "pointer" }} className='text-decoration-none text-black' key={subIndex}><li className='p-2 new-li'>{submenuItem}</li></div>
                            ))}
                        </ul>
                    )}
                </li>
            ))}
        </ul>
    );
};

export default Sidebar;
