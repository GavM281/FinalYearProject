import React, {useContext, useEffect} from 'react';
import {Alert, Button, StyleSheet, Text, View} from 'react-native';
import {StackActions} from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';

const SignInScreen = ({navigation}) => {
  const {loggedIn} = useContext(AuthContext);

  useEffect(() => {
    if (loggedIn) {
      navigation.dispatch(StackActions.replace('Home'));
    }
  }, [loggedIn]);

  const {login} = useContext(AuthContext);

  return (
    <View style={[styles.sectionContainer]}>
      <Button mode="contained" onPress={() => login()} title={'Login button'}>
        Login with Auth0
      </Button>
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
