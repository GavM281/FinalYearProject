import React, {useContext, useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {StackActions} from '@react-navigation/native';
import {AuthContext} from '../context/AuthContext';
import io from 'socket.io-client';

const GroupHomeScreen = ({navigation}) => {
  const {loggedIn} = useContext(AuthContext);
  const socketRef = useRef();
  const [buttonPresses, setButtonPresses] = useState(0);
  useEffect(() => {
    if (loggedIn === false) {
      navigation.dispatch(StackActions.replace('Sign In'));
    }
  }, [loggedIn]);

  /*
   * This is the group list of modules screen
   * On this screen there should be an interactive button for the cs620c class and later an ability to add more classes
   * This button should lead to a list of socket rooms where they can join their labs
   */
  return (
    <View style={[styles.sectionContainer]}>
      <Pressable
        style={styles.button}
        onPress={() => {
          setButtonPresses(buttonPresses + 1);
        }}>
        <Text style={styles.sectionTitle}>press me</Text>
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={() => {
          navigation.navigate('Group');
        }}>
        <Text style={styles.sectionTitle}>cs620c </Text>
      </Pressable>
      <Text>{buttonPresses}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    //alignContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 30,
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
    paddingHorizontal: 20,
    paddingVertical: 50,
    borderRadius: 20,
    backgroundColor: '#30D5C8',
  },
});

export default GroupHomeScreen;
