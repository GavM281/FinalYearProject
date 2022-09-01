import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  View,
  Button,
  Text,
  FlatList,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackActions} from '@react-navigation/native';
import {AuthContext} from '../context/AuthContext';
import {io} from 'socket.io-client';
import axios from 'axios';

let STORAGE_KEY = 'sessionID';
const storeData = async value => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (e) {
    // saving error
    console.log('error' + e);
  }
};

const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log('error' + e);
  }
};

const GroupScreen = ({navigation}) => {
  const {loggedIn, userData} = useContext(AuthContext);
  const [rooms, setRooms] = useState(null);
  const [userID, setUserID] = useState();
  const [sessionID, setSessionID] = useState();
  const connectionConfig = {
    jsonp: false,
    reconnection: true,
    reconnectionDelay: 100,
    reconnectionAttempts: 5000,
    transports: ['websocket'], /// you need to explicitly tell it to use websockets
  };
  const socket = io('https://staidr-heroku.herokuapp.com', connectionConfig);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (loggedIn === false) {
      navigation.dispatch(StackActions.replace('Sign In'));
    }
  }, [loggedIn]);

  useEffect(() => {
    axios
      .get('https://staidr-heroku.herokuapp.com:3000/groups')
      .then(response => {
        setRooms(JSON.parse(JSON.stringify(response.data)));
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    socket.on('connect', () => {
      if (isConnected === false) {
        socket.emit('username', userData.nickname);

        socket.on('sessionData', sessionData => {
          console.log('sessionData' + JSON.stringify(sessionData));

          const JSON_SD = JSON.stringify(sessionData);
          let LocalStorage = getData().then(response => {
            console.log('' + response);

            if (response != null) {
              setSessionID(JSON.parse(response).sessionID);
              setUserID(JSON.parse(response).userID);
            } else {
              storeData(JSON_SD).then(response => {
                console.log('' + response);
              });
              LocalStorage = getData().then(response => {
                console.log('' + response);
                setSessionID(JSON.parse(response).sessionID);
                setUserID(JSON.parse(response).userID);
              });
            }
          });
        });
        setIsConnected(true);
      }
    });

    socket.onAny((event, ...args) => {
      console.log(event, args);
    });
    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [isConnected, sessionID, socket, userData.nickname]);

  const joinRoom = props => {
    if (props.item.Active_users < 4) {
      //console.log('room name ' + JSON.stringify(props.item.Room_name));

      navigation.navigate('Chat', {
        roomDetails: props.item.Room_name,
        userID: userID,
        sessionID: sessionID,
      });
    } else {
      alert('this room is full');
    }
  };
  const getRooms = () => {
    axios
      .get('https://staidr-heroku.herokuapp.com/groups')
      .then(response => {
        //console.log('main res', response);
        //console.log('data', JSON.parse(JSON.stringify(response.data)));
        let responseData = JSON.parse(JSON.stringify(response.data));
        console.log('rooms', responseData[0].Rooms);
        //List of rooms = responseData[0].Rooms
        setRooms(responseData[0].Rooms);
      })
      .catch(error => {
        console.log(error);
      });
  };
  const disconnect = () => {
    socket.disconnect();
    setIsConnected(false);
  };
  /*
   * Firstly I want to display a list of open rooms taken from the mongodb database
   * Mongo db should have a collection of rooms with the room name, messages sent and images sent and the username of the sender
   * and time sent
   *
   * Secondly I want the user to be able to see ow mnay peropel are currently in a room and if there is free space
   * be able to join said chatroom
   *
   * Thirdly each chat room should contain a modern looking chat with features such as image upload,download and previews
   * There should be a notes feature which gets saved back to a users notes section
   * These notes / images should be deletable
   * Users should be able to reply to chats, mark chats as questions, answers
   *
   * Fourthly each room should showcase a
   */

  return (
    <View>
      <Button title="Get Rooms" onPress={() => getRooms()} />
      <FlatList
        data={rooms}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <View>
            <TouchableOpacity onPress={() => joinRoom({item})}>
              <Text>{item.Room_name}</Text>
              <Text>{item.Active_users}/4</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Button title="this Room" onPress={() => joinRoom('apple')} />

      <Button title="disconnect" on onPress={() => disconnect()} />
    </View>
  );
};
export default GroupScreen;
