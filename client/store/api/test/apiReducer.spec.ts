import { store } from '../..';
import { apiActions } from '..';
import authThunk from '../../auth/thunk';

describe('ApiReducer', () => {
    const getAuthState = () => store.getState().api;

    afterEach(() => {
        store.dispatch(apiActions.resetState());
    });

    describe('resetState', () => {
        it('Pass', () => {
            const before = getAuthState();
            store.dispatch(apiActions.initReq());
            store.dispatch(apiActions.resetState());
            const after = getAuthState();

            expect(after).toStrictEqual(before);
        });
    });
    describe('initReq', () => {
        it('Pass', () => {
            store.dispatch(apiActions.initReq());
            const after = getAuthState();

            expect(after.isError).toStrictEqual(false);
            expect(after.isLoading).toStrictEqual(true);
        });
    });
    describe('updateErrorDetails', () => {
        it('Pass', () => {
            store.dispatch(apiActions.updateErrorDetails({ username: 'wrong' }));
            const after = getAuthState();

            expect(after.errorDetails.username).toStrictEqual('wrong');
            expect(after.isError).toStrictEqual(true);
        });
    });

    describe('authThunk', () => {
        describe('forgotPasswordByEmail', () => {
            it('fulfilled', () => {
                store.dispatch(authThunk.forgotPasswordByEmail.fulfilled({ message: '123', data: undefined, details: {} }, 'done', { email: '' }));
                const after = getAuthState();

                expect(after.message).toStrictEqual('123');
                expect(after.isError).toStrictEqual(false);
            });
        });
        describe('forgotPasswordByPhone', () => {
            it('fulfilled', () => {
                store.dispatch(
                    authThunk.forgotPasswordByPhone.fulfilled({ message: '123', data: undefined, details: {} }, 'done', { phoneNumber: '' }),
                );
                const after = getAuthState();

                expect(after.message).toStrictEqual('123');
                expect(after.isError).toStrictEqual(false);
            });
        });
    });
});
