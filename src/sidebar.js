import React from 'react';
import {slide as Menu} from 'react-burger-menu';
import {
    NavLink
} from "react-router-dom";

export default props => {
    return (
        <Menu>
            <NavLink className="menu-item" exact to="/">
            Home
            </NavLink>
            <NavLink className="menu-item" to="/eventlog">
            Event Log
            </NavLink>  
        </Menu>
        
    )
}