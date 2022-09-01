import React, {
  useContext,
  useEffect,
  useCallback,
  useState,
  useRef,
} from 'react';
import {Platform} from 'react-native';
import emojiUtils from 'emoji-utils';
import {StackActions} from '@react-navigation/native';
import {AuthContext} from '../context/AuthContext';
import ChatMessages from './ChatComponents/ChatMessages';
import {io} from 'socket.io-client';
import axios from 'axios';
import {GiftedChat} from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';

let STORAGE_KEY = 'sessionID';
const storeData = async value => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (e) {
    // saving error
    console.log('error' + e);
  }
};

const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log('error' + e);
  }
};

const ChatScreen = ({navigation: {goBack, navigation}, route}) => {
  let roomName = route.params.roomDetails;
  let UserID = route.params.userID;
  //let sessionID = route.params.sessionID;
  // const room_id = room; //id for room socket
  const {loggedIn, userData} = useContext(AuthContext);
  //socket io userEffect
  const connectionConfig = {
    jsonp: false,
    reconnection: true,
    reconnectionDelay: 100,
    reconnectionAttempts: 5000,
    transports: ['websocket'], /// you need to explicitly tell it to use websockets
  };
  const socket = io('https://staidr-heroku.herokuapp.com', connectionConfig, {
    autoConnect: false,
  });
  // gets session ID if available when chat opened

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  let userEmail = userData.email;
  let userID;
  let sessionID;

  useEffect(() => {
    if (loggedIn === false) {
      navigation.dispatch(StackActions.replace('Sign In'));
    }
  }, [loggedIn]);
  useEffect(() => {
    axios
      .get('https://staidr-heroku.herokuapp.com/users/' + userEmail)
      .then(response => {
        let Data = JSON.parse(JSON.stringify(response.data));
        let correctId = JSON.stringify(Data[0]._id);
      })
      .catch(error => {
        console.log(error);
      });
  });
  useEffect(() => {
    socket.on('connect', () => {
      if (isConnected === false && isDisconnecting === false) {
        socket.emit('username', userData.nickname);
        socket.on('sessionData', sessionData => {
          const JSON_SD = JSON.stringify(sessionData);
          let LocalStorage = getData().then(response => {
            console.log('');

            if (response != null) {
              sessionID = JSON.parse(response).sessionID;
              userID = JSON.parse(response).userID;
              socket.emit(
                'join-room',
                roomName,
                userData.nickname,
                sessionID,
                userID,
              );
            } else {
              storeData(JSON_SD).then(response => {
                console.log('');
              });
              LocalStorage = getData().then(response => {
                console.log('');
                sessionID = JSON.parse(response).sessionID;
                userID = JSON.parse(response).userID;
                socket.emit(
                  'join-room',
                  roomName,
                  userData.nickname,
                  sessionID,
                  userID,
                );
              });
            }
          });
        });
      }
      setIsConnected(true);
    });

    socket.on('users', users => {
      users.forEach(user => {
        user.self = user.userID === socket.id;
      });
      // put the current user first, and then sort by username
      this.users = users.sort((a, b) => {
        if (a.self) {
          return -1;
        }
        if (b.self) {
          return 1;
        }
        if (a.username < b.username) {
          return -1;
        }
        return a.username > b.username ? 1 : 0;
      });
      /*
        Print active users somewhere on screen
              console.log(`list of ${JSON.stringify(users)}`);

       */
    });

    socket.on('message', ({content, from}) => {
      console.log('Received message');
      for (let i = 0; i < this.users.length; i++) {
        const user = this.users[i];
        //console.log(user);
        if (user.userID === from) {
          console.log(
            `message from ${user.username} the message was: ${content}`,
          );
          /*
          user.messages.push({
            content,
          });
          // if (user !== this.selectedUser) {
          user.hasNewMessages = true;
          // }
          */
          break;
        }
      }
    });

    socket.on('test-socket-emit', ({sessionID, userID}) => {
      //console.log('received socket test' + sessionID + ' ' + userID);
    });
    socket.on('test-io-emit', ({sessionID, userID}) => {
      //console.log('received io test' + sessionID + ' ' + userID);
    });

    //print all events to console
    socket.onAny((event, ...args) => {
      console.log(event, args);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [socket]);

  const disconnectSocket = () => {
    setIsDisconnecting(true);
    socket.emit('leaveRoom', roomName, userID, userData.nickname);
    goBack();
  };
  useEffect(() => {
    // Prevent default behavior of leaving the screen
    //e.preventDefault();
    //disconnectSocket();
    //navigation.dispatch(e.data.action);
    //navigation.getParam({logout: });
  }, [navigation]);

  const sendMessage = content => {
    socket.emit('Room-message', {
      content,
      to: roomName,
      from: userID,
    });
    /*

      //Somehow display the message to the sender using react gifted chat

      this.selectedUser.messages.push({
        content,
        fromSelf: true,
      });
       */
  };

  /*
   * Thirdly each chat room should contain a modern looking chat with features such as image upload,download and previews
   * There should be a notes feature which gets saved back to a users notes section
   * These notes/ images shoudl eb delatable
   * Users should be able to reply to chats, mark chats as questions, answers
   *
   * Fourthly each room should showcase a
   */
  useEffect(() => {
    if (loading === true) {
      axios
        .get('https://staidr-heroku.herokuapp.com/messages/' + roomName)
        .then(response => {
          //console.log('main res', response);
          ///console.log('data', JSON.parse(JSON.stringify(response.data)));
          let responseData = JSON.parse(JSON.stringify(response.data));
          console.log('messages', responseData);
          //List of rooms = responseData[0].Rooms
          /*
          Issues witj the user array below and gettign session data on this page keeps comign up as undefined

           */
          let ListOfMessages = responseData.map(message => ({
            _id: message._id,
            createdAt: message.createdAt,
            text: message.Current_message,
            user: {
              _id: message.User._id,
              name: message.User.Email,
              avatar: message.User.Avatar,
            },
          }));
          //console.log('LOM1' + JSON.stringify(ListOfMessages));
          ListOfMessages = ListOfMessages.sort(
            (a, b) => b.createdAt - a.createdAt,
          );
          console.log('LOM2' + JSON.stringify(ListOfMessages));

          setMessages(ListOfMessages);
        })
        .catch(error => {
          console.log(error);
        });
      setLoading(false);
    }
  }, [loading]);

  const onSend = useCallback(
    (messages = []) => {
      console.log(roomName + 'on sned' + userData.Email + userData.picture);
      console.log(messages[0]);
      let userID = JSON.parse(JSON.stringify(UserID));
      console.log('user id ' + userID);
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, messages),
      );
      axios
        .post('https://staidr-heroku.herokuapp.com/messages/add', {
          Edited_flag: false,
          Is_image: false,
          Group_id: '62e2a4e91e36529e05c90185',
          Current_message: messages[0].text,
          Original_message: messages[0].text,
          Room_name: roomName,
          User: {
            Email: userData.Email,
            User_id: JSON.stringify(UserID),
            Avatar: userData.picture,
          },
        })
        .then(response => {
          console.log(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });

      socket.emit('newMessage', messages);
    },
    [socket],
  );
  const renderMessage = props => {
    const {
      currentMessage: {Current_Message: currText},
    } = props;

    let messageTextStyle;

    // Make "pure emoji" messages much bigger than plain text.
    if (currText && emojiUtils.isPureEmojiString(currText)) {
      messageTextStyle = {
        fontSize: 28,
        // Emoji get clipped if lineHeight isn't increased; make it consistent across platforms.
        lineHeight: Platform.OS === 'android' ? 34 : 30,
      };
    }

    return <ChatMessages {...props} messageTextStyle={messageTextStyle} />;
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: userID,
        name: userEmail,
        avatar:
          'https://ui-avatars.com/api/?background=random&name=' + userEmail,
      }}
      renderMessage={renderMessage}
    />
  );
};
export default ChatScreen;
/*
    <View>
      <Text>Connected: {'' + isConnected}</Text>
      <Text>Last pong: {lastPong || '-'}</Text>
      <Button title="leave room" onPress={disconnectSocket} />
      <Button
        title="Send sample message"
        onPress={sendMessage('this is a sample message')}
      />
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    </View>
    */
