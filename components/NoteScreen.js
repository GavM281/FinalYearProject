import React from 'react';
import {TouchableOpacity, Text, View, TextInput, StyleSheet} from 'react-native';

function NoteScreen({navigation}) {
  // Display
  return (
    <View style={[styles.sectionContainer]}>
      <TextInput
        style={[styles.textInput]}
        editable
        placeholder="Enter Note"
        multiline={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    textAlignVertical: 'top',
    marginTop: 20,
    paddingHorizontal: 14,
    shadowColor: '#000', // IOS
    // shadowOffset: {height: 1, width: 0}, // IOS
    // padding: 6,
    paddingVertical: 10,
    height: '95%',
    // margin: '2%',
  },
  textInput: {
    textAlignVertical: 'top',
    backgroundColor: 'white',
    elevation: 5,
    // borderColor: 'gray',
    width: '100%',
    // borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    // height: '100%',
    flex: 1,
  },
});

export default NoteScreen;
