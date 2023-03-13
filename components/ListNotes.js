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

const ListNotes = ({navigation, moduleCode, moduleNotes, moduleID}) => {
  const route = useRoute();

  const {loggedIn, userData} = useContext(AuthContext);
  const [notes, setNotes] = useState();

  console.log('');
  console.log(' || LISTNOTES ||');
  const currentUsersEmail = userData.email;
  const currentModuleCode = route.params.moduleCode;
  let noteIDs = route.params.moduleNotes;
  // let noteIDs;
  const currentModuleID = route.params.moduleID;

  const moduleInfo = [currentModuleCode, noteIDs, currentModuleID];
  let noteList = [];
  console.log('ListNotes moduleInfo: ');
  console.log('  currentModuleCode: ' + moduleInfo[0]);
  // console.log('noteIDs: ' + moduleInfo[1]);
  console.log('  currentModuleID: ' + moduleInfo[2]);
  console.log('email: ' + userData.email);
  console.log('code: ' + currentModuleCode);
  console.log('Module ID: ' + currentModuleID);
  console.log('IDs: ' + noteIDs);

  useEffect(() => {
    if (loggedIn === false) {
      navigation.dispatch(StackActions.replace('Sign In'));
    }
  }, [loggedIn, navigation]);

  React.useEffect(() => {
    setNotes(noteList);
    getGroup();
    console.log('On ListNotes page');
    const unsubscribe = navigation.addListener('focus', () => {
      // When the screen is focused (like loading from another screen), call function to refresh data
      // getNotes();
      // getNoteFromList();
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
        console.log('noteIDs is : ', notesIDs);
        getNoteFromList(notesIDs);
      })
      .catch(error => {
        console.log('Failed request');
        // handle error
        console.log(error);
      });
  };

  const getNoteFromList = async notesIDs => {
    console.log('\n\nGetNoteFromList\n');
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
          console.log('Content: ' + responseData.content);
          console.log('User: ' + responseData.userEmail);
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
    setNotes(noteList);
  };

  const deleteNote = id => {
    console.log('current module id for deleting note: ' + currentModuleID);
    axios
      .delete('https://gavin-fyp.herokuapp.com/deleteNote', {
        id: id, // ID of note
        groupID: currentModuleID, // The ID of the module this note is part of, used to delete id from array
      })
      .then(response => {
        console.log('Deleted ', id);
        // getNotes(); // Refresh list of notes
        // getNoteFromList();
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
          <Text numberOfLines={2} style={[styles.noteTitle]}>{title}</Text>

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
          <Icon name="public" size={20} style={[styles.icon]} />
          <Text>{privacy}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const getHeader = () => {
    return (
      <View>
        <Text style={[styles.moduleHeader]}>{currentModuleCode}</Text>
        <TouchableOpacity
          style={[styles.createButton]}
          onPress={() =>
            navigation.navigate('CreateNote', {
              userEmail: currentUsersEmail,
              moduleID: currentModuleID,
              moduleInfo: moduleInfo,
            })
          }>
          <Text style={{color: 'white', fontSize: 17}}>Create</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // TESTING: True to show all users notes regardless of creator. False to only show current users notes
  let showAllUsers = false;
  return (
    <View style={[styles.screenContainer]}>
      <FlatList
        style={[styles.flatList]}
        data={notes}
        extraData={noteList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => {
          let editableDoc = false;
          if (
            ((item.userEmail === currentUsersEmail ||
              item.privacy.includes('public')) &&
              noteIDs.includes(item._id)) ||
            showAllUsers == true
          ) {
            if (item.userEmail === currentUsersEmail || item.privacy === 'public(editable)') {
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
        ListHeaderComponent={getHeader} // Needed to avoid error about flatlist inside scrollview, allows scrolling entire page
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
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'right',
    marginRight: 5,
  },
});

export default ListNotes;
