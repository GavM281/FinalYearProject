import React, {useState} from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  TextInput,
  StyleSheet,
  FlatList,
} from 'react-native';
import axios from 'axios';
import NoteButton from './Buttons/NoteButton';

function NoteScreen({navigation}) {
  const [notes, setNotes] = useState(null);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // When the screen is focused (like loading from another screen), call function to refresh data
      getNotes();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  // Change to find by id that's passed in
  const getNotes = () => {
    axios
      // .get('https://staidr-heroku.herokuapp.com/groups')
      .get('https://gavin-fyp.herokuapp.com/')
      .then(response => {
        // console.log('main res', response);
        // console.log('data', JSON.parse(JSON.stringify(response.data)));
        let responseData = JSON.parse(JSON.stringify(response.data));
        console.log('RESPONSE DATA: ', responseData);
        // console.log('rooms', responseData[0].Rooms);
        console.log('name', responseData[0].name);
        //List of rooms = responseData[0].Rooms
        setNotes(responseData);
      })
      .catch(error => {
        console.log(error);
      });
  };

  // Display
  return (
    <View style={[styles.sectionContainer]}>
      <TextInput
        style={[styles.textInput]}
        editable
        placeholder="Enter Note"
        multiline={true}
      />
      <FlatList
        data={notes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          // <View style={[styles.note]}>
          <TextInput style={{color: 'black'}} editable placeholder={item.name} />
          // <TextInput
          //   style={[styles.textInput]}
          //   editable
          //   placeholder="Enter Note"
          //   multiline={true}
          // />
          // </View>
        )}
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
    backgroundColor: '#ededed',
    // margin: '2%',
  },
  textInput: {
    textAlignVertical: 'top',
    backgroundColor: '#ffffff',
    elevation: 5,
    color: 'black',
    // borderColor: 'gray',
    width: '100%',
    // borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    // height: '100%',
    flex: 1,
  },
  note: {
    height: '100%',
  },
});

export default NoteScreen;
