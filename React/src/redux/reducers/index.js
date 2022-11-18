import { combineReducers } from 'redux';
import {LOGOUT} from '../actionTypes';
import user from './user';
import navbar from './navbar';
import sites from './sites';
import site from './site';
import data from './data';

// Refer to https://stackoverflow.com/questions/35622588/how-to-reset-the-state-of-a-redux-store
const appReducer =  combineReducers({ 
    user: user,
    navbar: navbar,
    sites: sites,
    site: site ,
    data: data
});

const rootReducer = (state, action) => {
    if (action.type === LOGOUT) {
        state = undefined;
    }

    return appReducer(state, action);
}

export default rootReducer;