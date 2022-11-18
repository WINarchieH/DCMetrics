import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory,Route } from 'react-router-dom';
import { setUser,setNavbar,setSites,setSite } from '../../redux/actions';
import api from '../api/api';
import PropTypes from 'prop-types';



const PrivateRoute = ({path, exact, component, name, type}) => {
    /**
     * Private Route Component '
     * 
     * @param {string} path - URL path name
     * @param {bool} exact - boolean (should url match exactly) - default false
     * @param {func} component - react component to go to
     * @param {string} name - name of page and used to check if user has access to screen
     * @param {string} type (optional) - specifies the parent tab for the screen - necessary for checking if user can access
     */
    const [showScreen, setShowScreen] =  useState(false);
    const user = useCallback(useSelector(store => store.user), []); 
    const dispatch = useCallback(useDispatch(), []);
    const history = useCallback(useHistory(), []);
    const navbar = useSelector(store => store.navbar);

    useEffect(() => { // Check if user can access route (when clicking links within app)
        if (user && type && navbar) {
          
            let pages = navbar[type].map(x => x.Name);
           
            if (!pages.includes(name)) {
                history.push('/Dashboard');
            }
        }
        setShowScreen(true);
    }, [user, navbar, history, name, type]);

    useEffect(() => { // Check login state and retrieves session state 
        if (user === null) { 
         
            api.get('/Login/IsLoggedIn').then( (res) => { 
                let data = res.data;
                if (data.auth === 'User') { 
                  
                    let nav = JSON.parse(data.navbar);
                    dispatch(setUser(data.username));
                    dispatch(setNavbar(nav));
                    dispatch(setSites(JSON.parse(data.sites)));
                    dispatch(setSite(data.site));
                  
                    if (type) { // Check if user can access route via (when accessing via URL)
                      
                        let pages = nav[type].map(x => x.Name);
                        if (!pages.includes(name)) {
                            history.push('/Dashboard');
                        }
                    }
                 
                    setShowScreen(true);
                }
                else { // Not logged in
                    history.push('/');
                }
            });
        }
    }, [user, dispatch, history, name, type]);

    if (showScreen) {
        return (
            <Route path={path} exact={true ? exact : false} component={component}></Route> 
        );
    }
    else{
        return null;
    }
};

PrivateRoute.propTypes = {
    name: PropTypes.string,
    path: PropTypes.string,
    type: PropTypes.string,
    exact: PropTypes.bool,
    component: PropTypes.elementType
};

export default PrivateRoute;