import * as React from 'react';

import NotFound from '../../pages/404';
import { render } from '@testing-library/react';

describe('NotFound', () => {
    it('Render Correct Default', async () => {
        let wrapper = render(<NotFound />);

        expect(wrapper).toMatchInlineSnapshot(`
            Object {
              "asFragment": [Function],
              "baseElement": <body>
                <div>
                  <div
                    class="flex-1 flex items-center justify-center"
                  >
                    <div
                      class="text-center space-y-8"
                    >
                      <div
                        class=" space-y-2"
                      >
                        <h1
                          class="text-9xl text-white"
                        >
                          404
                        </h1>
                        <h3
                          class="text-7xl text-mercury-700"
                        >
                          Whoops!
                        </h3>
                        <p
                          class="text-2xl text-mercury-700"
                        >
                          The page you were looking for doesn’t exist
                        </p>
                      </div>
                      <a
                        class="inline-block bg-gray-800 px-8 py-2 text-white rounded-sm  duration-300 hover:bg-gray-900 outline-none"
                        data-testid="btnlink-back-to-home"
                        href="/"
                      >
                        Back To Home
                      </a>
                    </div>
                  </div>
                </div>
              </body>,
              "container": <div>
                <div
                  class="flex-1 flex items-center justify-center"
                >
                  <div
                    class="text-center space-y-8"
                  >
                    <div
                      class=" space-y-2"
                    >
                      <h1
                        class="text-9xl text-white"
                      >
                        404
                      </h1>
                      <h3
                        class="text-7xl text-mercury-700"
                      >
                        Whoops!
                      </h3>
                      <p
                        class="text-2xl text-mercury-700"
                      >
                        The page you were looking for doesn’t exist
                      </p>
                    </div>
                    <a
                      class="inline-block bg-gray-800 px-8 py-2 text-white rounded-sm  duration-300 hover:bg-gray-900 outline-none"
                      data-testid="btnlink-back-to-home"
                      href="/"
                    >
                      Back To Home
                    </a>
                  </div>
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
