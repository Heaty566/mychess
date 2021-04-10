import * as React from 'react';
import { render } from '@testing-library/react';

import LoginRoute from '../../../../pages/auth/login';
import { Provider } from 'react-redux';
import { store } from '../../../../store';

describe('Login', () => {
    it('Render Correct Default', async () => {
        let wrapper = render(
            <Provider store={store}>
                <LoginRoute />
            </Provider>,
        );
        const usernameTextField = await wrapper.findByTestId('textfield-input-username');
        const passwordTextField = await wrapper.findByTestId('textfield-input-password');

        expect(usernameTextField).toBeDefined();
        expect(passwordTextField).toBeDefined();

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
    });
});
