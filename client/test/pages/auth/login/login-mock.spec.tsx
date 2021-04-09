import * as React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { Provider, useSelector } from 'react-redux';

import { useFormError } from '../../../../common/hooks/useFormError';
import LoginRoute from '../../../../pages/auth/login';
import { store } from '../../../../store';

jest.mock('../../../../common/hooks/useFormError');
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
}));

describe('Login Mock', () => {
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

    it('Render Correct Default', async () => {
        let wrapper = render(
            <Provider store={store}>
                <LoginRoute handleOnSubmit={mockFn} />
            </Provider>,
        );
        const usernameTextField = await wrapper.findByTestId('textfield-input-username');
        const passwordTextField = await wrapper.findByTestId('textfield-input-password');

        expect(usernameTextField).toBeDefined();
        expect(passwordTextField).toBeDefined();
        expect(wrapper).toMatchSnapshot();
        try {
            await wrapper.findByTestId('textfield-error-username');
        } catch (err) {
            expect(err).toBeDefined();
        }

        try {
            await wrapper.findByTestId('waveloading');
        } catch (err) {
            expect(err).toBeDefined();
        }
        try {
            await wrapper.findByTestId('successmsg');
        } catch (err) {
            expect(err).toBeDefined();
        }
    });

    it('Render with error label', async () => {
        useFormErrorMock.mockReturnValue({ username: 'error-message', password: 'error-message' });

        const wrapper = render(
            <Provider store={store}>
                <LoginRoute handleOnSubmit={mockFn} />
            </Provider>,
        );

        const usernameError = await wrapper.findByTestId('textfield-error-username');
        const passwordError = await wrapper.findByTestId('textfield-error-password');

        expect(usernameError.innerHTML).toContain('Username error-message');
        expect(passwordError.innerHTML).toContain('Password error-message');
    });

    it('Render with loading ', async () => {
        useSelectorMock.mockReturnValue({ isLoading: true, errorDetails: {}, isError: false, message: '' });

        const wrapper = render(
            <Provider store={store}>
                <LoginRoute handleOnSubmit={mockFn} />
            </Provider>,
        );

        const loadingWave = await wrapper.findByTestId('waveloading');
        expect(loadingWave).toBeDefined();
    });

    it('Render with success message ', async () => {
        useSelectorMock.mockReturnValue({ isLoading: false, errorDetails: {}, isError: false, message: 'hello' });

        const wrapper = render(
            <Provider store={store}>
                <LoginRoute handleOnSubmit={mockFn} />
            </Provider>,
        );

        const successMsg = await wrapper.findByText('hello');
        expect(successMsg).toBeDefined();
    });

    it('Function submit', async () => {
        const submitMockFn = jest.fn();

        const wrapper = render(
            <Provider store={store}>
                <LoginRoute handleOnSubmit={submitMockFn} />
            </Provider>,
        );
        const formLogin = await wrapper.findByTestId('auth-login');

        waitFor(
            () => {
                fireEvent.submit(formLogin);
                expect(submitMockFn).toHaveBeenCalled();
            },
            { timeout: 1000 },
        );
    });
});