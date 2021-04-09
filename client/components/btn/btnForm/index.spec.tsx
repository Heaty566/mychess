import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';

import BtnForm, { BtnFormProps } from '.';

describe('BtnForm', () => {
    it('Render Correct Type Sumit', async () => {
        const fakeFn = jest.fn();
        const data: BtnFormProps = { label: 'login in', handleOnClick: fakeFn };
        const wrapper = render(<BtnForm {...data} />);

        const button = await wrapper.findByTestId(`btnform-login-in`);

        fireEvent.click(button);

        expect(button.getAttribute('type')).toBe('submit');
        expect(button.innerHTML).toBe(data.label);
        expect(fakeFn).toBeCalled();
        expect(wrapper).toMatchInlineSnapshot(`
            Object {
              "asFragment": [Function],
              "baseElement": <body>
                <div>
                  <button
                    class="bg-btn-1 w-full py-2 text-white rounded-sm focus:outline-none "
                    data-testid="btnform-login-in"
                    type="submit"
                  >
                    login in
                  </button>
                </div>
              </body>,
              "container": <div>
                <button
                  class="bg-btn-1 w-full py-2 text-white rounded-sm focus:outline-none "
                  data-testid="btnform-login-in"
                  type="submit"
                >
                  login in
                </button>
              </div>,
              "debug": [Function],
              "findAllByAltText": [Function],
              "findAllByDisplayValue": [Function],
              "findAllByLabelText": [Function],
              "findAllByPlaceholderText": [Function],
              "findAllByRole": [Function],
              "findAllByTestId": [Function],
              "findAllByText": [Function],
              "findAllByTitle": [Function],
              "findByAltText": [Function],
              "findByDisplayValue": [Function],
              "findByLabelText": [Function],
              "findByPlaceholderText": [Function],
              "findByRole": [Function],
              "findByTestId": [Function],
              "findByText": [Function],
              "findByTitle": [Function],
              "getAllByAltText": [Function],
              "getAllByDisplayValue": [Function],
              "getAllByLabelText": [Function],
              "getAllByPlaceholderText": [Function],
              "getAllByRole": [Function],
              "getAllByTestId": [Function],
              "getAllByText": [Function],
              "getAllByTitle": [Function],
              "getByAltText": [Function],
              "getByDisplayValue": [Function],
              "getByLabelText": [Function],
              "getByPlaceholderText": [Function],
              "getByRole": [Function],
              "getByTestId": [Function],
              "getByText": [Function],
              "getByTitle": [Function],
              "queryAllByAltText": [Function],
              "queryAllByDisplayValue": [Function],
              "queryAllByLabelText": [Function],
              "queryAllByPlaceholderText": [Function],
              "queryAllByRole": [Function],
              "queryAllByTestId": [Function],
              "queryAllByText": [Function],
              "queryAllByTitle": [Function],
              "queryByAltText": [Function],
              "queryByDisplayValue": [Function],
              "queryByLabelText": [Function],
              "queryByPlaceholderText": [Function],
              "queryByRole": [Function],
              "queryByTestId": [Function],
              "queryByText": [Function],
              "queryByTitle": [Function],
              "rerender": [Function],
              "unmount": [Function],
            }
        `);
    });

    it('Render Correct Type Button', async () => {
        const fakeFn = jest.fn();
        const data: BtnFormProps = { label: 'login in', handleOnClick: fakeFn, type: 'button' };
        const wrapper = render(<BtnForm {...data} />);

        const button = await wrapper.findByTestId(`btnform-login-in`);

        fireEvent.click(button);

        expect(button.getAttribute('type')).toBe('button');
        expect(button.innerHTML).toBe(data.label);
        expect(fakeFn).toBeCalled();
        expect(wrapper).toMatchInlineSnapshot(`
            Object {
              "asFragment": [Function],
              "baseElement": <body>
                <div>
                  <button
                    class="bg-btn-1 w-full py-2 text-white rounded-sm focus:outline-none "
                    data-testid="btnform-login-in"
                    type="button"
                  >
                    login in
                  </button>
                </div>
              </body>,
              "container": <div>
                <button
                  class="bg-btn-1 w-full py-2 text-white rounded-sm focus:outline-none "
                  data-testid="btnform-login-in"
                  type="button"
                >
                  login in
                </button>
              </div>,
              "debug": [Function],
              "findAllByAltText": [Function],
              "findAllByDisplayValue": [Function],
              "findAllByLabelText": [Function],
              "findAllByPlaceholderText": [Function],
              "findAllByRole": [Function],
              "findAllByTestId": [Function],
              "findAllByText": [Function],
              "findAllByTitle": [Function],
              "findByAltText": [Function],
              "findByDisplayValue": [Function],
              "findByLabelText": [Function],
              "findByPlaceholderText": [Function],
              "findByRole": [Function],
              "findByTestId": [Function],
              "findByText": [Function],
              "findByTitle": [Function],
              "getAllByAltText": [Function],
              "getAllByDisplayValue": [Function],
              "getAllByLabelText": [Function],
              "getAllByPlaceholderText": [Function],
              "getAllByRole": [Function],
              "getAllByTestId": [Function],
              "getAllByText": [Function],
              "getAllByTitle": [Function],
              "getByAltText": [Function],
              "getByDisplayValue": [Function],
              "getByLabelText": [Function],
              "getByPlaceholderText": [Function],
              "getByRole": [Function],
              "getByTestId": [Function],
              "getByText": [Function],
              "getByTitle": [Function],
              "queryAllByAltText": [Function],
              "queryAllByDisplayValue": [Function],
              "queryAllByLabelText": [Function],
              "queryAllByPlaceholderText": [Function],
              "queryAllByRole": [Function],
              "queryAllByTestId": [Function],
              "queryAllByText": [Function],
              "queryAllByTitle": [Function],
              "queryByAltText": [Function],
              "queryByDisplayValue": [Function],
              "queryByLabelText": [Function],
              "queryByPlaceholderText": [Function],
              "queryByRole": [Function],
              "queryByTestId": [Function],
              "queryByText": [Function],
              "queryByTitle": [Function],
              "rerender": [Function],
              "unmount": [Function],
            }
        `);
    });
});
