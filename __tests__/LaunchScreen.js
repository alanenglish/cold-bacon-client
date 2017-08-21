import 'react-native';
import React from 'react';
import { StackNavigator } from 'react-navigation';
import LaunchScreen from '../containers/LaunchScreen';

import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer.create(
    <LaunchScreen />
  ).toJSON();
  expect(tree).toMatchSnapshot();
})
