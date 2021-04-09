import * as React from 'react';
import { render } from '@testing-library/react';

import WaveLoading from '.';

describe('WaveLoading', () => {
    it('Render Correct Default Type', async () => {
        const wrapper = render(<WaveLoading />);

        expect(wrapper).toMatchInlineSnapshot(`
            Object {
              "asFragment": [Function],
              "baseElement": <body>
                <div>
                  <div
                    class="flex space-x-2 justify-center items-center fade-in"
                    data-testid="waveloading"
                  >
                    <div
                      class="item animation1"
                    />
                    <div
                      class="item animation2"
                    />
                    <div
                      class="item animation1"
                    />
                    <div
                      class="item animation2"
                    />
                    <div
                      class="item animation1"
                    />
                  </div>
                </div>
              </body>,
              "container": <div>
                <div
                  class="flex space-x-2 justify-center items-center fade-in"
                  data-testid="waveloading"
                >
                  <div
                    class="item animation1"
                  />
                  <div
                    class="item animation2"
                  />
                  <div
                    class="item animation1"
                  />
                  <div
                    class="item animation2"
                  />
                  <div
                    class="item animation1"
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
    });
});
