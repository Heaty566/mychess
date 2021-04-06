import { shallow, mount, render } from 'enzyme';

import WaveLoading from '.';
import React from 'react';
React.useLayoutEffect = React.useEffect;

describe('gfe', () => {
    it('123', () => {
        const wrapper = mount(<WaveLoading />);

        expect(wrapper.find('.item')).toHaveLength(5);
    });
});
