import React, {useState} from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  TextInput,
  StyleSheet,
  FlatList,
  Button,
} from 'react-native';
import axios from 'axios';
import NoteButton from './Buttons/NoteButton';
import {useRoute} from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import {HeaderBackButton} from "@react-navigation/elements";

function NoteScreen({navigation, contents, userEmail, moduleID, moduleInfo}) {
  const [notes, setNotes] = useState(null);
  const [content, setContent] = useState('');
  const [header, setHeader] = useState('');

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('private');
  const [items, setItems] = useState([
    {label: 'Private', value: 'private'},
    {label: 'Public', value: 'public'},
  ]);
  const route = useRoute();
  const currentUsersEmail = route.params.userEmail;
  // const currentModuleID = route.params.moduleID;
  console.log('');
  console.log(' || CreateNote ||');
  console.log('Email: ' + currentUsersEmail);
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
          moduleInfo: route.params.moduleInfo,
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
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        hideSelectedItemIcon={true}
      />
      <TextInput style={[styles.header]} placeholder={'Enter Note Name'} placeholderTextColor="black" onChangeText={header => setHeader(header)}></TextInput>
      {/*Note text */}
      <TextInput
        style={[styles.textInput]}
        editable
        multiline={true}
        onChangeText={newText => setContent(newText)}
        value={content}
      />
      <Button
        style={[styles.button]}
        styleDisabled={{color: 'red'}}
        onPress={() => createNote()}
        title="Save"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    textAlignVertical: 'top',
    // marginTop: 20,
    paddingHorizontal: 14,
    shadowColor: '#000', // IOS
    height: '95%',
    backgroundColor: '#ededed',
    // margin: '2%',
  },
  textInput: {
    textAlignVertical: 'top',
    backgroundColor: '#ffffff',
    elevation: 5,
    color: 'black',
    // borderColor: 'gray',
    width: '100%',
    // borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    height: '100%',
    marginVertical: 20,
    flex: 1,
  },
  button: {
    fontSize: 20,
    color: 'green',
    // margin: '20px',
    textAlignVertical: 'bottom',
  },
  header: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 25,
    color: 'black',
  },
});

export default NoteScreen;
