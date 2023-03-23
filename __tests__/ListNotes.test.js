import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react-native';
import CommentsScreen from '../components/CommentsScreen';
// import { NavigationContainer } from '@react-navigation/native';
import {NavigationContainer} from '@react-navigation/native';

// jest.mock('react-native-dropdown-picker', () => {
//   // const React = require('react');
//   const RealComponent = jest.requireActual('react-native-dropdown-picker')
//   class Dropdown extends React.Component {
//     static Item = (props: { children: never }) => {
//       return React.createElement('Item', props, props.children)
//     }
//
//     render () {
//       return React.createElement('Dropdown', this.props, this.props.children)
//     }
//   }
//
//   Dropdown.propTypes = RealComponent.propTypes
//   return {
//     Dropdown,
//   }
// })
// jest.mock('@react-navigation/elements', () => {
//   // const React = require('react');
//   const RealComponent = jest.requireActual('@react-navigation/elements')
//   class HeaderBackButton extends React.Component {
//     static Item = (props: { children: never }) => {
//       return React.createElement('Item', props, props.children)
//     }
//
//     render () {
//       return React.createElement(
//         'HeaderBackButton',
//         this.props,
//         this.props.children,
//       );
//     }
//   }
//
//   HeaderBackButton.propTypes = RealComponent.propTypes
//   return {
//     HeaderBackButton,
//   }
// })
describe('NoteScreen', () => {
  it('displays the passed-in info', () => {
    // const navigation = { navigate: jest.fn() };
    render(<CommentsScreen />);
    expect(screen.getByText('Comments')).toBeVisible();
    // expect(screen.getByText('CS161')).toBeVisible();
  });
});
