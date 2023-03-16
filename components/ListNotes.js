import React, {useContext, useEffect, useRef, useState} from 'react';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {StackActions, useRoute} from '@react-navigation/native';
import {AuthContext} from '../context/AuthContext';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {ButtonGroup, SearchBar } from '@rneui/themed';
import DropDownPicker from 'react-native-dropdown-picker';
import Toast from 'react-native-root-toast';

const ListNotes = ({navigation, moduleCode, moduleNotes, moduleID}) => {
  const route = useRoute();

  const {loggedIn, userData} = useContext(AuthContext);
  const [notes, setNotes] = useState();
  const [filteredNotes, setFilteredNotes] = useState();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('all'); // Set value of dropdown to value of privacy that was passed in
  const [items, setItems] = useState([
    {label: 'Show Everything', value: 'all'},
    {label: 'Show Private Only', value: 'private'},
    {label: 'Show Public Only', value: 'public'},
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');


  console.log('');
  console.log('ListNotes Screen');
  console.log('Name: ' + userData.name);
  const currentUsersEmail = userData.email;
  const currentModuleCode = route.params.moduleCode;
  let noteIDs = route.params.moduleNotes;
  // let noteIDs;
  const currentModuleID = route.params.moduleID;

  const moduleInfo = [currentModuleCode, noteIDs, currentModuleID];
  let noteList = [];
  // console.log('ListNotes moduleInfo: ');
  // console.log('  currentModuleCode: ' + moduleInfo[0]);
  // // console.log('noteIDs: ' + moduleInfo[1]);
  // console.log('  currentModuleID: ' + moduleInfo[2]);
  // console.log('email: ' + userData.email);
  // console.log('code: ' + currentModuleCode);
  // console.log('Module ID: ' + currentModuleID);
  // console.log('IDs: ' + noteIDs);

  useEffect(() => {
    if (loggedIn === false) {
      navigation.dispatch(StackActions.replace('Sign In'));
    }
  }, [loggedIn, navigation]);

  React.useEffect(() => {
    setNotes(noteList);
    setFilteredNotes(notes);
    // Change page title and add create button to header
    navigation.setOptions({
      title: currentModuleCode,
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 25,
      },
      headerRight: () => (
        // <TouchableOpacity style={[styles.button]}
        <TouchableOpacity
          style={[styles.createButton]}
          onPress={() =>
            navigation.navigate('CreateNote', {
              moduleID: currentModuleID,
              moduleInfo: moduleInfo,
            })
          }>
          <Text style={{color: 'white', fontSize: 17}}>Create</Text>
        </TouchableOpacity>
      ),
    });
    console.log('On ListNotes page');
    const unsubscribe = navigation.addListener('focus', () => {
      // When the screen is focused (like loading from another screen), call function to refresh data
      setSearchQuery('');
      getGroup();
      console.log('Getting notes on ListNotes');
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const getNotes = async () => {
    await axios
      .get('https://gavin-fyp.herokuapp.com/getNotes')
      .then(response => {
        let responseData = JSON.parse(JSON.stringify(response.data));
        console.log('RESPONSE DATA: ', responseData);
        setNotes(responseData);
      })
      .catch(error => {
        console.log(error);
        console.log('There was an error getting notes ^^');
      });
  };

  const getGroup = () => {
    console.log('Getting group info for id: ' + currentModuleID);
    axios
      .post('https://gavin-fyp.herokuapp.com/getSingleGroup', {
        id: currentModuleID,
      })
      .then(response => {
        console.log('\n   Made request: getGroup');
        let responseData = JSON.parse(JSON.stringify(response.data));
        console.log('Group Name: ' + responseData.name);
        let notesIDs = responseData.notes;
        notesIDs.reverse(); // Reverse array of IDs so the newest notes appear first
        console.log('noteIDs is : ', notesIDs);
        getNoteFromList(notesIDs)
          .then()
          .catch(function (error) {});
      })
      .catch(error => {
        console.log('Failed request');
        // handle error
        console.log(error);
      });
  };

  const getNoteFromList = async notesIDs => {
    console.log('GetNoteFromList');
    console.log('notesIDs length: ', notesIDs.length);
    noteList = [];
    for (let i = 0; i < notesIDs.length; i++) {
      let id = notesIDs[i];
      await axios
        .post('https://gavin-fyp.herokuapp.com/getSingleNote', {
          id: id,
        })
        .then(response => {
          let responseData = JSON.parse(JSON.stringify(response.data));
          // console.log('Content: ' + responseData.content);
          // console.log('User: ' + responseData.userEmail);
          if (responseData != null) {
            noteList.push(responseData);
          }
        })
        .catch(error => {
          console.log('Failed request');
          // handle error
          console.log(error);
        });
    }
    setFilteredNotes(noteList);
    setNotes(noteList);
    filterResults(searchQuery, value, noteList);
  };

  const deleteNote = id => {
    console.log('current module id for deleting note: ' + currentModuleID);
    axios
      .post('https://gavin-fyp.herokuapp.com/deleteNote', {
        id: id, // ID of note
        groupID: currentModuleID, // The ID of the module this note is part of, used to delete id from array
      })
      .then(response => {
        console.log('Deleted ', id);
        Toast.show('Deleted Note', {
          duration: Toast.durations.SHORT, // 2 seconds
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });

        getGroup();
      })
      .catch(error => {
        console.log(error);
      });
  };

  const DeleteIcon = ({noteEmail, id}) => {
    if (noteEmail === currentUsersEmail) {
      // Note made by current user, can be deleted
      return (
        <Icon
          style={[styles.icon]}
          name="delete"
          color="#ccc"
          size={30}
          onPress={() => {
            deleteNote(id);
          }}
        />
      );
    } else {
      return null; // Note made by different user, can't be deleted
    }
  };
  const NoteButton = ({
    title,
    content,
    id,
    userEmail,
    privacy,
    editable,
    comments,
  }) => {
    // Set icon for privacy settings
    let icon;
    if (privacy !== 'private') {
      icon = 'public';
    } else {
      icon = 'lock';
    }
    return (
      <TouchableOpacity
        style={[styles.noteButton]}
        onPress={() =>
          navigation.navigate('NoteScreen', {
            id: id,
            name: title,
            contents: content,
            commentsIDs: comments,
            editable: editable,
            privacy: privacy,
            moduleInfo: moduleInfo,
            userEmail: currentUsersEmail,
          })
        }>
        <View style={[styles.noteButtonHeading]}>
          <Text numberOfLines={2} style={[styles.noteTitle]}>
            {title}
          </Text>

          <DeleteIcon noteEmail={userEmail} id={id} />
        </View>
        <View style={[styles.noteContent]}>
          <Text numberOfLines={1} style={{flex: 1}}>
            {content}
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name="person" size={20} style={[styles.icon]} />
          <Text>{userEmail}</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name={icon} size={20} style={[styles.icon]} />
          <Text>{privacy}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  let filterResults = (search, privacyFilter, notesToFilter) => {
    // console.log('noteList: ' + noteList);
    // console.log('notesToFilter: ' + notesToFilter);
    // console.log('Changed text, now search is: ' + search);

    // console.log('search, else: ' + search);
    // console.log('noteList.length: ' + noteList.length);
    // console.log('notes.length: ' + notes.length);
    // console.log('notesToFilter.length: ' + notesToFilter.length);
    let filteredNoteList = [];
    for (let i = 0; i < notesToFilter.length; i++) {
      // Get note values and change to lower case
      let noteContent = notesToFilter[i].content.toLowerCase();
      let noteName = notesToFilter[i].name.toLowerCase();
      let noteCreator = notesToFilter[i].userEmail.toLowerCase();
      let notePrivacy = notesToFilter[i].privacy;

      // Change query to lower case
      let query = search.toLowerCase();

      // Check Note content, title, and creator for search query
      if ((noteContent.includes(query) || noteName.includes(query) || noteCreator.includes(query)) && (notePrivacy.includes(privacyFilter) || privacyFilter === 'all')) {
        filteredNoteList.push(notesToFilter[i]);
      }
    }
    setFilteredNotes(filteredNoteList);

    console.log('notes: ' + notes);
  };

  // TESTING: True to show all users notes regardless of creator. False to only show current users notes
  let showAllUsers = false;
  return (
    <View style={[styles.screenContainer]}>
      <FlatList
        style={[styles.flatList]}
        data={filteredNotes}
        extraData={notes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => {
          let editableDoc = false;
          if (
            // Check whether note should be shown
            ((item.userEmail === currentUsersEmail ||
              item.privacy.includes('public')) &&
              noteIDs.includes(item._id)) ||
            showAllUsers == true
          ) {
            if (
              item.userEmail === currentUsersEmail ||
              item.privacy === 'public(editable)'
            ) {
              editableDoc = true;
            }
            return (
              <NoteButton
                title={item.name}
                content={item.content}
                navigation={navigation}
                id={item._id}
                userEmail={item.userEmail}
                privacy={item.privacy}
                editable={editableDoc}
                comments={item.comments}
                moduleInfo={moduleInfo}
              />
            );
          }
        }}
        ListHeaderComponent={
          <View>
            <ButtonGroup
              buttons={['All', 'Private', 'Public']}
              selectedIndex={selectedIndex}
              onPress={values => {
                setSelectedIndex(values);
                let privacy;
                if (values === 0) {
                  setValue('all');
                  privacy = 'all';
                } else if (values === 1) {
                  setValue('private');
                  privacy = 'private';
                } else if (values === 2) {
                  setValue('public');
                  privacy = 'public';
                } else {
                  console.log("value not 0,1,2. It's: " + values);
                }
                console.log('Value: ' + value);
                filterResults(searchQuery, privacy, notes);
              }}
              containerStyle={styles.privacyFilter}
            />
            <SearchBar
              containerStyle={styles.input}
              platform="android"
              placeholder="Search..."
              placeholderTextColor="#636363"
              value={searchQuery}
              lightTheme
              onChangeText={async query => {
                setSearchQuery(query);
                filterResults(query, value, notes);
              }}
            />
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    height: '100%',
    paddingHorizontal: 10,
  },
  moduleHeader: {
    color: 'black',
    fontSize: 25,
    textAlign: 'center',
    fontWeight: 'bold',
    paddingVertical: 5,
  },
  noteButtonHeading: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  createButton: {
    alignItems: 'center',
    backgroundColor: '#666aff',
    borderColor: 'black',
    padding: 10,
    marginHorizontal: 10,
    elevation: 5,
    borderRadius: 10,
  },
  flatList: {
    backgroundColor: '#ffffff',
    elevation: 5,
    zIndex: -1,
  },
  noteButton: {
    elevation: 5,
    borderRadius: 14,
    shadowColor: '#000', // IOS
    shadowOffset: {height: 4, width: 0}, // IOS
    shadowOpacity: 0.3, // IOS
    shadowRadius: 4.5, //IOS
    paddingVertical: 10,
    margin: '2%',
    backgroundColor: '#30B283',
    paddingLeft: 10,
    zIndex: 0,
  },
  noteTitle: {
    fontWeight: 'bold',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#FFF6F6',
    fontSize: 25,
    width: '90%',
  },
  noteContent: {
    justifyContent: 'space-between',
    paddingBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'right',
    marginRight: 5,
  },
  privacyFilter: {
    width: '100%',
    elevation: 6,
    marginLeft: 0,
    marginVertical: 0,
    // borderTopLeftRadius: 10,
    // borderTopRightRadius: 10,
  },
  input: {
    // paddingVertical doesn't work, need to use paddingTop and paddingBottom to remove default padding
    paddingTop: 0,
    paddingBottom: 0,
    backgroundColor: '#fff',
    color: '#424242',
    borderRadius: 10,
    elevation: 5,
    margin: 10,
  },
});

export default ListNotes;
