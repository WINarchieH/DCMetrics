import React from 'react';
import renderer from 'react-test-renderer';
import DropDown from './dropdown';

it('Dropdown Renders', () => {
    const tree = renderer
        .create(<DropDown label='test' onchange={(x) => x}
            options={[]}></DropDown>)
        .toJSON();
    expect(tree).toMatchSnapshot();
});

it('Dropdown with Inputs', () => {
    const tree = renderer
        .create(<DropDown label='Gender' onchange={(x) => x}
            options={['M', 'F', 'X']} optionNames={['Male', 'Female', 'Unspecified']}
            required
        ></DropDown>)
        .toJSON();
    expect(tree).toMatchSnapshot();
});

// If snapshot changed intentionally
// jest --updateSnapshot 
// https://jestjs.io/docs/en/snapshot-testing