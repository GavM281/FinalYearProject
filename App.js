import React, {useState} from 'react';
import type {Node} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
/*
Gets Bundle identifer and displays it when app runs

import DeviceInfo from 'react-native-device-info';
console.log('@ device   ', DeviceInfo.getBundleId());
*/
/*
Components
 */
//import homeScreen from './components/homeScreen';
import SignInScreen from './components/SignInScreen';
import {AuthContextProvider} from './context/AuthContext';
import HomeScreen from './components/HomeScreen';
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <AuthContextProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Sign In" component={SignInScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContextProvider>
  );
};
/*

 */
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
    fontSize: 20,
    fontWeight: '700',
  },
});

export default App;
