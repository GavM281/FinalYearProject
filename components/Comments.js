import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {StackActions, useRoute} from '@react-navigation/native';
import {AuthContext} from '../context/AuthContext';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ListNotes = ({
  navigation,
  currentUserEmail,
  noteID,
  commentIDs,
  commentsList,
}) => {
  const route = useRoute();

  const {loggedIn, userData} = useContext(AuthContext);
  const [comments, setComments] = useState();
  const [newComment, setNewComment] = useState('');

  console.log('');
  console.log(' || Comments ||');
  console.log('userEmail: ' + route.params.currentUserEmail);
  console.log('noteID: ' + route.params.noteID);
  console.log('commentIDs: ' + route.params.commentIDs);
  console.log('comments: ' + route.params.commentsList);

  let currentUsersEmail = route.params.currentUserEmail;
  let notesID = route.params.noteID;
  let commentList = route.params.commentsList; // Stores list of comments after retrieving

  React.useEffect(() => {
    console.log('On Comments page');
    setComments(commentList);
    getNote();
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('Getting notes on ListNotes');
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (loggedIn === false) {
      navigation.dispatch(StackActions.replace('Sign In'));
    }
  }, [loggedIn, navigation]);

  const getNote = () => {
    console.log('Getting note info for id: ' + notesID);
    axios
      .post('https://gavin-fyp.herokuapp.com/getSingleNote', {
        id: notesID,
      })
      .then(response => {
        console.log('\n   Made request: getNote');
        let responseData = JSON.parse(JSON.stringify(response.data));
        console.log('Note Content: ' + responseData.content);
        console.log('Note User: ' + responseData.userEmail);
        let commentsIDs = responseData.comments;
        getCommentsFromList(commentsIDs);
      })
      .catch(error => {
        console.log('Failed request');
        // handle error
        console.log(error);
      });
  };

  const getCommentsFromList = async commentsIDs => {
    console.log('\n\nGetCommentFromList\n');
    commentList = [];
    for (let i = 0; i < commentsIDs.length; i++) {
      let id = commentsIDs[i];
      await axios
        .post('https://gavin-fyp.herokuapp.com/getComment', {
          id: id,
        })
        .then(response => {
          console.log('\n     Made request: getComment1');
          let responseData = JSON.parse(JSON.stringify(response.data));
          console.log('Comment Content: ' + responseData.content);
          console.log('Comment User: ' + responseData.userEmail);
          console.log('Comment noteID: ' + responseData.noteID);
          if (responseData != null) {
            commentList.push(responseData);
          }
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
          getNote();
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  const deleteComment = id => {
    console.log('current module id for deleting note: ' + notesID);
    axios
      .post('https://gavin-fyp.herokuapp.com/deleteComment', {
        id: id,
        noteID: notesID,
      })
      .then(response => {
        console.log('Deleted ', id);
        console.log('Deletion response: ', response);
        getNote();
      })
      .catch(error => {
        console.log(error);
      });
  };

  const DeleteIcon = ({id, userEmail}) => {
    // Only show delete icon if comment was made by current user
    if (currentUsersEmail === userEmail) {
      return (
        <Icon
          style={[styles.icon]}
          name="delete"
          color="#ccc"
          size={20}
          onPress={() => {
            deleteComment(id);
          }}
        />
      );
    } else {
      return null;
    }
  };
  const Comment = ({commentContent, userEmail, id}) => {
    return (
      <View style={[styles.comment]}>
        <View style={[styles.commentContentView]}>
          <Text style={[styles.text]}>{commentContent}</Text>
          <DeleteIcon id={id} userEmail={userEmail} />
        </View>
        <Text style={[styles.textSecondary]}>{userEmail}</Text>
      </View>
    );
  };

  return (
    <View style={[styles.sectionContainer]}>
      <Text style={[styles.header]}> COMMENTS </Text>
      <FlatList
        style={[styles.flatList]}
        data={comments}
        extraData={commentList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => {
          if (item.content != null) {
            return (
              <Comment
                commentContent={item.content}
                userEmail={item.userEmail}
                id={item._id}
              />
            );
          }
        }}
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
    height: '100%',
    paddingHorizontal: 10,
  },
  header: {
    color: 'black',
    fontSize: 25,
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: 'white',
    elevation: 5,
    padding: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomWidth: 1,
    textAlignVertical: 'bottom',
    marginTop: 10,
  },
  commentBox: {
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1,
    borderBottomWidth: 0,
    backgroundColor: '#ffffff',
    elevation: 5,
    padding: 5,
  },
  comment: {
    textAlign: 'center',
    borderBottomWidth: 1,
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
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: 'black',
    padding: 10,
    marginBottom: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  flatList: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 10,
    elevation: 5,
    marginBottom: 10,
  },
  commentContentView: {
    justifyContent: 'space-between',
    paddingVertical: -5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'right',
    marginRight: 5,
  },
});

export default ListNotes;
