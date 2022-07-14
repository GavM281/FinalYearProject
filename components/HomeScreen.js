import React, {useContext, useEffect} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {Avatar} from 'react-native-paper';
import {StackActions} from '@react-navigation/native';

import {AuthContext} from '../context/AuthContext';

const HomeScreen = ({navigation}) => {
  const {logout, loggedIn, userData} = useContext(AuthContext);

  useEffect(() => {
    if (loggedIn === false) {
      navigation.dispatch(StackActions.replace('Sign In'));
    }
  }, [loggedIn]);

  return (
    <View style={[styles.container]}>
      {userData && (
        <View style={styles.userContainer}>
          <Avatar.Image size={100} source={{uri: userData.picture}} />
          <View style={styles.textContainer}>
            <Text>{userData.name}</Text>
          </View>
        </View>
      )}

      <Button title="Logout" onPress={() => logout()}>
        Logout
      </Button>
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
  textContainer: {marginTop: 10},
});
