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
import Toast from 'react-native-root-toast';
import appStyles from '../stylesheet';

const CommentsScreen = ({
  navigation,
  noteID,
  commentIDs,
}) => {
  const route = useRoute();
  const {loggedIn, userData} = useContext(AuthContext);
  const [comments, setComments] = useState();
  const [newComment, setNewComment] = useState('');

  let currentUsersEmail = userData.email; // Get Current users email
  let notesID = route.params.noteID;
  let commentList = [];

  console.log('');
  console.log(' || Comments ||');
  console.log('userEmail: ' + userData.email);
  console.log('noteID: ' + route.params.noteID);
  console.log('commentIDs: ' + route.params.commentIDs);

  React.useEffect(() => {
    console.log('On Comments page');
    setComments(commentList);
    getNote();
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
        // Show confirmation message
        Toast.show('Deleted Comment', {
          duration: Toast.durations.SHORT, // 2 seconds
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
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
          style={[appStyles.icon]}
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
          <Text style={{color: 'black'}}>{commentContent}</Text>
          <DeleteIcon id={id} userEmail={userEmail} />
        </View>
        <Text style={[styles.commentCreatorText]}>{userEmail}</Text>
      </View>
    );
  };

  return (
    <View style={{...appStyles.screenContainer, padding: 10}}>
      <Text style={[appStyles.header]}> COMMENTS </Text>
      <FlatList
        style={{...appStyles.flatList, ...appStyles.roundBottomCorners, padding: 10}}
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
          style={[styles.commentInputBox]}
          placeholder="New Comment"
          placeholderTextColor="#636363"
          multiline={true}
          editable
          onChangeText={newText => setNewComment(newText)}
          value={newComment}
        />
        <TouchableOpacity
          style={[styles.postButton]}
          onPress={() => createComment()}>
          <Text style={{color: 'white'}}>Post Comment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  commentInputBox: {
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    padding: 5,
    marginTop: 10,
    borderWidth: 1,
    borderBottomWidth: 0,
    backgroundColor: '#ffffff',
    elevation: 5,
    ...appStyles.roundTopCorners,
  },
  postButton: {
    alignItems: 'center',
    backgroundColor: '#666aff',
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: 'black',
    padding: 10,
    ...appStyles.roundBottomCorners,
  },
  commentContentView: {
    justifyContent: 'space-between',
    paddingVertical: -5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  comment: {
    textAlign: 'center',
    borderBottomWidth: 1,
    marginVertical: 5,
  },
  commentCreatorText: {
    color: '#616161',
    fontSize: 11,
    marginVertical: 2,
  },
});

export default CommentsScreen;
