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

function NoteScreen({navigation, id, name, contents}) {
  const [notes, setNotes] = useState(null);
  const [content, setContent] = useState(contents);
  const [header, setHeader] = useState(name);
  const route = useRoute();

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // When the screen is focused (like loading from another screen), call function to refresh data
      console.log('');
      console.log(' || NOTESCREEN ||');
      console.log('### id is:  ' + route.params.id);
      console.log('contents: ', route.params.contents);
      setContent(route.params.contents);
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
        // setNotes(responseData);
        setContent(responseData[0].content);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getNote = () => {
    console.log('The id is: ' + route.params.id);
    console.log('The content is: ' + content);
    axios
      .get('https://gavin-fyp.herokuapp.com/getNote', {
        params: {
          id: route.params.id,
        },
      })
      .then(response => {
        // handle success
        console.log('Made request');
        console.log(response);
        let responseData = JSON.parse(JSON.stringify(response.data));
        console.log('The id is: ' + responseData._id);
        console.log('The id is: ' + responseData.id);
        console.log('The content is: ' + responseData.content);
        setContent(responseData.content);
      })
      .catch(error => {
        console.log('Failed request');
        // handle error
        console.log(error);
      });
  };

  const saveNoteContent = () => {
    console.log('id in saving note is : ', route.params.id);
    console.log('name in saving note is: ', header);
    console.log('content in saving note is: ', content);
    axios
      .put('https://gavin-fyp.herokuapp.com/updateNote', {
        id: route.params.id,
        name: header,
        content: content,
      })
      .then(response => {
        let responseData = JSON.parse(JSON.stringify(response.data));
        console.log('RESPONSE DATA: ', responseData);
        // getNotes();
      })
      .catch(error => {
        console.log('content: ' + content);
        console.log(error);
      });
  };

  // Display
  return (
    <View style={[styles.sectionContainer]}>
      <TextInput style={[styles.header]} onChangeText={header => setHeader(header)}>{route.params.name}</TextInput>
      {/*<Text style={{color: 'black'}}>Name:{route.params.name}</Text>*/}
      {/*<Text style={{color: 'black'}}>ID:{route.params.id}</Text>*/}
      {/*<Text style={{color: 'black'}}>content: {content}</Text>*/}
      {/*<Text style={{color: 'black'}}>notes: {notes}</Text>*/}
      {/*Note text */}
      <TextInput
        style={[styles.textInput]}
        editable
        multiline={true}
        onChangeText={newText => setContent(newText)}
        value={content}
      />
      <Button
        style={[styles.button]}
        styleDisabled={{color: 'red'}}
        onPress={() => saveNoteContent()}
        title="Save"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    textAlignVertical: 'top',
    // marginTop: 20,
    paddingHorizontal: 14,
    shadowColor: '#000', // IOS
    // shadowOffset: {height: 1, width: 0}, // IOS
    // padding: 6,
    // paddingVertical: 10,
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
    height: '100%',
    marginVertical: 20,
    flex: 1,
  },
  button: {
    fontSize: 20,
    color: 'green',
    margin: '20px',
    textAlignVertical: 'bottom',
  },
  header: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 25,
    color: 'black',
    marginTop: 10,
  },
  // note: {
  //   height: '100%',
  // },
});

export default NoteScreen;
