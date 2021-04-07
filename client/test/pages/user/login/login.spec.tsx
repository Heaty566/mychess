import * as React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import TestRenderer, { create } from 'react-test-renderer';
const { act } = TestRenderer;
import { useFormError } from '../../../../common/hooks/useFormError';
import LoginRoute from '../../../../pages/auth/login';
import { Provider, useSelector } from 'react-redux';
import { store } from '../../../../store';

jest.mock('../../common/hooks/useFormError');
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
}));
describe('LoginRoute', () => {
    const mockFn = jest.fn();
    const useFormErrorMock = useFormError as jest.Mock;
    const useSelectorMock = useSelector as jest.Mock<any, any>;

    beforeEach(() => {
        useSelectorMock.mockReturnValue({
            isLoading: false,
            errorDetails: {},
            isError: false,
            message: '',
        });
        useFormErrorMock.mockReturnValue({ username: '', password: '' });
    });

    afterEach(() => {
        useFormErrorMock.mockClear();
        useSelectorMock.mockClear();
    });

    it('Render Correct Default Mock', async () => {
        const wrapper = create(
            <Provider store={store}>
                <LoginRoute handleOnSubmit={mockFn} />
            </Provider>,
        );

        try {
            wrapper.root.findByProps({ 'data-testid': 'username-error' });
        } catch (err) {
            expect(err).toBeDefined();
        }
        try {
            wrapper.root.findByProps({ 'data-testid': 'wave-loading' });
        } catch (err) {
            expect(err).toBeDefined();
        }
    });

    it('Render  with error label', async () => {
        useFormErrorMock.mockReturnValue({ username: 'error-message', password: 'error-message' });

        const wrapper = create(
            <Provider store={store}>
                <LoginRoute handleOnSubmit={mockFn} />
            </Provider>,
        );

        const usernameError = wrapper.root.findByProps({ 'data-testid': 'username-error' });
        const passwordError = wrapper.root.findByProps({ 'data-testid': 'password-error' });
        expect(usernameError.children[0]).toContain('Username');
        expect(passwordError.children[0]).toContain('Password');
    });

    it('Render with loading ', async () => {
        useSelectorMock.mockReturnValue({ isLoading: true, errorDetails: {}, isError: false, message: '' });

        const wrapper = create(
            <Provider store={store}>
                <LoginRoute handleOnSubmit={mockFn} />
            </Provider>,
        );

        const loadingWave = wrapper.root.findByProps({ 'data-testid': 'wave-loading' });
        expect(loadingWave).toBeDefined();
    });

    it('Function submit', async () => {
        const submitMockFn = jest.fn();

        const wrapper = render(
            <Provider store={store}>
                <LoginRoute handleOnSubmit={submitMockFn} />
            </Provider>,
        );
        const formLogin = await wrapper.findByTestId('login-form');

        waitFor(
            () => {
                fireEvent.submit(formLogin);
                expect(submitMockFn).toHaveBeenCalled();
            },
            { timeout: 1000 },
        );
    });
});
