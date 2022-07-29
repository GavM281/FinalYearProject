import React, {useContext, useEffect} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {StackActions} from '@react-navigation/native';

import {AuthContext} from '../context/AuthContext';

const HomeScreen = ({navigation}) => {
  const {loggedIn, userData} = useContext(AuthContext);

  useEffect(() => {
    if (loggedIn === false) {
      navigation.dispatch(StackActions.replace('Sign In'));
    }
  }, [loggedIn]);

  return (
    <View style={[styles.container]}>
      <Text style={[styles.textContainer]}>
        This is the home screen navigate below
      </Text>
      <Button
        title={'Analytics'}
        onPress={() => navigation.navigate('Analytics')}
      />
      <Button
        title={'Group'}
        onPress={() => navigation.navigate('GroupHome')}
      />
      <Button title={'Wiki'} onPress={() => navigation.navigate('Wiki')} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingRight: 30,
    paddingLeft: 30,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  textContainer: {
    marginTop: 10,
    fontSize: 30,
    fontWeight: 'bold',
  },
});
