import React from 'react';
import PropTypes from 'prop-types';
import './headerDropdown.scss';

const HeaderDropdown = (props) => {
    /**
     * Dropdown component for header.
     * @param {string} props.title - Dropdown title
     * @param {element} props.children - Array of links
     */

    return (
        <div className="header-dropdown">
            <div className="header-dropdown--title">{props.title}</div>
            <div className="header-dropdown--content">
                {props.children}
            </div>
        </div>
    )
};

HeaderDropdown.propTypes = {
    title: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.string
    ]),
    children: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.arrayOf(PropTypes.element)
    ])
};

export default HeaderDropdown;