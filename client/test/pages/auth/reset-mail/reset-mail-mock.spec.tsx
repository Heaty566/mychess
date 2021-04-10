import { useState } from 'react';
import * as React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { Provider, useSelector } from 'react-redux';

import { useFormError } from '../../../../common/hooks/useFormError';
import * as useTimer from '../../../../common/hooks/useTimer';
import ResetEmail from '../../../../pages/auth/reset-mail';
import { store } from '../../../../store';
import { authThunk } from '../../../../store/auth/thunk';

jest.mock('../../../../common/hooks/useFormError');
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
}));

describe('Register Mock', () => {
    const useFormErrorMock = useFormError as jest.Mock<any, any>;
    const useSelectorMock = useSelector as jest.Mock<any, any>;

    beforeEach(() => {
        useSelectorMock.mockReturnValue({
            isLoading: false,
            errorDetails: {},
            isError: false,
            message: '',
        });
        useFormErrorMock.mockReturnValue({ email: '' });
    });

    afterEach(() => {
        useFormErrorMock.mockClear();
        useSelectorMock.mockClear();
    });

    it('Render Correct Default Mock', async () => {
        let wrapper = render(
            <Provider store={store}>
                <ResetEmail />
            </Provider>,
        );

        const emailTextField = await wrapper.findByTestId('textfield-input-email');

        expect(emailTextField).toBeDefined();

        expect(wrapper).toMatchSnapshot();
        try {
            await wrapper.findByTestId('textfield-error-email');
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
        useFormErrorMock.mockReturnValue({
            email: 'error-message',
        });

        const wrapper = render(
            <Provider store={store}>
                <ResetEmail />
            </Provider>,
        );

        const emailError = await wrapper.findByTestId('textfield-error-email');

        expect(emailError.innerHTML).toContain('Email error-message');
    });

    it('Render with loading ', async () => {
        useSelectorMock.mockReturnValue({ isLoading: true, errorDetails: {}, isError: false, message: '' });

        const wrapper = render(
            <Provider store={store}>
                <ResetEmail />
            </Provider>,
        );

        const loadingWave = await wrapper.findByTestId('waveloading');
        expect(loadingWave).toBeDefined();
    });

    it('Render with success message ', async () => {
        useSelectorMock.mockReturnValue({ isLoading: false, errorDetails: {}, isError: false, message: 'hello' });

        const wrapper = render(
            <Provider store={store}>
                <ResetEmail />
            </Provider>,
        );

        const successMsg = await wrapper.findByText('hello');
        expect(successMsg).toBeDefined();
    });
    it('Render after submit screen allow resend ', async () => {
        useSelectorMock.mockReturnValue({ isLoading: false, errorDetails: {}, isError: false, message: '' });
        const useStateSpy = jest.spyOn(React, 'useState');
        const useTimerSpy = jest.spyOn(useTimer, 'useTimer');
        useStateSpy.mockImplementation(() => [true, jest.fn()]);
        useTimerSpy.mockImplementation(() => [60, true, jest.fn()]);
        const wrapper = render(
            <Provider store={store}>
                <ResetEmail />
            </Provider>,
        );

        const btnChangeMail = await wrapper.findByTestId('btnform-change-another-email');
        const timerCountDown = await wrapper.findByText('60s');
        const labelSendOther = await wrapper.findByText('Send me an another email.');
        expect(btnChangeMail).toBeDefined();
        expect(timerCountDown).toBeDefined();
        expect(labelSendOther).toBeDefined();

        useStateSpy.mockClear();
    });

    it('Render after submit screen allow resend with client here ', async () => {
        useSelectorMock.mockReturnValue({ isLoading: false, errorDetails: {}, isError: false, message: '' });
        const useStateSpy = jest.spyOn(React, 'useState');
        const useTimerSpy = jest.spyOn(useTimer, 'useTimer');
        useStateSpy.mockImplementation(() => [true, jest.fn()]);
        useTimerSpy.mockImplementation(() => [0, false, jest.fn()]);
        const wrapper = render(
            <Provider store={store}>
                <ResetEmail />
            </Provider>,
        );

        const btnChangeMail = await wrapper.findByTestId('btnform-change-another-email');
        const clickHereBtn = await wrapper.findByText('Click Here');
        const labelSendOther = await wrapper.findByText('Send me an another email.');
        expect(btnChangeMail).toBeDefined();
        expect(clickHereBtn).toBeDefined();
        expect(labelSendOther).toBeDefined();
        useTimerSpy.mockClear();
        useStateSpy.mockClear();
    });

    it('Function submit with isSubmit false', async () => {
        const submitMockFn = jest.fn();
        const authThunkSpy = jest.spyOn(authThunk, 'forgotPasswordByEmail');
        authThunkSpy.mockReturnValue(submitMockFn);

        const wrapper = render(
            <Provider store={store}>
                <ResetEmail />
            </Provider>,
        );
        const formLogin = await wrapper.findByTestId('reset-mail');

        await fireEvent.submit(formLogin);

        expect(submitMockFn).toBeCalledTimes(1);
        authThunkSpy.mockClear();
    });

    it('Function submit with isSubmit True', async () => {
        const authThunkSpy = jest.spyOn(authThunk, 'forgotPasswordByEmail');
        const submitMockFn = jest.fn();
        const useStateSpy = jest.spyOn(React, 'useState');
        useStateSpy.mockImplementation(() => [true, jest.fn()]);

        authThunkSpy.mockReturnValue(submitMockFn);

        const wrapper = render(
            <Provider store={store}>
                <ResetEmail />
            </Provider>,
        );
        const formLogin = await wrapper.findByTestId('reset-mail');
        await fireEvent.submit(formLogin);
        expect(submitMockFn).toBeCalledTimes(1);

        authThunkSpy.mockClear();
        useStateSpy.mockClear();
    });
});
