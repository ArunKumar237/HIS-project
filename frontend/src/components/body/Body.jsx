import React, { Fragment, useState } from 'react'
import Sidebar from './Sidebar'
import Reports from './reports/Reports'
import CreateAccounts from './admin/CreateAccounts'
import ViewAccounts from './admin/ViewAccounts'
import CreatePlans from './admin/CreatePlans'
import ViewNotices from './correspondence/ViewNotices'
import PendingNotices from './correspondence/PendingNotices'
import HistoryNotices from './correspondence/HistoryNotices'
import DetermineEligibility from './determineEligibility/DetermineEligibility'
import IncomeDetails from './datacollection/IncomeDetails'
import EducationDetails from './datacollection/EducationDetails'
import KidsDetails from './datacollection/KidsDetails'
import SummaryScreen from './datacollection/SummaryScreen'
import CreateApplication from './applicationRegistration/CreateApplication'
import ViewApplications from './applicationRegistration/ViewApplications'
import CreatePlanCategory from './admin/CreatePlanCategory'
import PlanSelection from './datacollection/PlanSelection'
import './Body.css'
import Dashboard from './dashboard/Dashboard'

const Body = () => {
    const [selectedMenu, setSelectedMenu] = useState('dashboard');
    const [selectedPlan, setSelectedPlan] = useState('');
    console.log('selectedPlan:', selectedPlan)

    // Function to handle submenu selection
    const handleMenuSelection = (menu) => {
        setSelectedMenu(menu);
    };

    const handleDetailSelection = (appId) => {
        setSelectedMenu('PlanSelection');
    };

    // Function to render UI based on selected submenu
    const renderContent = () => {
        console.log('selectedMenu:', selectedMenu);
        switch (selectedMenu) {
            case 'Dashboard':
                return <Dashboard />;
            case 'Reports':
                return <Reports setSelectedMenu={setSelectedMenu} />;
            case 'CreateAccounts':
                return <CreateAccounts />;
            case 'ViewAccounts':
                return <ViewAccounts />;
            case 'CreatePlans':
                return <CreatePlans />;
            case 'ViewPlans':
                return <ViewPlans />;
            case 'ViewNotices':
                return <ViewNotices />;
            case 'PendingNotices':
                return <PendingNotices />;
            case 'HistoryNotices':
                return <HistoryNotices />;
            case 'DetermineEligibility':
                return <DetermineEligibility setSelectedMenu={setSelectedMenu} />;
            case 'IncomeDetails':
                return <IncomeDetails setSelectedMenu={setSelectedMenu} selectedPlan={selectedPlan} />
            case 'EducationDetails':
                return <EducationDetails setSelectedMenu={setSelectedMenu} selectedPlan={selectedPlan} />
            case 'KidsDetails':
                return <KidsDetails setSelectedMenu={setSelectedMenu} selectedPlan={selectedPlan} />
            case 'SummaryScreen':
                return <SummaryScreen setSelectedMenu={setSelectedMenu} />
            case 'CreateApplication':
                return <CreateApplication />
            case 'ViewApplications':
                return <ViewApplications onSelectDetail={handleDetailSelection} />
            case 'CreatePlanCategory':
                return <CreatePlanCategory />
            case 'PlanSelection':
                return <PlanSelection setSelectedMenu={setSelectedMenu} setSelectedPlan={setSelectedPlan} selectedPlan={selectedPlan} />
            default:
                return <Dashboard />;
        }
    };

    return (
        <Fragment>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-2 d-flex justify-content-center p-0">
                        <Sidebar onSelectMenu={handleMenuSelection} />
                    </div>
                    <div className='col-10 content-area'>
                        <div className="content">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default Body