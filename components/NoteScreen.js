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
import DropDownPicker from 'react-native-dropdown-picker';
import {HeaderBackButton} from '@react-navigation/elements';
const { ObjectID } = require('mongodb');

function NoteScreen({
  navigation,
  id,
  name,
  contents,
  commentsIDs,
  editable,
  privacy,
  moduleInfo,
  userEmail,
}) {
  const route = useRoute();

  const [notes, setNotes] = useState(null);
  const [content, setContent] = useState(contents);
  const [comment, setComment] = useState('comment');
  const [comments, setComments] = useState();
  const [commentEmail, setCommentEmail] = useState('commentEmail');
  const [header, setHeader] = useState(name);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(route.params.privacy); // Set value of dropdown to value of privacy that was passed in
  const [items, setItems] = useState([
    {label: 'Private', value: 'private'},
    {label: 'Public', value: 'public'},
  ]);
  const editableDoc = route.params.editable;
  let moduleInfos = route.params.moduleInfo;
  let noteID = route.params.id;
  let currentUserEmail = route.params.userEmail;
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // When the screen is focused (like loading from another screen), call function to refresh data
      console.log('');
      console.log(' || NOTESCREEN ||');
      console.log('### id is:  ' + route.params.id);
      console.log('contents: ', route.params.contents);
      console.log('editable: ' + editableDoc);
      console.log('commentID: ' + route.params.commentsIDs);
      console.log('currentModuleCode: ' + moduleInfos[0]);
      // console.log('noteIDs: ' + moduleInfos[1]);
      console.log('currentModuleID: ' + moduleInfos[2]);
      setContent(route.params.contents);
      getComment();
      navigation.setOptions({
        headerLeft: () => (
          // <TouchableOpacity style={[styles.button]}
          <HeaderBackButton
            onPress={() => {
              navigation.navigate('ListNotes', {
                moduleCode: moduleInfos[0],
                moduleNotes: moduleInfos[1],
                moduleID: moduleInfos[2],
              });
            }}
          />
        ),
      });
      // getNote();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const getNote = () => {
    console.log('GET NOTE -> The id is: ' + route.params.id);
    // console.log('The content is: ' + content);
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

  const getComment = () => {
    var axios = require('axios');
    // console.log(commentID);
    var data = JSON.stringify({
      id: '63f1791d7dfb51047211028c',
    });

    var config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://gavin-fyp.herokuapp.com/getComment',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
    // console.log('GET Comment -> The id is: ' + commentID);
    // console.log('The content is: ' + content);


    // axios
    //   .get('https://gavin-fyp.herokuapp.com/getComment', {
    //     params: {
    //       id: '63f1791d7dfb51047211028c',
    //     },
    //   })
    //   .then(response => {
    //     // handle success
    //     console.log('\n   Made request with id:   63f1791d7dfb51047211028c');
    //     // console.log('ID was: ' + commentID);
    //     console.log('Response:  ' + response.data);
    //     console.log('Response:  ' + response[0]);
    //     console.log('Response:  ' + response);
    //     console.log('Response:  ' + response.content);
    //     console.log('Response:  ' + response.id);
    //     console.log('Response:  ' + response._id);
    //     // console.log('Response:  ' + response[0].data);
    //     let responseData = JSON.parse(JSON.stringify(response.data));
    //     // console.log('The id is: ' + responseData._id);
    //     // console.log('The id is: ' + responseData.id);
    //     // console.log('The content is: ' + responseData.content);
    //     console.log('Response:  ' + responseData);
    //     setComment(responseData.content);
    //     setCommentEmail(responseData.userEmail);
    //     setComments(responseData);
    //   })
    //   .catch(error => {
    //     console.log('Failed request');
    //     // handle error
    //     console.log(error);
    //   });
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

  // const Comment = ({commentContent, userEmail}) => {
  //   return (
  //     <View>
  //       <Text style={{color: 'black'}}>Content: {commentContent}</Text>
  //       <Text>Email: {userEmail}</Text>
  //     </View>
  //   );
  // };

  // Display
  return (
    <View style={[styles.sectionContainer]}>
      <View style={[styles.noteSection]}>
        <TextInput
          style={[styles.header]}
          editable={editableDoc}
          onChangeText={header => setHeader(header)}>
          {route.params.name}
        </TextInput>
        {/*Note text */}
        <TextInput
          style={[styles.textInput]}
          editable={editableDoc}
          multiline={true}
          onChangeText={newText => setContent(newText)}
          value={content}
        />

        <DropDownPicker
          style={[styles.dropdown]}
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          // hideSelectedItemIcon={true}
          disabled={!editableDoc}
          // ArrowDownIconComponent = ArrowUpIconComponent;
        />
        {/*<Button*/}
        {/*  style={[styles.button]}*/}
        {/*  styleDisabled={{color: 'red'}}*/}
        {/*  onPress={() => saveNoteContent()}*/}
        {/*  title="Save"*/}
        {/*/>*/}
        <TouchableOpacity
          style={[styles.button]}
          onPress={() =>
            navigation.navigate('Comments', {
              currentUserEmail: currentUserEmail,
              noteID: noteID,
            })
          }>
          <Text style={{color: 'white'}}>Comments</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            ...styles.button,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            backgroundColor: '#666aff',
          }}
          onPress={() => saveNoteContent('Comments')}>
          <Text style={{color: 'white'}}>Save</Text>
        </TouchableOpacity>
      </View>
      {/*<View style={[styles.comments]}>*/}
      {/*  <Text> Comments </Text>*/}
      {/*  /!*<Text> {route.params.comments} </Text>*!/*/}
      {/*  /!*<FlatList*!/*/}
      {/*  /!*  data={comments}*!/*/}
      {/*  /!*  keyExtractor={(item, index) => index.toString()}*!/*/}
      {/*  /!*  renderItem={({item}) => {*!/*/}
      {/*  /!*    console.log('item is : ' + item);*!/*/}
      {/*  /!*    console.log('item is : ' + item.content);*!/*/}
      {/*  /!*    console.log('item is : ' + item.userEmail);*!/*/}
      {/*  /!*    // console.log('1: ' + route.params.comments);*!/*/}
      {/*  /!*    // console.log('2: ' + route.params.comments[0]);*!/*/}
      {/*  /!*    // console.log('3: ' + route.params.comments[1]);*!/*/}
      {/*  /!*    // getComment(item);*!/*/}

      {/*  /!*    return <Comment commentContent={item.content} userEmail={item.userEmail} />;*!/*/}
      {/*  /!*  }}*!/*/}
      {/*/>*/}
      {/*</View>*/}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    textAlignVertical: 'top',
    // marginTop: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    shadowColor: '#000', // IOS
    height: '100%',
    backgroundColor: '#ededed',
    // margin: '2%',
  },
  comments: {
    backgroundColor: 'blue',
    textAlign: 'center',
    // flex: 1,
    width: '100%',
    height: 50,
    // backgroundColor: '#EE5407',
    justifyContent: 'center',
    alignItems: 'center',
    // position: 'absolute', //Here is the trick
    // bottom: 0, //Here is the trick
  },
  noteSection: {
    // position: 'absolute',
    height: '100%',
    flex: 1,
  },
  textInput: {
    textAlignVertical: 'top',
    backgroundColor: '#ffffff',
    // elevation: 5,
    color: 'black',
    // borderColor: 'gray',
    width: '100%',
    // borderBottomWidth: 1,
    // borderBottomLeftRadius: 10,
    // borderBottomRightRadius: 10,
    padding: 10,
    height: '100%',
    // marginBottom: 10,
    flex: 1,
  },
  button: {
    fontSize: 20,
    color: 'green',
    // borderRadius: 10,
    alignItems: 'center',
    // backgroundColor: '#666aff',
    backgroundColor: '#868686',
    padding: 10,
    // marginVertical: 10,
    // borderBottomLeftRadius: 10,
    // borderBottomRightRadius: 10,
    // marginBottom: 10,
    // margin: '20px',
    // textAlignVertical: 'bottom',
  },
  header: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 25,
    color: 'black',
    elevation: 6,
    borderBottomWidth: 1,
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    // borderWidth: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 5,
    // marginTop: 5,
  },
  dropdown: {
    // marginVertical: 5,
    borderRadius: 0,
    borderWidth: 0,
    borderTopWidth: 1,
  },
});

export default NoteScreen;
