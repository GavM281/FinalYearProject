import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity} from 'react-native';
import {StackActions} from '@react-navigation/native';

import {AuthContext} from '../context/AuthContext';
import NoteButton from './Buttons/NoteButton';
import axios from 'axios';
import WikiModule from "./Buttons/WikiModule";

const ListNotes = ({navigation}) => {
  const {loggedIn} = useContext(AuthContext);
  const [notes, setNotes] = useState(null);
  const [name, setName] = useState('');
  console.log('\n      || LISTNOTES ||');

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
        content: 'Note content',
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
        <Text style={{textAlign: 'center'}}>Enter note name</Text>

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
          <Text style={{color: 'black'}}>Save</Text>
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
    color: 'blue',
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
});

export default ListNotes;
