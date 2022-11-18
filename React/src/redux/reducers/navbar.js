import { SET_NAVBAR } from '../actionTypes';
/*
    User session is maintained via user.
*/
const initialState = null;

const navbar = (state = initialState, action) => {
    switch (action.type) {
        case SET_NAVBAR: {
            return action.body.navbar;
        }
        default: {
            return state;
        }
    }
};

export default navbar;