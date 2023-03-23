import React from 'react';
import {StyleSheet, TouchableOpacity, Text, View} from 'react-native';

const WikiModule = ({title, onPress}) => {
  return (
    <TouchableOpacity style={[styles.buttonContainer]} onPress={onPress}>
      <View>
        <Text style={[styles.moduleName]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  buttonContainer: {
    elevation: 8,
    borderRadius: 14,
    shadowColor: '#000', // IOS
    shadowOffset: {height: 4, width: 0}, // IOS
    shadowOpacity: 0.3, // IOS
    shadowRadius: 4.5, //IOS
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#30B283',
    margin: '2%',
  },

  moduleName: {
    fontWeight: 'bold',
    justifyContent: 'flex-start',
    color: '#FFF6F6',
    fontSize: 25,
  },
});

export default WikiModule;
