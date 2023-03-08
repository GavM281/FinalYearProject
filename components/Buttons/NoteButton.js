import React from 'react';
import {StyleSheet, TouchableOpacity, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';

const deleteNote = (id, currentModuleID) => {
  console.log('current module id for deleting note: ' + currentModuleID);
  axios
    .post('https://gavin-fyp.herokuapp.com/deleteNote', {
      id: id, // ID of note
      groupID: currentModuleID, // The ID of the module this note is part of, used to delete id from array
    })
    .then(response => {
      console.log('Deleted ', id);
      // getNotes(); // Refresh list of notes
    })
    .catch(error => {
      console.log(error);
    });
};

const DeleteIcon = ({noteEmail, id, currentUsersEmail, currentModuleID}) => {
  if (noteEmail === currentUsersEmail) {
    // Note made by current user, can be deleted
    return (
      <Icon
        style={[styles.icon]}
        name="delete"
        color="#ccc"
        size={30}
        onPress={() => {
          deleteNote(id, currentModuleID);
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
  navigation,
  userEmail,
  currentUserEmail,
  privacy,
  editable,
  comments,
  moduleInfo: moduleInfo,
}) => {
  let currentModuleID = moduleInfo[2];
  return (
    <TouchableOpacity
      style={[styles.appButtonContainer]}
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
      <View style={[styles.noteView]}>
        <Text style={[styles.noteTitle]}>{title}</Text>

        <DeleteIcon
          noteEmail={userEmail}
          id={id}
          currentUsersEmail={userEmail}
          currentModuleID={currentModuleID}
        />
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

const styles = StyleSheet.create({
  appButtonContainer: {
    elevation: 5,
    borderRadius: 14,
    paddingVertical: 10,
    margin: '2%',
    backgroundColor: '#30B283',
    paddingLeft: 10,
  },
  noteView: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  noteTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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

export default NoteButton;
