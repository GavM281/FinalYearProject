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

const ListNotes = ({navigation}) => {
  const route = useRoute();

  const {loggedIn, userData} = useContext(AuthContext);
  const [notes, setNotes] = useState(null);
  const [name, setName] = useState('');



  console.log('');
  console.log(' || Comments ||');
  // const currentUsersEmail = userData.email;
  // const currentModuleCode = route.params.moduleCode;
  // const noteIDs = route.params.moduleNotes;
  // const currentModuleID = route.params.moduleID;

  // const moduleInfo = [currentModuleCode, noteIDs, currentModuleID];
  // console.log('ListNotes moduleInfo: ');
  // console.log('  currentModuleCode: ' + moduleInfo[0]);
  // // console.log('noteIDs: ' + moduleInfo[1]);
  // console.log('  currentModuleID: ' + moduleInfo[2]);
  // //
  // console.log('email: ' + userData.email);
  // console.log('code: ' + currentModuleCode);
  // console.log('Module ID: ' + currentModuleID);
  // console.log('IDs: ' + noteIDs);

  // const deleteNote = id => {
  //   axios
  //     .post('https://gavin-fyp.herokuapp.com/deleteNote', {
  //       id: id,
  //     })
  //     .then(response => {
  //       console.log('Deleted ', id);
  //       getNotes(); // Refresh list of notes
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  // };

  //

  // React.useEffect(() => {
  //   getNotes();
  //   console.log('On ListNotes page');
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     // When the screen is focused (like loading from another screen), call function to refresh data
  //     getNotes();
  //     console.log('Getting notes on ListNotes');
  //   });
  //
  //   // Return the function to unsubscribe from the event so it gets removed on unmount
  //   return unsubscribe;
  // }, [navigation]);



  // const createNote = () => {
  //   axios
  //     .post('https://gavin-fyp.herokuapp.com/createNote', {
  //       name: name,
  //       content: '',
  //       userEmail: currentUsersEmail,
  //       privacy: value,
  //       groupID: currentModuleID,
  //     })
  //     .then(response => {
  //       let responseData = JSON.parse(JSON.stringify(response.data));
  //       console.log('RESPONSE DATA: ', responseData);
  //       getNotes();
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  // };

  useEffect(() => {
    if (loggedIn === false) {
      navigation.dispatch(StackActions.replace('Sign In'));
    }
  }, [loggedIn, navigation]);
  //

  const getHeader = () => {
    return (
      <View>
        <Text> COMMENTS </Text>
        {/*<Text style={[styles.header]}>{currentModuleCode}</Text>*/}
        {/*<TouchableOpacity*/}
        {/*  style={[styles.button]}*/}
        {/*  onPress={() =>*/}
        {/*    navigation.navigate('CreateNote', {*/}
        {/*      userEmail: currentUsersEmail,*/}
        {/*      moduleID: currentModuleID,*/}
        {/*      moduleInfo: moduleInfo,*/}
        {/*    })*/}
        {/*  }>*/}
        {/*  <Text style={{color: 'white', fontSize: 17}}>Create</Text>*/}
        {/*</TouchableOpacity>*/}
      </View>
    );
  };

  // TESTING: True to show all users notes regardless of creator. False to only show current users notes
  let showAllUsers = false;
  return (
    <Text> COMMENTS </Text>
  //     <FlatList
  //       style={[styles.flatlist]}
  //       data={notes}
  //       keyExtractor={(item, index) => index.toString()}
  //       // setId ({notes._id});
  //       renderItem={({item}) => {
  //         let editableDoc = false;
  //         if (
  //           ((item.userEmail === currentUsersEmail ||
  //             item.privacy === 'public') &&
  //             noteIDs.includes(item._id)) ||
  //           showAllUsers == true
  //         ) {
  //           // if ( item.userEmail === currentUsersEmail || item.privacy === "public" || showAllUsers == true){
  //           if (item.userEmail === currentUsersEmail) {
  //             editableDoc = true;
  //             return (
  //               <NoteButton
  //                 title={item.name}
  //                 content={item.content}
  //                 buttonColour={'#30B283'}
  //                 navigation={navigation}
  //                 id={item._id}
  //                 userEmail={item.userEmail}
  //                 privacy={item.privacy}
  //                 editable={editableDoc}
  //               />
  //             );
  //           } else {
  //             return (
  //               <NoteButton
  //                 title={item.name}
  //                 content={item.content}
  //                 buttonColour={'#30B283'}
  //                 navigation={navigation}
  //                 id={item._id}
  //                 userEmail={item.userEmail}
  //                 privacy={item.privacy}
  //                 editable={editableDoc}
  //               />
  //             );
  //           }
  //         }
  //       }}
  //       ListHeaderComponent={getHeader} // Needed to avoid error about flatlist inside scrollview, allows scrolling entire page
  //     />
  //   </View>
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