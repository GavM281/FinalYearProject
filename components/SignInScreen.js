import React, {useState} from 'react';
import Auth0 from 'react-native-auth0';
import {Alert, Button, StyleSheet, Text, View} from 'react-native';

var credentials = require('../auth0-configuration');
const auth0 = new Auth0(credentials);

const SignInScreen = () => {
  let [accessToken, setAccessToken] = useState(null);

  const onLogin = () => {
    auth0.webAuth
      .authorize({
        scope: 'openid profile email',
      })
      .then(credentials => {
        Alert.alert('AccessToken: ' + credentials.accessToken);
        setAccessToken(credentials.accessToken);
      })
      .catch(error => console.log(error));
  };

  const onLogout = () => {
    auth0.webAuth
      .clearSession({})
      .then(success => {
        Alert.alert('Logged out!');
        setAccessToken(null);
      })
      .catch(error => {
        console.log('Log out cancelled');
      });
  };

  let loggedIn = accessToken !== null;

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.header}> Auth0Sample - Login </Text>
      <Text>You are{loggedIn ? ' ' : ' not '}logged in. </Text>
      <Button
        onPress={loggedIn ? onLogout : onLogin}
        title={loggedIn ? 'Log Out' : 'Log In'}
      />
    </View>
  );
};

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
    fontWeight: '700',
  },
});

export default SignInScreen;
