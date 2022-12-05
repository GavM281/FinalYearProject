import React, {useState} from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  TextInput,
  StyleSheet,
  FlatList,
  Button,
} from 'react-native';
import axios from 'axios';
import NoteButton from './Buttons/NoteButton';
import {useRoute} from '@react-navigation/native';

function NoteScreen({navigation, id, name}) {
  const [notes, setNotes] = useState(null);
  const [content, setContent] = useState('');
  const route = useRoute();
  console.log('### id is:  ' + route.params.id);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // When the screen is focused (like loading from another screen), call function to refresh data
      getNote();
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

  const getNote = () => {
    axios
      // .get('https://staidr-heroku.herokuapp.com/groups')
      .get('https://gavin-fyp.herokuapp.com/getNote', {
        id: id,
      })
      .then(response => {
        // console.log('main res', response);
        // console.log('data', JSON.parse(JSON.stringify(response.data)));
        let responseData = JSON.parse(JSON.stringify(response.data));
        console.log('RESPONSE DATA: ', responseData);
        // console.log('rooms', responseData[0].Rooms);
        console.log('name', responseData.name);
        //List of rooms = responseData[0].Rooms
        setNotes(responseData);
        setContent(responseData.content);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const saveNoteContent = () => {
    axios
      .post('https://gavin-fyp.herokuapp.com/createNote', {
        content: content,
      })
      .then(response => {
        let responseData = JSON.parse(JSON.stringify(response.data));
        console.log('RESPONSE DATA: ', responseData);
        getNotes();
      })
      .catch(error => {
        console.log('content: ' + content);
        console.log(error);
      });
  };

  // Display
  return (
    <View style={[styles.sectionContainer]}>
      <Text style={{color: 'black'}}>Name:{route.params.name}</Text>
      <Text style={{color: 'black'}}>ID:{route.params.id}</Text>
      {/*Note text */}
      <TextInput
        style={[styles.textInput]}
        editable
        placeholder="Enter Note"
        multiline={true}
        onChangeText={newText => setContent(newText)}
        defaultValue={content}
      />
      {/*Name*/}
      <FlatList
        data={notes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          // <View style={[styles.note]}>
          // <TextInput style={{color: 'black'}} editable placeholder={item.name} />
          <Text style={{color: 'black'}}>{item.name}</Text>
          // <TextInput
          //   style={[styles.textInput]}
          //   editable
          //   placeholder="Enter Note"
          //   multiline={true}
          // />
          // </View>
        )}
      />
      {/*<Button onPress={() => saveNoteContent()}>Save</Button>*/}
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
