import * as React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { Provider, useSelector } from 'react-redux';
import { useFormError } from '../../../../common/hooks/useFormError';
import Register from '../../../../pages/auth/register';
import { store } from '../../../../store';

jest.mock('../../../../common/hooks/useFormError');
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
}));

describe('Register Mock', () => {
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
        useFormErrorMock.mockReturnValue({ username: '', password: '', name: '', confirmPassword: '' });
    });

    afterEach(() => {
        useFormErrorMock.mockClear();
        useSelectorMock.mockClear();
    });

    it('Render Correct Default Mock', async () => {
        let wrapper = render(
            <Provider store={store}>
                <Register handleOnSubmit={mockFn} />
            </Provider>,
        );

        const nameTextField = await wrapper.findByTestId('name-text-field');
        const confirmPasswordTextField = await wrapper.findByTestId('confirmPassword-text-field');
        const usernameTextField = await wrapper.findByTestId('username-text-field');
        const passwordTextField = await wrapper.findByTestId('password-text-field');

        expect(usernameTextField).toBeDefined();
        expect(passwordTextField).toBeDefined();
        expect(nameTextField).toBeDefined();
        expect(confirmPasswordTextField).toBeDefined();
        expect(wrapper).toMatchSnapshot();
        try {
            await wrapper.findByTestId('username-error');
        } catch (err) {
            expect(err).toBeDefined();
        }

        try {
            await wrapper.findByTestId('wave-loading');
        } catch (err) {
            expect(err).toBeDefined();
        }
        try {
            await wrapper.findByTestId('success-msg');
        } catch (err) {
            expect(err).toBeDefined();
        }
    });

    it('Render with error label', async () => {
        useFormErrorMock.mockReturnValue({
            username: 'error-message',
            password: 'error-message',
            name: 'error-message',
            confirmPassword: 'error-message',
        });

        const wrapper = render(
            <Provider store={store}>
                <Register handleOnSubmit={mockFn} />
            </Provider>,
        );

        const nameError = await wrapper.findByTestId('name-error');
        const usernameError = await wrapper.findByTestId('username-error');
        const passwordError = await wrapper.findByTestId('password-error');
        const confirmPasswordError = await wrapper.findByTestId('confirmPassword-error');

        expect(nameError.innerHTML).toContain('Name error-message');
        expect(confirmPasswordError.innerHTML).toContain('Confirm Password error-message');
        expect(usernameError.innerHTML).toContain('Username error-message');
        expect(passwordError.innerHTML).toContain('Password error-message');
    });

    it('Render with loading ', async () => {
        useSelectorMock.mockReturnValue({ isLoading: true, errorDetails: {}, isError: false, message: '' });

        const wrapper = render(
            <Provider store={store}>
                <Register handleOnSubmit={mockFn} />
            </Provider>,
        );

        const loadingWave = await wrapper.findByTestId('wave-loading');
        expect(loadingWave).toBeDefined();
    });
    it('Render with success message ', async () => {
        useSelectorMock.mockReturnValue({ isLoading: false, errorDetails: {}, isError: false, message: 'hello' });

        const wrapper = render(
            <Provider store={store}>
                <Register handleOnSubmit={mockFn} />
            </Provider>,
        );

        const successMsg = await wrapper.findByText('hello');
        expect(successMsg).toBeDefined();
    });

    it('Function submit', async () => {
        const submitMockFn = jest.fn();

        const wrapper = render(
            <Provider store={store}>
                <Register handleOnSubmit={submitMockFn} />
            </Provider>,
        );
        const formLogin = await wrapper.findByTestId('register-form');

        waitFor(
            () => {
                fireEvent.submit(formLogin);
                expect(submitMockFn).toHaveBeenCalled();
            },
            { timeout: 1000 },
        );
    });
});
