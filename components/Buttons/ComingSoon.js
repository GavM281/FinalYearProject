import React from 'react';
import {StyleSheet, TouchableOpacity, Text, View} from 'react-native';

const ComingSoon = ({
  title,
  onPress,
  buttonColour,
  titleColour,
  buttonStyle,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      style={{
        ...styles.appButtonContainer,
        ...buttonStyle,
        backgroundColor: buttonColour || '#F29947',
      }}
      onPress={onPress}>
      <View
        style={{
          justifyContent: 'space-between',
          paddingHorizontal: 10,
          paddingVertical: 10,
          marginTop: '-10%',
        }}>
        <Text
          style={{
            ...styles.appButtonText,
            ...textStyle,
            color: titleColour || '#FFF6F6',
            fontSize: 18,
          }}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  // ...
  appButtonContainer: {
    elevation: 8,
    borderRadius: 14,
    shadowColor: '#000', // IOS
    shadowOffset: {height: 4, width: 0}, // IOS
    shadowOpacity: 0.3, // IOS
    shadowRadius: 4.5, //IOS
    padding: 16,
    paddingVertical: 40,
  },

  appButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});

export default ComingSoon;
