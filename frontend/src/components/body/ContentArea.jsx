import React, { useState } from 'react'
import './ContentArea.css'
import CreateAccounts from './admin/CreateAccounts';

const ContentArea = () => {


    return (
        <div className="app">
            <Sidebar onSelectMenu={handleMenuSelection} />
            <div className="content">
                {renderContent()}
            </div>
        </div>
    )
}

export default ContentArea