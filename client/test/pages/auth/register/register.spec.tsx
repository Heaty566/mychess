import * as React from 'react';
import { create, act } from 'react-test-renderer';

import Register from '../../../../pages/auth/register';
import { Provider } from 'react-redux';
import { store } from '../../../../store';
import { render } from '@testing-library/react';

describe('Register', () => {
    const mockFn = jest.fn();

    it('Render Correct Default', async () => {
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
    });
});
