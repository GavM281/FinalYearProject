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
      console.log('');
      console.log('  || WIKISCREEN ||');
      getRooms();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const getRooms = () => {
    axios
      .get('https://gavin-fyp.herokuapp.com/getModules')
      // .get('http://89.101.96.182:3001/getModules')
      // .get('http://192.168.2.135:3000/getModules')
      .then(response => {
        // console.log('main res', response);
        // console.log('data', JSON.parse(JSON.stringify(response.data)));
        let responseData = JSON.parse(JSON.stringify(response.data));
        console.log('RESPONSE DATA: ', responseData);
        console.log();
        console.log('content', responseData[0].name);
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
      <Text style={[styles.header]}>Modules</Text>
      <FlatList
        style={[styles.flatlist]}
        data={rooms}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <WikiModule
            style={{elevation: 5}}
            title={item.name}
            Notes={item.notes.length}
            ids={item.notes}
            buttonColour={'#30B283'}
            onPress={() => navigation.navigate('ListNotes', {moduleCode: item.name, moduleNotes: item.notes, moduleID: item._id})}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
    // backgroundColor: 'white',
  },
  flatlist: {
    backgroundColor: 'white',
    elevation: 5,
    // borderWidth: .5,
    borderTopWidth: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  header: {
    color: 'black',
    fontSize: 25,
    textAlign: 'center',
    fontWeight: 'bold',
    // textDecorationLine: 'underline',
    marginTop: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: 'white',
    elevation: 5,
    paddingVertical: 5,
    borderBottomWidth: 1,
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
