import { SET_DATA } from '../actionTypes';

const initialState = null;

const data = (state = initialState, action) => {
    switch (action.type) {
        case SET_DATA: {
            return action.body.data;
        }
        default: {
            return state;
        }
    }
};

export default data;