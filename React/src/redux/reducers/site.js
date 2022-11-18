import { SET_SITE } from '../actionTypes';
/*
    Available sites are stored in sites.
*/
const initialState = null;

const site = (state = initialState, action) => {
    switch (action.type) {
        case SET_SITE: {
            return action.body.site;
        }
        default: {
            return state;
        }
    }
};

export default site;