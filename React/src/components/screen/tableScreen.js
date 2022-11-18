import React from 'react';
import PropTypes from 'prop-types';
import Header from '../header/header';
import '../../assets/panel.scss';

/*
    Template screen structure.
*/

const TableScreen = (props) => {
    /**
     * TableScreen component
     * 
     * @param {element} props.table - contains a table React element
     * @param {element} props.message - an element that displays message to the screen
     * @param {element} props.modal - a modal popup
     */

    return (
        //<div className='sidebar-container'> 
            <div>
                <Header></Header>
                <div className='screen-container'>
                    <div className='panel panel--table'>
                        {props.table}
                    </div>
                </div>
                {props.message}
                {props.modal}
            </div>
        //</div>
    );
};

TableScreen.propTypes = {
    table: PropTypes.element,
    message: PropTypes.element,
    modal: PropTypes.element
};

export default TableScreen;