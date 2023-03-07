import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {StackActions, useRoute} from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import {AuthContext} from '../context/AuthContext';
// import NoteButton from './Buttons/NoteButton';
import axios from 'axios';
import WikiModule from './Buttons/WikiModule';
import Icon from 'react-native-vector-icons/MaterialIcons';
import mongoose from 'mongoose';

const ListNotes = ({
  navigation,
  currentUserEmail,
  noteID,
  commentIDs,
  commentsList,
}) => {
  const route = useRoute();

  const {loggedIn, userData} = useContext(AuthContext);
  const [notes, setNotes] = useState(null);
  const [name, setName] = useState('');
  // const [comments, setComments] = useState(route.params.commentsList);
  const [comments, setComments] = useState();
  // const [commentsIDs, setCommentsIDs] = useState(route.params.commentIDs);
  const [newComment, setNewComment] = useState('');

  console.log('');
  console.log('');
  console.log('');
  console.log(' || Comments ||');
  console.log('userEmail: ' + route.params.currentUserEmail);
  console.log('noteID: ' + route.params.noteID);
  console.log('commentIDs: ' + route.params.commentIDs);
  console.log('comments: ' + route.params.commentsList);
  // console.log('comments[0]: ' + route.params.commentsList[0].content);

  let currentUsersEmail = route.params.currentUserEmail;
  let notesID = route.params.noteID;
  // let commentsIDs = route.params.commentIDs; // The IDs of comments, passed from NoteScreen
  // let commentList = [];
  let commentList = route.params.commentsList; // Stores list of comments after retrieving
  // if(commentList == null){
  //   commentList = [];
  // }
  // let commentList = getCommentsFromList();
  // setComments(commentList);
  // console.log(commentList[0]);

  React.useEffect(() => {
    // getNotes();
    console.log('On Comments page');
    // commentsIDs = route.params.commentIDs; // The IDs of comments, passed from NoteScreen
    setComments(commentList);
    // getOneComment();
    // getComment();
    getNote();
    // getComments();
    // getCommentsFromList();
    const unsubscribe = navigation.addListener('focus', () => {
      // When the screen is focused (like loading from another screen), call function to refresh data
      // getOneComment();
      // getComment().then(r => console.log('The Response for getComment is: ' + r));
      // getComment1();
      // getCommentsFromList();
      // getComments();
      // for (let i = 0; i < commentsIDs.length; i++) {
      //   commentList = getComment1(commentsIDs[i]);
      //   console.log(i + ' commentList[i] is ' + commentList[i]);
      // }

      console.log('Getting notes on ListNotes');
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const getComments = () => {
    // commentList = [];
    axios
      .get('https://gavin-fyp.herokuapp.com/getComments')
      .then(response => {
        // handle success
        console.log('\n     Made request: getComments');
        let responseData = JSON.parse(JSON.stringify(response.data));
        console.log('Response:  ' + responseData);
        // setComment(responseData.content);
        // setCommentEmail(responseData.userEmail);
        commentList = responseData;
        setComments(responseData);
      })
      .catch(error => {
        console.log('Failed request');
        // handle error
        console.log(error);
      });
  };

  const getNote = () => {
    console.log('Getting note info for id: ' + notesID);
    axios
      .post('https://gavin-fyp.herokuapp.com/getSingleNote', {
        id: notesID,
        // id: '63f1791d7dfb51047211028c',
        // id: '63f551b9469a48ffdb421e48',
      })
      .then(response => {
        console.log('\n   Made request: getNote');
        let responseData = JSON.parse(JSON.stringify(response.data));
        console.log('Note Content: ' + responseData.content);
        console.log('Note User: ' + responseData.userEmail);
        let commentsIDs = responseData.comments;
        getCommentsFromList(commentsIDs);
        // console.log(' noteID: ' + responseData.noteID);
        // setComments(responseData);
        // commentList.push(responseData);
        // return responseData;
      })
      .catch(error => {
        console.log('Failed request');
        // handle error
        console.log(error);
      });
  };

  const getComment = async () => {
    console.log('\n\nGETCOMMENT\n');
    await axios
      .get('https://gavin-fyp.herokuapp.com/getComment', {
        // body: {
        id: '63f1791d7dfb51047211028c',
        // id: '63f551b9469a48ffdb421e48',
        // },
      })
      .then(response => {
        // handle success
        console.log('\n   Made request: getComment');
        // console.log('ID was: ' + commentID);
        console.log('Response:  ' + response.data);
        console.log('Response:  ' + response[0]);
        console.log('Response:  ' + response);
        console.log('Response:  ' + response.content);
        console.log('Response:  ' + response.id);
        console.log('Response:  ' + response._id);
        // console.log('Response:  ' + response[0].data);
        let responseData = JSON.parse(JSON.stringify(response.data));
        // console.log('The id is: ' + responseData._id);
        // console.log('The id is: ' + responseData.id);
        // console.log('The content is: ' + responseData.content);
        console.log('Response:  ' + responseData);
        // setComment(responseData.content);
        // setCommentEmail(responseData.userEmail);
        // setComments(responseData);
      })
      .catch(error => {
        console.log('Failed request');
        // handle error
        console.log(error);
      });
  };

  const getComment1 = async id => {
    console.log('\n\nGETCOMMENT1\n');
    await axios
      .post('https://gavin-fyp.herokuapp.com/getComment1', {
        id: id,
        // id: '63f1791d7dfb51047211028c',
        // id: '63f551b9469a48ffdb421e48',
      })
      .then(response => {
        console.log('\n   Made request: getComment1');
        let responseData = JSON.parse(JSON.stringify(response.data));
        console.log('Comment Content: ' + responseData.content);
        console.log('Comment User: ' + responseData.userEmail);
        console.log('Comment noteID: ' + responseData.noteID);
        // setComments(responseData);
        // commentList.push(responseData);
        return responseData;
      })
      .catch(error => {
        console.log('Failed request');
        // handle error
        console.log(error);
      });
  };

  const getCommentsFromList = async commentsIDs => {
    console.log('\n\nGetCommentFromList\n');
    console.log('commentsIDs is length:  ' + commentsIDs.length);
    // let fullList = [];
    commentList = [];
    for (let i = 0; i < commentsIDs.length; i++) {
      let id = commentsIDs[i];

      console.log(i);
      // commentList = getComment1(commentsIDs[i]);
      // console.log(i + ' commentList[i] is ' + commentList[i]);
      // }
      await axios
        .post('https://gavin-fyp.herokuapp.com/getComment1', {
          id: id,
          // id: '63f1791d7dfb51047211028c',
          // id: '63f551b9469a48ffdb421e48',
        })
        .then(response => {
          console.log('\n     Made request: getComment1');
          let responseData = JSON.parse(JSON.stringify(response.data));
          console.log('Comment Content: ' + responseData.content);
          console.log('Comment User: ' + responseData.userEmail);
          console.log('Comment noteID: ' + responseData.noteID);
          console.log('RESPONSE in getFromList: ' + responseData);
          if (responseData != null) {
            commentList.push(responseData);
            // setComments(responseData);
            // console.log('COMMENTS IS NOW: ' + comments[0].content);
            console.log('COMMENTS in getFromList IS NOW: ' + comments);
            console.log('COMMENTS in getFromList IS NOW: ' + commentList);
            // setComments(commentList);
            // fullList.push(responseData);
          }
          // setComments(comments + responseData);
          // commentList.push(responseData);
          // return responseData;
        })
        .catch(error => {
          console.log('Failed request');
          // handle error
          console.log(error);
        });
    }
    setComments(commentList);
    return commentList;
  };

  const getOneComment = () => {
    console.log('\n\nGETONECOMMENT\n');
    axios
      .get('https://gavin-fyp.herokuapp.com/getOneComment', {
        // body: {
        id: '63f1791d7dfb51047211028c',
        // id: '63f551b9469a48ffdb421e48',
        // },
      })
      .then(response => {
        // handle success
        console.log('\n   Made request: getOneComment');
        // console.log('ID was: ' + commentID);
        console.log('Response1:  ' + response.data);
        console.log('Response2:  ' + response.data[0]);
        console.log('Response3:  ' + response.data.content);
        console.log('Response4:  ' + response[0]);
        console.log('Response5:  ' + response);
        console.log('Response6:  ' + response.content);
        console.log('Response7:  ' + response.id);
        console.log('Response8:  ' + response._id);
        // console.log('Response:  ' + response[0].data);
        let responseData = JSON.parse(JSON.stringify(response.data));
        // console.log('The id is: ' + responseData._id);
        // console.log('The id is: ' + responseData.id);
        // console.log('The content is: ' + responseData.content);
        console.log('Response:  ' + responseData);
        // setComment(responseData.content);
        // setCommentEmail(responseData.userEmail);
        // setComments(responseData);
      })
      .catch(error => {
        console.log('Failed request');
        // handle error
        console.log(error);
      });
  };

  // getOneComment();
  // getComment();

  const createComment = () => {
    console.log(
      'Creating comment with: ' + newComment + '  and ' + currentUsersEmail,
    );
    if (newComment != null) {
      axios
        .post('https://gavin-fyp.herokuapp.com/createComment', {
          content: newComment,
          userEmail: currentUsersEmail,
          noteID: notesID,
        })
        .then(response => {
          let responseData = JSON.parse(JSON.stringify(response.data));
          console.log('RESPONSE DATA: ', responseData);
          // getComments();
          // comments
          console.log('Comment Content: ' + responseData.content);
          console.log('Comment User: ' + responseData.userEmail);
          console.log('Comment noteID: ' + responseData.noteID);
          console.log('Comment id: ' + responseData._id);

          // setCommentsIDs(commentsIDs + responseData._id);
          // commentsIDs.push(responseData._id);
          // setComments(comments + responseData);
          // commentList.push(responseData);

          // console.log(
          //   'Last element of id array is: ' +
          //     commentsIDs[commentsIDs.length - 1] +
          //     ' and comment id is: ' +
          //     responseData._id,
          // );
          // getCommentsFromList();
          // setComments(getCommentsFromList());
          // getComments();
          getNote();
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  const deleteComment = id => {
    console.log('current module id for deleting note: ' + notesID);
    // console.log('1 length of commentsIDs is: ' + commentsIDs.length);
    axios
      .post('https://gavin-fyp.herokuapp.com/deleteComment', {
        id: id,
        noteID: notesID,
      })
      .then(response => {
        console.log('Deleted ', id);
        console.log('Deletion response: ', response);
        // commentsIDs.shift(id);
        // commentList = [];
        // let index = commentsIDs.indexOf(id);
        // delete commentsIDs[index];i
        // setCommentsIDs(

        // (commentsIDs = commentsIDs.filter(function (item) {
        //   return item !== id;
        // })),
          // );
          // console.log('2 length of commentsIDs is: ' + commentsIDs.length);
        // setComments(commentList);
        // setComments(getCommentsFromList()); // Refresh list of Comments
        // getCommentsFromList();
        getNote();
        // getComments();
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (loggedIn === false) {
      navigation.dispatch(StackActions.replace('Sign In'));
    }
  }, [loggedIn, navigation]);
  //

  const Comment = ({commentContent, userEmail, id}) => {
    if (currentUsersEmail === userEmail) {
      // If current user made comment, show delete option
      return (
        <View style={[styles.comment]}>
          <View
            style={{
              justifyContent: 'space-between',
              // paddingHorizontal: 10,
              paddingVertical: -5,
              flexDirection: 'row',
              alignItems: 'center',
              // marginTop: '-10%',
            }}>
            <Text style={[styles.text]}>{commentContent}</Text>
            <Icon
              style={[styles.icon]}
              name="delete"
              color="#ccc"
              size={20}
              onPress={() => {
                deleteComment(id);
              }}
            />
          </View>
          <Text style={[styles.textSecondary]}>{userEmail}</Text>
        </View>
      );
    } else {
      // Comment made by other user, don't show delete option
      return (
        <View style={[styles.comment]}>
          <View
            style={{
              justifyContent: 'space-between',
              // paddingHorizontal: 10,
              paddingVertical: -5,
              flexDirection: 'row',
              alignItems: 'center',
              // marginTop: '-10%',
            }}>
            <Text style={[styles.text]}>{commentContent}</Text>
          </View>
          <Text style={[styles.textSecondary]}>{userEmail}</Text>
        </View>
      );
    }
  };

  // TESTING: True to show all users notes regardless of creator. False to only show current users notes
  let showAllUsers = false;
  return (
    <View style={[styles.sectionContainer]}>
      <Text style={[styles.header]}> COMMENTS </Text>
      {/*<Text> {route.params.comments} </Text>*/}
      <FlatList
        style={[styles.flatlist]}
        // data={comments}
        data={comments}
        extraData={commentList}
        // data={commentList}
        // extraData={comments}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => {
          // console.log('\nitem is : ' + item);
          // console.log('\nitem is : ' + comments);
          // console.log('\nitem is : ' + comments.content);
          // console.log('item content is : ' + item.content);
          // console.log('item email is : ' + item.userEmail);
          // getComment1(item);
          // console.log(
          //   'commentsIDs: ' + commentsIDs + ' and item id is =:  ' + item._id,
          // );
          // if(!commentsIDs.includes(item._id)) {
          //   commentsIDs += commentsIDs;
          // }
          if (item.content != null
            // && commentsIDs.includes(item._id)
          ) {
            return (
              // <Comment commentContent={item.content} userEmail={item.userEmail} id={item._id} />
              <Comment
                commentContent={item.content}
                userEmail={item.userEmail}
                id={item._id}
              />
            );
          }
        }}
        // contentContainerStyle={{flexGrow: 1}}
        // ListFooterComponentStyle={{flex: 1, justifyContent: 'flex-end'}}
        // ListFooterComponent={getFooter}
      />
      <View>
        <TextInput
          style={[styles.commentBox]}
          placeholder="New Comment"
          placeholderTextColor="#636363"
          multiline={true}
          editable
          onChangeText={newText => setNewComment(newText)}
          value={newComment}
        />
        <TouchableOpacity
          style={[styles.button]}
          onPress={() => createComment()}>
          <Text style={{color: 'white'}}>Post Comment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    // marginTop: 32,
    // paddingHorizontal: 10,
    // marginVertical: 10,
    // paddingBottom: 30,
    // backgroundColor: '#ededed',
    height: '100%',
    paddingHorizontal: 10,
    // borderRadius: 10,
    // paddingBottom: 20,
    // borderBottomLeftRadius: 10,
    // borderBottomRightRadius: 10,
    // flex: 1,
    // paddingBottom: 100,
  },
  header: {
    color: 'black',
    fontSize: 25,
    textAlign: 'center',
    fontWeight: 'bold',
    // textDecorationLine: 'underline',
    // marginTop: 5,
    // borderRadius: 10,
    backgroundColor: 'white',
    elevation: 5,
    padding: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomWidth: 1,
    // marginHorizontal: 10,
    textAlignVertical: 'bottom',
    // marginHorizontal: 10,
    marginTop: 10,
  },
  commentBox: {
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    // borderRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    backgroundColor: '#ffffff',
    // height: '20%',
    elevation: 5,
    padding: 5,
    // textAlignVertical: 'bottom',
  },
  comment: {
    textAlign: 'center',
    // backgroundColor: 'lightblue',
    borderBottomWidth: 1,
    // borderRadius: 10,
    marginVertical: 5,
  },
  text: {
    color: 'black',
    fontSize: 15,
  },
  textSecondary: {
    color: '#616161',
    fontSize: 11,
    marginVertical: 2,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#666aff',
    // backgroundColor: 'white',
    borderWidth: 1,
    borderTopWidth: 0,
    // borderBottomWidth: 1,
    borderColor: 'black',
    padding: 10,
    marginBottom: 10,
    // marginHorizontal: 10,
    // elevation: 5,
    // margin: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  input: {
    height: 40,
    marginVertical: 12,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    // width: 200,
    color: 'black',
    width: '100%',
    textAlign: 'center',
    backgroundColor: 'white',
  },
  createNote: {
    backgroundColor: '#30B283',
    borderRadius: 14,
    margin: '2%',
    padding: 10,
  },
  flatlist: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    // borderRadius: 10,
    // marginHorizontal: 10,
    padding: 10,
    // paddingBottom: 20,
    elevation: 5,
    marginBottom: 10,
  },
  appButtonContainer: {
    elevation: 5,
    borderRadius: 14,
    shadowColor: '#000', // IOS
    shadowOffset: {height: 4, width: 0}, // IOS
    shadowOpacity: 0.3, // IOS
    shadowRadius: 4.5, //IOS
    // padding: 6,
    paddingVertical: 10,
    margin: '2%',
  },

  appButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    justifyContent: 'flex-start',
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'right',
    marginRight: 5,
  },
});

export default ListNotes;
