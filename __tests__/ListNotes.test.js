import React from 'react';

import NoteScreen from '../components/NoteScreen';
// import {create} from 'domain';
import renderer from 'react-test-renderer';
test('renders correctly', () => {
  // const tree = create(<NoteScreen />);
  // expect(tree).toMatchSnapshot();
  renderer.create(<NoteScreen />);
  // render(<NoteScreen />);
});
