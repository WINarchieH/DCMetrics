import * as actions from './actions';

describe('user actions', () => {
    it('setUser should create SET_USER action', () => {
        expect(actions.setUser('User')).toEqual({
            type: 'SET_USER',
            body: {
                username: 'User'
            }
        })
    })
});
