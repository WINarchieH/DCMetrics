import React from 'react';
import Header from '../header/header';
import '../../assets/panel.scss';

const Screen = (props) => {
    return (
        <div>
            <Header></Header>
            <div className='screen-container'>
                <div className={props.center ? 'panel panel--center' : 'panel'}>
                    {props.children}
                </div>
            </div>
        </div>
    );
}

export default Screen;