import React, {useState} from 'react';
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

  const [content, setContent] = useState(contents);
  const [comments, setComments] = useState();
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
  let currentUserEmail = route.params.userEmail;
  let noteCommentIDs = route.params.commentsIDs;
  if (noteCommentIDs == null) {
    noteCommentIDs = [];
  }
  let editableDoc = route.params.editable;
  let notePrivacy = route.params.privacy;
  let dropdownDisabled;
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
      getCommentsFromList();
      navigation.setOptions({
        headerLeft: () => (
          // <TouchableOpacity style={[styles.button]}
          <HeaderBackButton
            onPress={() => {
              navigation.navigate('ListNotes', {
                moduleCode: moduleInfos[0],
                moduleNotes: moduleInfos[1],
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
      })
      .catch(error => {
        console.log('content: ' + content);
        console.log(error);
      });
  };

  const getCommentsFromList = async () => {
    console.log('\n\nGetCommentFromList\n');
    if (noteCommentIDs === 0) {
      commentList = [];
      setComments(commentList);
    } else {
      for (let i = 0; i < noteCommentIDs.length; i++) {
        let id = noteCommentIDs[i];
        await axios
          .post('https://gavin-fyp.herokuapp.com/getComment1', {
            id: id,
          })
          .then(response => {
            console.log('\n   Made request: getComment1');
            let responseData = JSON.parse(JSON.stringify(response.data));
            console.log('Comment Content: ' + responseData.content);
            console.log('Comment User: ' + responseData.userEmail);
            console.log('Comment noteID: ' + responseData.noteID);
            commentList.push(responseData);
            setComments(commentList);
            return responseData;
          })
          .catch(error => {
            console.log('Failed request');
            // handle error
            console.log(error);
          });
      }
    }
  };

  // Display
  return (
    <View style={[styles.sectionContainer]}>
      <View style={[styles.noteSection]}>
        <TextInput
          style={[styles.noteHeader]}
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
          style={[styles.dropdown]}
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
          style={[styles.button]}
          onPress={() =>
            navigation.navigate('Comments', {
              noteID: noteID,
              commentIDs: noteCommentIDs,
              commentsList: comments,
            })
          }>
          <Text style={{color: 'white'}}>Comments ({noteCommentIDs.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            ...styles.button,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            backgroundColor: '#666aff',
          }}
          onPress={() => saveNoteContent('Comments')}>
          <Text style={{color: 'white'}}>Save</Text>
        </TouchableOpacity>
      </View>
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
  comments: {
    backgroundColor: 'blue',
    textAlign: 'center',
    // flex: 1,
    width: '100%',
    height: 50,
    // backgroundColor: '#EE5407',
    justifyContent: 'center',
    alignItems: 'center',
    // position: 'absolute', //Here is the trick
    // bottom: 0, //Here is the trick
  },
  noteSection: {
    // position: 'absolute',
    height: '100%',
    flex: 1,
  },
  noteContent: {
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
    // backgroundColor: '#666aff',
    backgroundColor: '#868686',
    padding: 10,
  },
  noteHeader: {
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
