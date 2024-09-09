import React, { Fragment } from 'react'
import Sidebar from './Sidebar'
import ContentArea from './ContentArea'
import './Body.css'

const Body = () => {
    return (
        <Fragment>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-2 d-flex justify-content-center p-0">
                        <Sidebar />
                    </div>
                    <div className='col-10 content-area'>
                        <ContentArea />
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default Body