import React, {useContext, useEffect, useState} from 'react';
import {View, Button, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackActions} from '@react-navigation/native';
import {AuthContext} from '../context/AuthContext';
import {io} from 'socket.io-client';
import axios from 'axios';
import WikiModule from './Buttons/WikiModule';

const WikiScreen = ({navigation}) => {
  const {loggedIn} = useContext(AuthContext);
  const [rooms, setRooms] = useState(null);

  useEffect(() => {
    if (loggedIn === false) {
      navigation.dispatch(StackActions.replace('Sign In'));
    }
  }, [loggedIn, navigation]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // When the screen is focused (like loading from another screen), call function to refresh data
      getRooms();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const getRooms = () => {
    axios
      // .get('https://staidr-heroku.herokuapp.com/groups')
      .get('https://gavin-fyp.herokuapp.com/')
      // .get('http://192.168.2.135:3000/')
      .then(response => {
        // console.log('main res', response);
        // console.log('data', JSON.parse(JSON.stringify(response.data)));
        let responseData = JSON.parse(JSON.stringify(response.data));
        console.log('RESPONSE DATA: ', responseData);
        console.log('name', responseData[0].name);
        console.log('content', responseData[0].content);
        //List of rooms = responseData[0].Rooms
        setRooms(responseData);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <View style={[styles.sectionContainer]}>
      {/*<Button title="Get Rooms" onPress={() => getRooms()} />*/}
      <FlatList
        data={rooms}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <WikiModule
            title={item.name}
            Notes="45"
            buttonColour={'#30B283'}
            onPress={() => navigation.navigate('ListNotes')}
          />
        )}
      />
      <WikiModule
        title="CS161"
        Notes="45"
        buttonColour={'#30B283'}
        onPress={() => navigation.navigate('ListNotes')}
      />
      <WikiModule
        title="CS162"
        Notes="14"
        buttonColour={'#30B283'}
        onPress={() => navigation.navigate('ListNotes')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
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
});

export default WikiScreen;
