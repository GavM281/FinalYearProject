import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {StackActions, useRoute} from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import {AuthContext} from '../context/AuthContext';
// import NoteButton from './Buttons/NoteButton';
import axios from 'axios';
import WikiModule from './Buttons/WikiModule';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ListNotes = ({navigation, moduleCode, moduleNotes, moduleID}) => {
  const route = useRoute();

  const {loggedIn, userData} = useContext(AuthContext);
  const [notes, setNotes] = useState(null);
  const [name, setName] = useState('');

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('private');
  const [items, setItems] = useState([
    {label: 'Private', value: 'private'},
    {label: 'Public', value: 'public'},
  ]);

  console.log('');
  console.log(' || LISTNOTES ||');
  const currentUsersEmail = userData.email;
  const currentModuleCode = route.params.moduleCode;
  const noteIDs = route.params.moduleNotes;
  const currentModuleID = route.params.moduleID;

  const moduleInfo = [currentModuleCode, noteIDs, currentModuleID];
  console.log('ListNotes moduleInfo: ');
  console.log('  currentModuleCode: ' + moduleInfo[0]);
  // console.log('noteIDs: ' + moduleInfo[1]);
  console.log('  currentModuleID: ' + moduleInfo[2]);
  //
  console.log('email: ' + userData.email);
  console.log('code: ' + currentModuleCode);
  console.log('Module ID: ' + currentModuleID);
  // console.log('IDs: ' + noteIDs);

  const deleteNote = id => {
    axios
      .post('https://gavin-fyp.herokuapp.com/deleteNote', {
        id: id,
      })
      .then(response => {
        console.log('Deleted ', id);
        getNotes(); // Refresh list of notes
      })
      .catch(error => {
        console.log(error);
      });
  };

  const NoteButton = ({
    title,
    content,
    Notes,
    onPress,
    buttonColour,
    titleColour,
    buttonStyle,
    textStyle,
    navigation,
    id,
    userEmail,
    privacy,
    editable,
  }) => {
    return (
      <TouchableOpacity
        style={{
          ...styles.appButtonContainer,
          ...buttonStyle,
          backgroundColor: buttonColour || '#F29947',
          paddingLeft: 10,
        }}
        onPress={() =>
          navigation.navigate('NoteScreen', {
            id: id,
            name: title,
            contents: content,
            editable: editable,
            moduleInfo: moduleInfo,
          })
        }>
        <View
          style={{
            justifyContent: 'space-between',
            // paddingHorizontal: 10,
            paddingVertical: 10,
            flexDirection: 'row',
            alignItems: 'center',
            // marginTop: '-10%',
          }}>
          <Text
            style={{
              ...styles.appButtonText,
              ...textStyle,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: titleColour || '#FFF6F6',
              fontSize: 25,
            }}>
            {title}
          </Text>

          <Icon
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'right',
            }}
            name="delete"
            color="#ccc"
            size={30}
            onPress={() => {
              deleteNote(id);
            }}
          />
        </View>
        <View
          style={{
            justifyContent: 'space-between',
            // paddingHorizontal: 10,
            paddingBottom: 10,
            flexDirection: 'row',
            alignItems: 'center',
            // marginTop: '-10%',
          }}>
          <Text numberOfLines={1} style={{width: '100%', flex: 1}}>
            {content}
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name="person" size={20} />
          <Text>{userEmail}</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name="public" size={20} />
          <Text>{privacy}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  React.useEffect(() => {
    getNotes();
    console.log('On ListNotes page');
    const unsubscribe = navigation.addListener('focus', () => {
      // When the screen is focused (like loading from another screen), call function to refresh data
      getNotes();
      console.log('Getting notes on ListNotes');
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const getNotes = async () => {
    await axios
      // .get('https://staidr-heroku.herokuapp.com/groups')
      .get('https://gavin-fyp.herokuapp.com/getNotes', {
        // ids: ['63c73ece03e5b856270ab63b', '63c740fee0dcd7e242a5e63a'],
      })
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

  const createNote = () => {
    axios
      .post('https://gavin-fyp.herokuapp.com/createNote', {
        name: name,
        content: '',
        userEmail: currentUsersEmail,
        privacy: value,
        groupID: currentModuleID,
      })
      .then(response => {
        let responseData = JSON.parse(JSON.stringify(response.data));
        console.log('RESPONSE DATA: ', responseData);
        getNotes();
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (loggedIn === false) {
      navigation.dispatch(StackActions.replace('Sign In'));
    }
  }, [loggedIn, navigation]);
  //
  // TESTING: True to show all users notes regardless of creator. False to only show current users notes
  let showAllUsers = false;
  return (
    <View style={[styles.sectionContainer]}>
      <Text
        style={{
          color: 'black',
          fontSize: 25,
          textAlign: 'center',
          fontWeight: 'bold',
        }}>
        {currentModuleCode}
      </Text>
      <TouchableOpacity
        style={[styles.button]}
        onPress={() =>
          navigation.navigate('CreateNote', {
            userEmail: currentUsersEmail,
            moduleID: currentModuleID,
            moduleInfo: moduleInfo,
          })
        }>
        <Text style={{color: 'white'}}>Create a new note</Text>
      </TouchableOpacity>
      <FlatList
        data={notes}
        keyExtractor={(item, index) => index.toString()}
        // setId ({notes._id});
        renderItem={({item}) => {
          let editableDoc = false;
          if (
            ((item.userEmail === currentUsersEmail ||
              item.privacy === 'public') &&
              noteIDs.includes(item._id)) ||
            showAllUsers == true
          ) {
            // if ( item.userEmail === currentUsersEmail || item.privacy === "public" || showAllUsers == true){
            if (item.userEmail === currentUsersEmail) {
              editableDoc = true;
              return (
                <NoteButton
                  title={item.name}
                  content={item.content}
                  buttonColour={'#30B283'}
                  navigation={navigation}
                  id={item._id}
                  userEmail={item.userEmail}
                  privacy={item.privacy}
                  editable={editableDoc}
                />
              );
            } else {
              return (
                <NoteButton
                  title={item.name}
                  content={item.content}
                  buttonColour={'#30B283'}
                  navigation={navigation}
                  id={item._id}
                  userEmail={item.userEmail}
                  privacy={item.privacy}
                  editable={editableDoc}
                />
              );
            }
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    // marginTop: 32,
    paddingHorizontal: 24,
    marginBottom: 100,
    // paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#373cff',
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
  input: {
    height: 40,
    marginVertical: 12,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    // width: 200,
    color: 'black',
    width: '100%',
    textAlign: 'center',
    backgroundColor: 'white',
  },
  createNote: {
    backgroundColor: '#30B283',
    borderRadius: 14,
    margin: '2%',
    padding: 10,
  },
  appButtonContainer: {
    elevation: 8,
    borderRadius: 14,
    shadowColor: '#000', // IOS
    shadowOffset: {height: 4, width: 0}, // IOS
    shadowOpacity: 0.3, // IOS
    shadowRadius: 4.5, //IOS
    // padding: 6,
    paddingVertical: 10,
    margin: '2%',
  },

  appButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    justifyContent: 'flex-start',
  },
});

export default ListNotes;
