import React, {useContext, useEffect, useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';
import {StackActions} from '@react-navigation/native';

import {AuthContext} from '../context/AuthContext';
const Drawer = createDrawerNavigator();

const HamburgerMenu = ({navigation}) => {
  const {loggedIn, userData} = useContext(AuthContext);

  useEffect(() => {
    if (loggedIn === false) {
      navigation.dispatch(StackActions.replace('Sign In'));
    }
  }, [loggedIn]);
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: 'Home',
          headerRight: () => (
            <Button
              onPress={() => alert('This is a button!')}
              title="Info"
              color="#000"
            />
          ),
        }}
      />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  );
};

export default HamburgerMenu;