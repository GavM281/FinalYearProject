import React, {useContext, useState} from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  TextInput,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import {useRoute} from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import {AuthContext} from '../context/AuthContext';
import appStyles from '../stylesheet';

function NoteScreen({navigation, moduleID, moduleInfo}) {
  const {userData} = useContext(AuthContext);
  const [content, setContent] = useState('');
  const [header, setHeader] = useState('');

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('private');
  const [items, setItems] = useState([
    {label: 'Private  - Only you can view it', value: 'private'},
    {label: 'Public(editable)  - Everyone can view and edit', value: 'public(editable)'},
    {label: 'Public(not editable)  - Everyone can view but can\'t edit', value: 'public'},
  ]);
  const route = useRoute();
  const currentUsersEmail = userData.email;
  // const currentModuleID = route.params.moduleID;
  console.log('');
  console.log(' || CreateNote ||');
  console.log('Email: ' + userData.email);
  console.log('Users Name: ' + userData.name);
  // console.log('id: ' + currentModuleID);
  let noteIDs = route.params.moduleInfo[1];
  const currentModuleID = route.params.moduleInfo[2];
  console.log('currentModuleCode: ' + route.params.moduleInfo[0]);
  // console.log('noteIDs: ' + route.params.moduleInfo[1]);
  console.log('currentModuleID: ' + route.params.moduleInfo[2]);

  const createNote = () => {
    axios
      .post('https://gavin-fyp.herokuapp.com/createNote', {
        name: header,
        content: content,
        userEmail: currentUsersEmail,
        privacy: value,
        groupID: currentModuleID,
      })
      .then(response => {
        let responseData = JSON.parse(JSON.stringify(response.data));
        console.log('RESPONSE DATA after creating new note: ', responseData);
        noteIDs.push(responseData._id);
        navigation.navigate('NoteScreen', {
          id: responseData._id,
          name: header,
          contents: content,
          editable: true,
          privacy: value,
          moduleInfo: route.params.moduleInfo,
          userEmail: currentUsersEmail,
        });
        // getNotes();
      })
      .catch(error => {
        console.log(error);
      });
  };

  // Display
  return (
    <View style={{...appStyles.screenContainer, padding: 10}}>
      <TextInput
        style={[appStyles.header]}
        placeholder={'Enter Note Name'}
        placeholderTextColor="#383838FF"
        multiline={true}
        onChangeText={headerText => setHeader(headerText)}
      />
      <TextInput
        style={[styles.noteContent]}
        editable
        multiline={true}
        onChangeText={newText => setContent(newText)}
        value={content}
      />
      <DropDownPicker
        style={[appStyles.dropdown]}
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        hideSelectedItemIcon={true}
        dropDownDirection="TOP"
      />
      <TouchableOpacity style={[styles.button]} onPress={() => createNote()}>
        <Text style={{color: 'white'}}>Create</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  noteContent: {
    textAlignVertical: 'top',
    backgroundColor: '#ffffff',
    elevation: 5,
    color: 'black',
    width: '100%',
    padding: 10,
    height: '100%',
    flex: 1,
  },
  button: {
    fontSize: 20,
    color: 'green',
    alignItems: 'center',
    backgroundColor: '#666aff',
    padding: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    elevation: 6,
  },
});

export default NoteScreen;
