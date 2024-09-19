import React, { Fragment, useState } from 'react'
import Sidebar from './Sidebar'
import CreateAccounts from './admin/CreateAccounts'
import ViewAccounts from './admin/ViewAccounts'
import CreatePlans from './admin/CreatePlans'
import ViewPlans from './admin/ViewPlans'
import Correspondence from './correspondence/Correspondence'
import PendingNotices from './correspondence/PendingNotices'
import HistoryNotices from './correspondence/HistoryNotices'
import DetermineEligibility from './determineEligibility/DetermineEligibility'
import './Body.css'
import IncomeDetails from './datacollection/IncomeDetails'
import EducationDetails from './datacollection/EducationDetails'
import KidsDetails from './datacollection/KidsDetails'
import SummaryScreen from './datacollection/SummaryScreen'
import CreateApplication from './applicationRegistration/CreateApplication'
import ViewApplications from './applicationRegistration/ViewApplications'
import CreatePlanCategory from './admin/CreatePlanCategory'
import PlanSelection from './datacollection/PlanSelection'

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
            case 'dashboard':
                return <h1>Dashboard Content</h1>;
            case 'CreateAccounts':
                return <CreateAccounts />;
            case 'ViewAccounts':
                return <ViewAccounts />;
            case 'CreatePlans':
                return <CreatePlans />;
            case 'ViewPlans':
                return <ViewPlans />;
            case 'Correspondence':
                return <Correspondence />;
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
                return <h1>Welcome!</h1>;
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