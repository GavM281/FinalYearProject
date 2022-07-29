import React, {useContext, useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {StackActions} from '@react-navigation/native';
import {AuthContext} from '../context/AuthContext';
import io from 'socket.io-client';
import {List} from 'react-native-paper';
import axios from 'axios';

const GroupScreen = ({navigation}) => {
  const {loggedIn} = useContext(AuthContext);
  const socketRef = useRef();
  const [groups, setGroups] = useState(null);
  useEffect(() => {
    if (loggedIn === false) {
      navigation.dispatch(StackActions.replace('Sign In'));
    }
  }, [loggedIn]);

  useEffect(() => {
    axios
      .get('https://192.168.0.21:4000/groups')
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  });

  /*
  socket io userEffect
    socketRef.current = io('http://192.168.1.138:3000');
    socketRef.current.on('testMessage', 'Test');
  */

  /*
   * Firstly I want to display a list of open rooms taken from the mongodb database
   * Mongo db should have a collection of rooms with the room name, messages sent and images sent and the username of the sender
   * and time sent
   *
   * Secondly I want the user to be able to see ow mnay peropel are currently in a room and if there is free space
   * be able to joi nsaid chatroom
   *
   * Thirdly each chat room should contain a modern looking chat with features such as image upload,download and previews
   * There should be a notes feature which gets saved back to a users notes section
   * These notes/ images shoudl eb delatable
   * Users should be able to reply to chats, mark chats as questions, answers
   *
   * Fourthly each room should showcase a
   */

  return <View />;
};
export default GroupScreen;
