import * as React from 'react';
import { render } from '@testing-library/react';

import SideLink, { SideLinkProps } from '.';

describe('SideLink', () => {
    it('Render Correct Default Type', async () => {
        const data: SideLinkProps = { label: 'username', href: '/home', position: 'text-center' };
        const wrapper = render(<SideLink {...data} />);

        const sideLink = await wrapper.findByTestId(`sidelink-link-${data.label}`);
        const wrapperLink = await wrapper.findByTestId(`sidelink-wrapper-${data.label}`);

        expect(sideLink.getAttribute('href')).toBe(data.href);
        expect(sideLink.innerHTML).toBe(data.label);
        expect(wrapperLink.className).toContain(data.position);
        expect(wrapper).toMatchInlineSnapshot(`
            Object {
              "asFragment": [Function],
              "baseElement": <body>
                <div>
                  <div
                    class="text-center"
                    data-testid="sidelink-wrapper-username"
                  >
                    <a
                      class="text-mercury text-sm duration-300 hover:text-malibu"
                      data-testid="sidelink-link-username"
                      href="/home"
                    >
                      username
                    </a>
                  </div>
                </div>
              </body>,
              "container": <div>
                <div
                  class="text-center"
                  data-testid="sidelink-wrapper-username"
                >
                  <a
                    class="text-mercury text-sm duration-300 hover:text-malibu"
                    data-testid="sidelink-link-username"
                    href="/home"
                  >
                    username
                  </a>
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
