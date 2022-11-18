import React from 'react';
import renderer from 'react-test-renderer';
import Toggle from './toggle';

it('Toggle Renders', () => {
    const tree = renderer
        .create(<Toggle label='test' onchange={(x) => x}></Toggle>)
        .toJSON();
    expect(tree).toMatchSnapshot();
});