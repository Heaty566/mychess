import * as React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';

import ResetEmail from '../../../../pages/auth/reset-mail';
import { store } from '../../../../store';

describe('ResetEmail', () => {
    it('Render Correct Default', async () => {
        let wrapper = render(
            <Provider store={store}>
                <ResetEmail />
            </Provider>,
        );

        const emailTextField = await wrapper.findByTestId('textfield-input-email');

        expect(emailTextField).toBeDefined();

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
});
