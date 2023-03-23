import React, {useContext, useEffect} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';
import WikiScreen from './WikiScreen';
import {StackActions} from '@react-navigation/native';

import {AuthContext} from '../context/AuthContext';
const Drawer = createDrawerNavigator();

const HamburgerMenu = ({navigation}) => {
  const {loggedIn} = useContext(AuthContext);

  useEffect(() => {
    if (loggedIn === false) {
      navigation.dispatch(StackActions.replace('Sign In'));
    }
  }, [loggedIn]);
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Wiki" component={WikiScreen} />
    </Drawer.Navigator>
  );
};

export default HamburgerMenu;
