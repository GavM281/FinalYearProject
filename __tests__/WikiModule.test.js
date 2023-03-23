import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react-native';
import WikiModule from '../components/Buttons/WikiModule';
// import { NavigationContainer } from '@react-navigation/native';
import {NavigationContainer} from '@react-navigation/native';
describe('WikiModule', () => {
  it('displays the passed-in info', () => {
    render(<WikiModule title="CS161" />);
    expect(screen.getByText('CS161')).toBeVisible();
  });
  //
  // it('displays loads ListNotes screen', async() => {
  //   const navigate = { navigate: jest.fn() };
  //   render(<WikiModule title="CS161" onPress={navigate.navigate('ListNotes', {moduleCode: 'CS162', moduleNotes: '63de9e6f0e114a93012fb06e', moduleID: '63c96848c4afba376c71dae0'})} />);
  //     // () => navigation.navigate('ListNotes', {moduleCode: 'CS161', moduleNotes: 'notes', moduleID: 'id'})}/>);
  //
  //   await fireEvent.press(screen.getByText('CS161'));
  //   await expect(screen.getByPlaceholderText('Search')).toBeVisible();
  // });
});
