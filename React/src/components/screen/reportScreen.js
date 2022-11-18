import React from 'react';
import Header from '../header/header';
import '../../assets/panel.scss';

/*
    Template screen structure.
*/

const ReportScreen = (props) => {
    return (
        <div>
            <Header></Header>
            <div className='screen-container'>
                <div className='panel panel--report'>
                    {props.report}
                </div>
            </div>
            {props.message}
        </div>
    )
}

export default ReportScreen;