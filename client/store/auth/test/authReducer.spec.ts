import { store } from '../..';
import { authActions } from '..';
import { authThunk } from '../thunk';
import userThunk from '../userThunk';
import { User } from '../interface';

describe('AuthReducer', () => {
    const getAuthState = () => store.getState().auth;

    afterEach(() => {
        store.dispatch(authActions.resetState());
    });

    describe('resetAuth', () => {
        it('Pass', () => {
            const before = getAuthState();
            store.dispatch(authActions.updateLogin());
            store.dispatch(authActions.resetState());
            const after = getAuthState();

            expect(after).toStrictEqual(before);
        });
    });
    describe('updateLogin', () => {
        it('Pass', () => {
            store.dispatch(authActions.updateLogin());
            const newState = getAuthState();

            expect(newState.isLogin).toStrictEqual(true);
        });
    });
    describe('authThunk', () => {
        describe('loginUser', () => {
            it('fulfilled', () => {
                store.dispatch(authThunk.loginUser.fulfilled(null, 'done', { password: '123', username: '132' }));
                const newState = getAuthState();
                expect(newState.isLogin).toStrictEqual(true);
            });
        });

        describe('registerUser', () => {
            it('fulfilled', () => {
                store.dispatch(authThunk.registerUser.fulfilled(null, 'done', { password: '', username: '', confirmPassword: '', name: '' }));
                const newState = getAuthState();
                expect(newState.isLogin).toStrictEqual(true);
            });
        });
    });
    describe('userThunk', () => {
        describe('getCurrentUser', () => {
            it('rejected', () => {
                const userObject: User = {
                    avatarUrl: '123',
                    elo: 0,
                    email: 'fe',
                    id: '213',
                    name: '123',
                    phoneNumber: '132',
                    username: '123',
                };

                store.dispatch(userThunk.getCurrentUser.fulfilled(userObject, 'done'));
                const newState = getAuthState();
                expect(newState.avatarUrl).toStrictEqual(userObject.avatarUrl);
                expect(newState.elo).toStrictEqual(userObject.elo);
                expect(newState.email).toStrictEqual(userObject.email);
                expect(newState.id).toStrictEqual(userObject.id);
                expect(newState.name).toStrictEqual(userObject.name);
                expect(newState.phoneNumber).toStrictEqual(userObject.phoneNumber);
                expect(newState.username).toStrictEqual(userObject.username);
                expect(newState.isLogin).toStrictEqual(true);
            });
            it('rejected', () => {
                store.dispatch(userThunk.getCurrentUser.rejected(null, 'done'));
                const newState = getAuthState();
                expect(newState.isLogin).toStrictEqual(false);
            });
        });
    });
});
