import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {StackActions} from '@react-navigation/native';

import {AuthContext} from '../context/AuthContext';
// import NoteButton from './Buttons/NoteButton';
import axios from 'axios';
import WikiModule from './Buttons/WikiModule';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ListNotes = ({navigation}) => {
  const {loggedIn, userData} = useContext(AuthContext);
  const [notes, setNotes] = useState(null);
  const [name, setName] = useState('');
  console.log('');
  console.log(' || LISTNOTES ||');
  console.log('email: ' + userData.email);
  const userEmail = userData.email;
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
  }) => {
    return (
      <TouchableOpacity
        style={{
          ...styles.appButtonContainer,
          ...buttonStyle,
          backgroundColor: buttonColour || '#F29947',
        }}
        onPress={() =>
          navigation.navigate('NoteScreen', {id: id, name: title, contents: content})
        }>
        {/*Module name*/}
        <View
          style={{
            justifyContent: 'space-between',
            paddingHorizontal: 10,
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
              deleteNote(id), navigation.navigate('ListNotes');
            }}
          />
        </View>
        <View
          style={{
            justifyContent: 'space-between',
            paddingHorizontal: 10,
            paddingVertical: 10,
            flexDirection: 'row',
            alignItems: 'center',
            // marginTop: '-10%',
          }}>
          <Text numberOfLines={1} style={{ width: '100%', flex: 1 }}>{content}</Text>
        </View>
        {/*<View>*/}
        {/*  <Text*/}
        {/*    style={{*/}
        {/*      ...styles.appButtonText,*/}
        {/*      ...textStyle,*/}
        {/*      color: '#d1d1d1',*/}
        {/*      fontSize: 15,*/}
        {/*      flex: 1,*/}
        {/*    }}>*/}
        {/*    {id}*/}
        {/*  </Text>*/}
        {/*</View>*/}
      </TouchableOpacity>
    );
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // When the screen is focused (like loading from another screen), call function to refresh data
      getNotes();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const getNotes = () => {
    axios
      // .get('https://staidr-heroku.herokuapp.com/groups')
      .get('https://gavin-fyp.herokuapp.com/')
      .then(response => {
        // console.log('main res', response);
        // console.log('data', JSON.parse(JSON.stringify(response.data)));
        let responseData = JSON.parse(JSON.stringify(response.data));
        console.log('RESPONSE DATA: ', responseData);
        // console.log('rooms', responseData[0].Rooms);
        console.log('name', responseData[0].name);
        //List of rooms = responseData[0].Rooms
        setNotes(responseData);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const createNote = () => {
    axios
      .post('https://gavin-fyp.herokuapp.com/createNote', {
        name: name,
        content: '',
        userEmail: userEmail,
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

  return (
    <View style={[styles.sectionContainer]}>
      <View style={[styles.createNote]}>
        <Text style={{textAlign: 'center', fontWeight: 'bold', color:'white', fontSize: 20}}>Enter note name</Text>

        <TextInput
          style={styles.input}
          onChangeText={text => setName(text)}
          placeholder="Enter Name"
          label="Name"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => createNote()}
          title="Save">
          <Text style={{color: 'white'}}>Save</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notes}
        keyExtractor={(item, index) => index.toString()}
        // setId({notes._id});
        renderItem={({item}) => (
          <NoteButton
            title={item.name}
            content={item.content}
            buttonColour={'#30B283'}
            navigation={navigation}
            id={item._id}
            // onPress={() => navigation.navigate('NoteScreen', {id: item._id, name: item.name})}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    marginBottom: 20,
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
