import * as React from 'react';
import { render } from '@testing-library/react';

import TextField, { TextFieldProps } from '.';

describe('TextField', () => {
    it('Render Correct Default Type', async () => {
        const data: TextFieldProps = { error: '123456', label: 'Username', name: 'username', register: jest.fn(), type: 'text' };
        const wrapper = render(<TextField {...data} />);

        const label = await wrapper.findByTestId(`textfield-label-${data.name}`);
        const input = await wrapper.findByTestId(`textfield-input-${data.name}`);
        const error = await wrapper.findByTestId(`textfield-error-${data.name}`);

        expect(input.getAttribute('autoComplete')).toBe('on');
        expect(input.getAttribute('id')).toBe(data.name);
        expect(label.innerHTML).toBe(data.label);
        expect(error.innerHTML).toBe(`Username ${data.error}`);

        expect(wrapper).toMatchInlineSnapshot(`
            Object {
              "asFragment": [Function],
              "baseElement": <body>
                <div>
                  <div
                    class="space-y-1.5 text-sm"
                  >
                    <label
                      class="block text-cotton-seed "
                      data-testid="textfield-label-username"
                      for="username"
                    >
                      Username
                    </label>
                    <input
                      autocomplete="on"
                      class="block w-full outline-none rounded-sm bg-tuna py-2 px-1.5  text-mercury"
                      data-testid="textfield-input-username"
                      id="username"
                      type="text"
                    />
                    <p
                      class="text-red-500 fade-in"
                      data-testid="textfield-error-username"
                    >
                      Username 123456
                    </p>
                  </div>
                </div>
              </body>,
              "container": <div>
                <div
                  class="space-y-1.5 text-sm"
                >
                  <label
                    class="block text-cotton-seed "
                    data-testid="textfield-label-username"
                    for="username"
                  >
                    Username
                  </label>
                  <input
                    autocomplete="on"
                    class="block w-full outline-none rounded-sm bg-tuna py-2 px-1.5  text-mercury"
                    data-testid="textfield-input-username"
                    id="username"
                    type="text"
                  />
                  <p
                    class="text-red-500 fade-in"
                    data-testid="textfield-error-username"
                  >
                    Username 123456
                  </p>
                </div>
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
    it('Render Correct Default Type', async () => {
        const data: TextFieldProps = { error: '', label: 'username', name: 'username', register: jest.fn(), type: 'password' };
        const wrapper = render(<TextField {...data} />);

        const label = await wrapper.findByTestId(`textfield-label-${data.name}`);
        const input = await wrapper.findByTestId(`textfield-input-${data.name}`);

        expect(input.getAttribute('autoComplete')).toBe('off');
        expect(input.getAttribute('id')).toBe(data.name);
        expect(label.innerHTML).toBe(data.label);

        expect(wrapper).toMatchInlineSnapshot(`
            Object {
              "asFragment": [Function],
              "baseElement": <body>
                <div>
                  <div
                    class="space-y-1.5 text-sm"
                  >
                    <label
                      class="block text-cotton-seed "
                      data-testid="textfield-label-username"
                      for="username"
                    >
                      username
                    </label>
                    <input
                      autocomplete="off"
                      class="block w-full outline-none rounded-sm bg-tuna py-2 px-1.5  text-mercury"
                      data-testid="textfield-input-username"
                      id="username"
                      type="password"
                    />
                  </div>
                </div>
              </body>,
              "container": <div>
                <div
                  class="space-y-1.5 text-sm"
                >
                  <label
                    class="block text-cotton-seed "
                    data-testid="textfield-label-username"
                    for="username"
                  >
                    username
                  </label>
                  <input
                    autocomplete="off"
                    class="block w-full outline-none rounded-sm bg-tuna py-2 px-1.5  text-mercury"
                    data-testid="textfield-input-username"
                    id="username"
                    type="password"
                  />
                </div>
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
        try {
            await wrapper.findByTestId('username-error');
        } catch (error) {
            expect(error).toBeDefined();
        }
    });
});
