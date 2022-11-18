import user from './user';

describe('user reducer', () => {
    it('user initial state is null', () => {
        expect(
            user(null, {})
        ).toEqual(
            null);
    });
    
    it('user setting user SET_USER', () => {
        expect(
            user(null, {
                type: 'SET_USER',
                body: {
                    username: 'New Username'
                }
            })
        ).toEqual('New Username');
    });
    
});