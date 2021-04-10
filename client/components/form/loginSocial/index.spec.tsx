import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { create } from 'react-test-renderer';
import Cookies from 'universal-cookie';

import config from './config';
import LoginSocial from '.';

jest.mock('universal-cookie', () => {
    const mCookie = {
        get: jest.fn(),
    };
    return jest.fn(() => mCookie);
});

describe('LoginSocial', () => {
    beforeAll(() => {
        Object.defineProperty(window, 'location', {
            value: { reload: jest.fn() },
        });
    });
    it('Render Correct Default Type', async () => {
        const wrapper = create(<LoginSocial />);
        const btnSocials = config.map((item) => {
            return wrapper.root.findByProps({ 'data-testid': item.label });
        });

        expect(btnSocials).toHaveLength(3);
    });

    it('Test login user success', async () => {
        const cookies = new Cookies();
        const cookieSpy = jest.spyOn(cookies, 'get');
        cookieSpy.mockReturnValueOnce('12492525');
        global.open = jest.fn().mockReturnValue({ close: jest.fn() });

        jest.useFakeTimers();
        const wrapper = render(<LoginSocial />);
        const btn = await wrapper.findByText(config[0].label);
        fireEvent.click(btn);
        jest.advanceTimersByTime(1000);
        expect(global.open).toBeCalled();
    });

    it('Test login user false', async () => {
        global.open = jest.fn().mockReturnValue({ close: jest.fn() });
        jest.useFakeTimers();
        const wrapper = render(<LoginSocial />);
        const btn = await wrapper.findByText(config[0].label);
        fireEvent.click(btn);
        jest.advanceTimersByTime(1000);
        expect(global.open).toBeCalled();
    });
});
