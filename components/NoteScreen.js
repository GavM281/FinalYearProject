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
import {HeaderBackButton} from '@react-navigation/elements';
import Toast from 'react-native-root-toast';
import {AuthContext} from '../context/AuthContext';
import appStyles from '../stylesheet';

function NoteScreen({
  navigation,
  id,
  name, // Name of note
  contents, // Contents of note
  commentsIDs, // List of IDs for comments
  editable, // If note is editable
  privacy, // Privacy Value
  moduleInfo, // Array with Info about Module
  userEmail, // Email of who created note
}) {
  const route = useRoute();
  const {userData} = useContext(AuthContext);

  const [content, setContent] = useState(contents);
  const [header, setHeader] = useState(name);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(route.params.privacy); // Set value of dropdown to value of privacy that was passed in
  const [items, setItems] = useState([
    {label: 'Private', value: 'private'},
    {label: 'Public(editable)', value: 'public(editable)'},
    {label: 'Public(not editable)', value: 'public'},
  ]);

  let moduleInfos = route.params.moduleInfo;
  let noteID = route.params.id;
  let currentUserEmail = userData.email;
  let noteCommentIDs = route.params.commentsIDs;
  if (noteCommentIDs == null) {
    noteCommentIDs = [];
  }
  let editableDoc = route.params.editable;
  let notePrivacy = route.params.privacy;

  console.log('userEmail: ' + route.params.userEmail);
  console.log('currentUserEmail: ' + currentUserEmail);
  console.log('notePrivacy: ' + route.params.privacy);
  console.log('editableDoc: ' + editableDoc);

  let dropdownDisabled;
  // Dropdown to select privacy settings disabled if note is public
  if (notePrivacy.includes('public') && userEmail !== currentUserEmail) {
    dropdownDisabled = true;
  } else {
    dropdownDisabled = false;
  }

  let commentList = [];
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // When the screen is focused (like loading from another screen), call function to refresh data
      console.log('');
      console.log(' || NOTESCREEN ||');
      console.log('### id is:  ' + route.params.id);
      console.log('contents: ', route.params.contents);
      console.log('editable: ' + editableDoc);
      console.log('commentID: ' + route.params.commentsIDs);
      console.log('currentModuleCode: ' + moduleInfos[0]);
      // console.log('noteIDs: ' + moduleInfos[1]);
      console.log('currentModuleID: ' + moduleInfos[2]);
      setContent(route.params.contents);
      getNote();
      commentList = [];
      // getCommentsFromList();
      navigation.setOptions({
        headerLeft: () => (
          // <TouchableOpacity style={[styles.button]}
          <HeaderBackButton
            onPress={() => {
              navigation.navigate('ListNotes', {
                moduleCode: moduleInfos[0],
                noteIDsList: moduleInfos[1],
                moduleID: moduleInfos[2],
              });
            }}
          />
        ),
      });
      // getNote();
    });

    // Return the function to unsubscribe from the event, so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const getNote = () => {
    console.log('GET NOTE -> The id is: ' + route.params.id);
    // console.log('The content is: ' + content);
    axios
      .post('https://gavin-fyp.herokuapp.com/getSingleNote', {
        id: route.params.id,
      })
      .then(response => {
        // handle success
        console.log('Made request');
        // console.log(response);
        let responseData = JSON.parse(JSON.stringify(response.data));
        console.log('The id is: ' + responseData._id);
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
        Toast.show('Saved Note', {
          duration: Toast.durations.SHORT, // 2 seconds
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
      })
      .catch(error => {
        console.log('content: ' + content);
        console.log(error);
      });
  };

  // Display
  return (
    <View style={{...appStyles.screenContainer, padding: 10}}>
      <TextInput
        style={[appStyles.header]}
        editable={editableDoc}
        onChangeText={header => setHeader(header)}>
        {route.params.name}
      </TextInput>
      <TextInput
        style={[styles.noteContent]}
        editable={editableDoc}
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
        disabled={dropdownDisabled}
        dropDownDirection="TOP"
      />
      <TouchableOpacity
        style={{...appStyles.button, backgroundColor: '#868686'}}
        onPress={() =>
          navigation.navigate('Comments', {
            noteID: noteID,
            commentIDs: noteCommentIDs,
          })
        }>
        <Text style={{color: 'white'}}>Comments</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{...appStyles.button,...appStyles.roundBottomCorners,backgroundColor: '#666aff'}}
        onPress={() => saveNoteContent('Comments')}>
        <Text style={{color: 'white'}}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  noteContent: {
    textAlignVertical: 'top',
    backgroundColor: '#ffffff',
    color: 'black',
    width: '100%',
    padding: 10,
    height: '100%',
    flex: 1,
  },
});

export default NoteScreen;
