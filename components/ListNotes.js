import React, {useContext, useEffect, useState} from 'react';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {StackActions, useRoute} from '@react-navigation/native';
import {AuthContext} from '../context/AuthContext';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {ButtonGroup, SearchBar} from '@rneui/themed';
import Toast from 'react-native-root-toast';
import NoteStats from './Buttons/NoteStats';
import appStyles from '../stylesheet';

const ListNotes = ({navigation, moduleCode, noteIDsList, moduleID}) => {
  const route = useRoute();

  const {loggedIn, userData} = useContext(AuthContext);
  const [notes, setNotes] = useState();
  const [filteredNotes, setFilteredNotes] = useState();

  const [value, setValue] = useState('all'); // Set value of ButtonGroup to value of privacy that was passed in
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
  const currentModuleID = route.params.moduleID;
  let noteIDs = route.params.noteIDsList;

  const moduleInfo = [currentModuleCode, noteIDs, currentModuleID];
  let noteList = [];

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
      setSelectedIndex(0);
      setSearchQuery('');
      getGroup();
      console.log('Getting notes on ListNotes');
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

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

  let filterResults = (search, privacyFilter, notesToFilter) => {
    let filteredNoteList = [];
    // Loop through every note
    for (let i = 0; i < notesToFilter.length; i++) {
      // Get note values and change to lower case
      let noteContent = notesToFilter[i].content.toLowerCase();
      let noteName = notesToFilter[i].name.toLowerCase();
      let noteCreator = notesToFilter[i].userEmail.toLowerCase();
      let notePrivacy = notesToFilter[i].privacy;

      // Change query to lower case
      let query = search.toLowerCase();

      // Check Note content, title, and creator for search query
      if (
        // Check query is in note
        (noteContent.includes(query) || noteName.includes(query)) &&
          // Filter based off privacyFilter - Public, Personal, Or Everything
        ((notePrivacy.includes(privacyFilter) && noteCreator !== currentUsersEmail) || // Public: Filter is set to public and current user didn't create note
        (privacyFilter === 'personal' && noteCreator === currentUsersEmail) || // Personal: Filter set to personal, current user made note
        privacyFilter === 'all') // Filter set to show everything
      ) {
        filteredNoteList.push(notesToFilter[i]);
      }
    }
    setFilteredNotes(filteredNoteList);
    console.log('notes: ' + notes);
  };

  const DeleteIcon = ({noteEmail, id}) => {
    if (noteEmail === currentUsersEmail) {
      // Note made by current user, can be deleted
      return (
        <Icon
          style={[appStyles.icon]}
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
            userEmail: userEmail,
          })
        }>
        <View style={[styles.noteButtonHeading]}>
          <Text numberOfLines={2} style={[styles.noteTitle]}>{title}</Text>
          <DeleteIcon noteEmail={userEmail} id={id} />
        </View>
        <View style={[styles.noteContent]}>
          <Text numberOfLines={1} style={{flex: 1}}>
            {content}
          </Text>
        </View>
        <NoteStats userEmail={userEmail} privacy={privacy} numComments={comments.length} />
      </TouchableOpacity>
    );
  };

  // TESTING: True to show all users notes regardless of creator. False to only show current users notes
  let showAllUsers = false;
  return (
    <View style={[appStyles.screenContainer]}>
      <FlatList
        style={[appStyles.flatList]}
        data={filteredNotes}
        extraData={notes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => {
          console.log('userEmail: ' + item.userEmail);
          let editableDoc = false;
          if (
            // Check whether note should be shown
            ((item.userEmail === currentUsersEmail ||
              item.privacy.includes('public')) &&
              noteIDs.includes(item._id)) ||
            showAllUsers === true
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
              buttons={['All', 'Personal', 'Public']}
              selectedIndex={selectedIndex}
              onPress={values => {
                setSelectedIndex(values);
                let privacy;
                if (values === 0) {
                  setValue('all');
                  privacy = 'all';
                } else if (values === 1) {
                  setValue('personal');
                  privacy = 'personal';
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
  privacyFilter: {
    width: '100%',
    elevation: 6,
    marginLeft: 0, // Override default Style
    borderRadius: 0, // Override default Style
    marginVertical: 0, // Override default Style
  },
  input: {
    paddingTop: 0, // Override default Style
    paddingBottom: 0, // Override default Style
    backgroundColor: '#fff',
    color: '#424242',
    borderRadius: 10,
    elevation: 5,
    margin: 10,
  },
});

export default ListNotes;
