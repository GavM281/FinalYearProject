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

function NoteScreen({navigation, id, name, contents, editable, privacy, moduleInfo}) {
  const route = useRoute();

  const [notes, setNotes] = useState(null);
  const [content, setContent] = useState(contents);
  const [header, setHeader] = useState(name);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(route.params.privacy); // Set value of dropdown to value of privacy that was passed in
  const [items, setItems] = useState([
    {label: 'Private', value: 'private'},
    {label: 'Public', value: 'public'},
  ]);
  const editableDoc = route.params.editable;
  let moduleInfos = route.params.moduleInfo;
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // When the screen is focused (like loading from another screen), call function to refresh data
      console.log('');
      console.log(' || NOTESCREEN ||');
      console.log('### id is:  ' + route.params.id);
      console.log('contents: ', route.params.contents);
      console.log('editable: ' + editableDoc);
      console.log('currentModuleCode: ' + moduleInfos[0]);
      // console.log('noteIDs: ' + moduleInfos[1]);
      console.log('currentModuleID: ' + moduleInfos[2]);
      setContent(route.params.contents);
      navigation.setOptions({
        headerLeft: () => (
          // <TouchableOpacity style={[styles.button]}
          <HeaderBackButton
            onPress={() => {
              navigation.navigate('ListNotes', {moduleCode: moduleInfos[0], moduleNotes: moduleInfos[1], moduleID: moduleInfos[2]});
            }}
          />
        ),
      });
      getNote();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const getNote = () => {
    console.log('GET NOTE -> The id is: ' + route.params.id);
    // console.log('The content is: ' + content);
    axios
      .get('https://gavin-fyp.herokuapp.com/getNote', {
        params: {
          id: route.params.id,
        },
      })
      .then(response => {
        // handle success
        console.log('Made request');
        console.log(response);
        let responseData = JSON.parse(JSON.stringify(response.data));
        console.log('The id is: ' + responseData._id);
        console.log('The id is: ' + responseData.id);
        console.log('The content is: ' + responseData.content);
        setContent(responseData.content);
      })
      .catch(error => {
        console.log('Failed request');
        // handle error
        console.log(error);
      });
  };

  const saveNoteContent = () => {
    console.log('id in saving note is : ', route.params.id);
    console.log('name in saving note is: ', header);
    console.log('content in saving note is: ', content);
    axios
      .put('https://gavin-fyp.herokuapp.com/updateNote', {
        id: route.params.id,
        name: header,
        content: content,
      })
      .then(response => {
        let responseData = JSON.parse(JSON.stringify(response.data));
        console.log('RESPONSE DATA: ', responseData);
        // getNotes();
      })
      .catch(error => {
        console.log('content: ' + content);
        console.log(error);
      });
  };

  // Display
  return (
    <View style={[styles.sectionContainer]}>
      <TextInput style={[styles.header]} editable={editableDoc} onChangeText={header => setHeader(header)}>{route.params.name}</TextInput>
      {/*Note text */}
      <TextInput
        style={[styles.textInput]}
        editable={editableDoc}
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
        disabled={!editableDoc}
      />
      {/*<Button*/}
      {/*  style={[styles.button]}*/}
      {/*  styleDisabled={{color: 'red'}}*/}
      {/*  onPress={() => saveNoteContent()}*/}
      {/*  title="Save"*/}
      {/*/>*/}
      <TouchableOpacity
        style={[styles.button]}
        onPress={() => saveNoteContent()}>
        <Text style={{color: 'white'}}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    textAlignVertical: 'top',
    // marginTop: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    shadowColor: '#000', // IOS
    height: '100%',
    backgroundColor: '#ededed',
    // margin: '2%',
  },
  textInput: {
    textAlignVertical: 'top',
    backgroundColor: '#ffffff',
    // elevation: 5,
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
    // marginBottom: 10,
    // margin: '20px',
    // textAlignVertical: 'bottom',
  },
  header: {
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
  dropdown: {
    // marginVertical: 5,
    borderRadius: 0,
    borderWidth: 0,
    borderTopWidth: 1,
  },
});

export default NoteScreen;
