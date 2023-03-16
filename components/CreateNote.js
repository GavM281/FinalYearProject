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
import {HeaderBackButton} from "@react-navigation/elements";
import {AuthContext} from "../context/AuthContext";

function NoteScreen({navigation, contents, moduleID, moduleInfo}) {
  const {userData} = useContext(AuthContext);
  const [notes, setNotes] = useState(null);
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

  const currentModuleCode = route.params.moduleInfo[0];
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
    <View style={[styles.sectionContainer]}>
      <TextInput
        style={[styles.noteTitle]}
        placeholder={'Enter Note Name'}
        placeholderTextColor="#383838FF"
        multiline={true}
        onChangeText={header => setHeader(header)}
      />
      <TextInput
        style={[styles.noteContent]}
        editable
        multiline={true}
        onChangeText={newText => setContent(newText)}
        value={content}
      />
      <DropDownPicker
        style={[styles.dropdown]}
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        hideSelectedItemIcon={true}
      />
      <TouchableOpacity style={[styles.button]} onPress={() => createNote()}>
        <Text style={{color: 'white'}}>Create</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    // textAlignVertical: 'top',
    padding: 10,
    shadowColor: '#000', // IOS
    height: '100%',
    backgroundColor: '#ededed',
    // margin: '2%',
  },
  noteTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 25,
    color: 'black',
    elevation: 6,
    borderBottomWidth: 1,
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    // borderWidth: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 5,
    // marginTop: 5,
  },
  noteContent: {
    textAlignVertical: 'top',
    backgroundColor: '#ffffff',
    elevation: 5,
    color: 'black',
    // borderColor: 'gray',
    width: '100%',
    // borderBottomWidth: 1,
    // borderBottomLeftRadius: 10,
    // borderBottomRightRadius: 10,
    padding: 10,
    height: '100%',
    // marginBottom: 10,
    flex: 1,
  },
  button: {
    fontSize: 20,
    color: 'green',
    // borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#666aff',
    padding: 10,
    // marginVertical: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    elevation: 6,
    // marginBottom: 10,
    // margin: '20px',
    // textAlignVertical: 'bottom',
  },
  dropdown: {
    // marginVertical: 5,
    borderRadius: 0,
    borderWidth: 0,
    borderTopWidth: 1,
    elevation: 3,
  },
});

export default NoteScreen;
