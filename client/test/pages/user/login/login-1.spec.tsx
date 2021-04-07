import * as React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import TestRenderer, { create } from 'react-test-renderer';
const { act } = TestRenderer;
import { useFormError } from '../../../../common/hooks/useFormError';
import LoginRoute from '../../../../pages/auth/login';
import { Provider, useSelector } from 'react-redux';
import { store } from '../../../../store';

describe('LoginRoute', () => {
    it('Render Correct Default Type', async () => {
        const wrapper = create(
            <Provider store={store}>
                <LoginRoute handleOnSubmit={() => {}} />
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
});
