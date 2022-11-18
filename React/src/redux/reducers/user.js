import { SET_USER } from '../actionTypes';
/*
    User session is maintained via user.
*/
const initialState = null;

const user = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER: {
            return action.body.username;
        }
        default: {
            return state;
        }
    }
};

export default user;