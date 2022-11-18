import { SET_SITES } from '../actionTypes';
/*
    Available sites are stored in sites.
*/
const initialState = null;

const sites = (state = initialState, action) => {
    switch (action.type) {
        case SET_SITES: {
            return action.body.sites;
        }
        default: {
            return state;
        }
    }
};

export default sites;