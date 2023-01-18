import React, {useContext, useEffect} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {Avatar} from 'react-native-paper';
import {StackActions} from '@react-navigation/native';

import {AuthContext} from '../context/AuthContext';

const ProfileScreen = ({navigation}) => {
  const {logout, loggedIn, userData} = useContext(AuthContext);
  console.log('');
  console.log('userData  ' + userData);
  console.log('userData email: ' + userData.email);
  console.log('userData nickname: ' + userData.nickname);
  console.log('userData Name: ' + userData.name);
  console.log('userData  ' + userData.given_name);
  console.log('userData  ' + userData.user_id);
  console.log('userData  ' + userData.family_name);
  console.log('loggedIn  ' + loggedIn);
  console.log('token  ' + userData.accessToken);
  console.log('token  ' + userData.sub);
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
            <Text style={{color: 'black'}}>{userData.name}</Text>
            <Text style={{color: 'black'}}>{userData.name}</Text>
          </View>
        </View>
      )}

      <Button title="Logout" onPress={() => logout()}>
        Logout
      </Button>
    </View>
  );
};

export default ProfileScreen;

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
    fontColor: 'black',
    color: 'black',
  },
});
