import * as React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';

import Register from '../../../../pages/auth/register';
import { store } from '../../../../store';

describe('Register', () => {
    const mockFn = jest.fn();

    it('Render Correct Default', async () => {
        let wrapper = render(
            <Provider store={store}>
                <Register handleOnSubmit={mockFn} />
            </Provider>,
        );

        const nameTextField = await wrapper.findByTestId('textfield-input-name');
        const confirmPasswordTextField = await wrapper.findByTestId('textfield-input-confirmpassword');
        const usernameTextField = await wrapper.findByTestId('textfield-input-username');
        const passwordTextField = await wrapper.findByTestId('textfield-input-password');

        expect(usernameTextField).toBeDefined();
        expect(passwordTextField).toBeDefined();
        expect(nameTextField).toBeDefined();
        expect(confirmPasswordTextField).toBeDefined();

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
});
