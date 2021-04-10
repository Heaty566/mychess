import * as React from 'react';
import { render } from '@testing-library/react';

import BtnLink, { BtnLinkProps } from '.';

describe('BtnLink', () => {
    it('Render Correct Default Type', async () => {
        const data: BtnLinkProps = { label: 'username', href: '/home' };
        const wrapper = render(<BtnLink {...data} />);

        const btnLink = await wrapper.findByTestId(`btnlink-${data.label}`);

        expect(btnLink.getAttribute('href')).toBe(data.href);
        expect(btnLink.innerHTML).toBe(data.label);

        expect(wrapper).toMatchInlineSnapshot(`
            Object {
              "asFragment": [Function],
              "baseElement": <body>
                <div>
                  <a
                    class="inline-block bg-gray-800 px-8 py-2 text-white rounded-sm  duration-300 hover:bg-gray-900 outline-none"
                    data-testid="btnlink-username"
                    href="/home"
                  >
                    username
                  </a>
                </div>
              </body>,
              "container": <div>
                <a
                  class="inline-block bg-gray-800 px-8 py-2 text-white rounded-sm  duration-300 hover:bg-gray-900 outline-none"
                  data-testid="btnlink-username"
                  href="/home"
                >
                  username
                </a>
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
