import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
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
    console.log('current module id for deleting note: ' + currentModuleID);
    axios
      .post('https://gavin-fyp.herokuapp.com/deleteNote', {
        id: id, // ID of note
        groupID: currentModuleID, // The ID of the module this note is part of, used to delete id from array
      })
      .then(response => {
        console.log('Deleted ', id);
        getNotes(); // Refresh list of notes
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
    comments,
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
            commentsIDs: comments,
            editable: editable,
            privacy: privacy,
            moduleInfo: moduleInfo,
            userEmail: currentUsersEmail,
          })
        }>
        <View
          style={{
            justifyContent: 'space-between',
            // paddingHorizontal: 10,
            // paddingVertical: 10,
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

          <DeleteIcon noteEmail={userEmail} id={id} />
          {/*<Icon*/}
          {/*  style={[styles.icon]}*/}
          {/*  name="delete"*/}
          {/*  color="#ccc"*/}
          {/*  size={30}*/}
          {/*  onPress={() => {*/}
          {/*    deleteNote(id);*/}
          {/*  }}*/}
          {/*/>*/}
        </View>
        <View
          style={{
            justifyContent: 'space-between',
            // paddingHorizontal: 10,
            paddingBottom: 5,
            flexDirection: 'row',
            alignItems: 'center',
            // marginTop: '-10%',
          }}>
          <Text numberOfLines={1} style={{width: '100%', flex: 1}}>
            {content}
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name="person" size={20} style={{marginRight: 5}} />
          <Text>{userEmail}</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name="public" size={20} style={{marginRight: 5}} />
          <Text>{privacy}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  React.useEffect(() => {
    // getNotes();
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

  const getHeader = () => {
    return (
      <View>
        <Text style={[styles.header]}>{currentModuleCode}</Text>
        <TouchableOpacity
          style={[styles.button]}
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
    <View style={[styles.sectionContainer]}>
      <FlatList
        style={[styles.flatlist]}
        data={notes}
        keyExtractor={(item, index) => index.toString()}
        // setId ({notes._id});
        renderItem={({item}) => {
          let editableDoc = false;
          // console.log('comments:  ' + item.comments);
          // console.log('item:   ' + item);
          if (
            ((item.userEmail === currentUsersEmail ||
              item.privacy.includes('public')) &&
              noteIDs.includes(item._id)) ||
            showAllUsers == true
          ) {
            // if ( item.userEmail === currentUsersEmail || item.privacy === "public" || showAllUsers == true){
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
                buttonColour={'#30B283'}
                navigation={navigation}
                id={item._id}
                userEmail={item.userEmail}
                privacy={item.privacy}
                editable={editableDoc}
                comments={item.comments}
              />
            );
            // } else {
            //   return (
            //     <NoteButton
            //       title={item.name}
            //       content={item.content}
            //       buttonColour={'#30B283'}
            //       navigation={navigation}
            //       id={item._id}
            //       userEmail={item.userEmail}
            //       privacy={item.privacy}
            //       editable={editableDoc}
            //     />
            //   );
            // }
          }
        }}
        ListHeaderComponent={getHeader} // Needed to avoid error about flatlist inside scrollview, allows scrolling entire page
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    // marginTop: 32,
    // paddingHorizontal: 10,
    // marginVertical: 10,
    // paddingBottom: 30,
    // backgroundColor: '#ededed',
    height: '100%',
    paddingHorizontal: 10,
    borderRadius: 10,
    // paddingBottom: 20,
    // borderBottomLeftRadius: 10,
    // borderBottomRightRadius: 10,
    // flex: 1,
    // paddingBottom: 100,
  },
  header: {
    color: 'black',
    fontSize: 25,
    textAlign: 'center',
    fontWeight: 'bold',
    // textDecorationLine: 'underline',
    // marginTop: 5,
    // borderTopLeftRadius: 10,
    // borderTopRightRadius: 10,
    // backgroundColor: 'white',
    // elevation: 5,
    paddingVertical: 5,
    // marginHorizontal: 10,
    // marginTop: 10,
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
    backgroundColor: '#666aff',
    // backgroundColor: 'white',
    // borderWidth: 1,
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
    borderColor: 'black',
    padding: 10,
    marginHorizontal: 10,
    elevation: 5,
    // margin: 10,
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
  flatlist: {
    backgroundColor: '#ffffff',
    // borderBottomLeftRadius: 10,
    // borderBottomRightRadius: 10,
    // borderRadius: 10,
    // marginHorizontal: 10,
    // padding: -10,
    // paddingBottom: 20,
    elevation: 5,
  },
  appButtonContainer: {
    elevation: 5,
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
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'right',
    marginRight: 5,
  },
});

export default ListNotes;
