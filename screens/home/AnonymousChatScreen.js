import React, {useEffect, useState} from 'react';
import {
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  GiftedChat,
  Actions,
  Bubble,
  InputToolbar,
} from 'react-native-gifted-chat';
import CustomSafeAreaView from '../../components/CustomSafeAreaView';
import styles from '../../styles';
import ReplyChatFooter from '../../components/chat/ReplyChatFooter';
import CustomComposer from '../../components/chat/CustomComposer';
import CustomSend from '../../components/chat/CustomSend';
import AnonymousChatHeader from '../../components/chat/AnonymousChatHeader';
import {useDispatch, useSelector} from 'react-redux';
import {
  changeUserMatchingStatus,
  configureAnonymousChatRoom,
  sendMessageInAnonymousChatRoom,
  skipThisFOF,
  startListeningForAnonymousChatRoom,
} from '../../store/actions/matching';
import AppText from '../../components/AppText';
import ReactNativeModal from 'react-native-modal';
import IconCircle from '../../components/IconCircle';
import colors from '../../constants/colors';
import {scale} from 'react-native-size-matters';
import Modal from 'react-native-modalbox';
import CueCardsScreen from '../CueCardsScreen';
import {setUserIsTyping} from '../../firebase/utils';
import auth from '@react-native-firebase/auth';
import {launchImageLibrary} from 'react-native-image-picker';
import ImageChatFooter from '../../components/chat/ImageChatFooter';

const AnonymousChatScreen = props => {
  const matchingState = useSelector(state => state.matching);
  const {FOF, viaFriend, messages, matchingStatus} = matchingState;
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [areCueCardsVisible, setAreCueCardsVisible] = useState(false);
  const [userLikes, setUserLikes] = useState(matchingStatus === 3);
  const isFOFOnline = useSelector(state => state.matching.isFOFOnline);
  const [replying, setReplying] = useState(false); //Render chat list footer and reply property in new message accordingly
  const [attachedImage, setAttachedImage] = useState(null);
  const isFOFTyping = useSelector(state => state.matching.isFOFTyping);
  const [userIsAlreadyTyping, setUserIsAlreadyTyping] = useState(null);

  useEffect(() => {
    if (FOF === null) {
      dispatch(configureAnonymousChatRoom());
    } else {
      dispatch(startListeningForAnonymousChatRoom());
    }
  }, [FOF]);

  const onSend = (newMessages = []) => {
    // setMessages((previousState) => GiftedChat.append(previousState, messages));
    dispatch(sendMessageInAnonymousChatRoom(newMessages));
    setAttachedImage(false);
    setReplying(false);
  };
  if (FOF === null) {
    return (
      <View style={styles.expandedCenterView}>
        <AppText>Loading Chat Room</AppText>
      </View>
    );
  }

  return (
    <View style={{...styles.rootView, backgroundColor: 'white'}}>
      {/* Modal */}
      <ReactNativeModal
        isVisible={isModalVisible}
        backdropTransitionInTiming={0}
        backdropTransitionOutTiming={0}
        useNativeDriver={true}
        hasBackdrop={true}
        onBackdropPress={() => {
          setIsModalVisible(false);
        }}
        onBackButtonPress={() => {
          setIsModalVisible(false);
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
          }}>
          <TouchableOpacity
            style={{margin: scale(20)}}
            onPress={() => {
              setUserLikes(prev => !prev);
              if (matchingStatus === 3) dispatch(changeUserMatchingStatus(2));
              else dispatch(changeUserMatchingStatus(3));
              setIsModalVisible(false);
            }}>
            <IconCircle
              style={{borderColor: 'white'}}
              label={userLikes ? 'Unlike' : 'Like'}
              labelStyle={{color: 'white'}}
              solid={userLikes}
              iconColor={userLikes ? 'red' : colors.primary}
              iconName="heart"
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              dispatch(skipThisFOF());
              dispatch(changeUserMatchingStatus(1));
            }}
            style={{margin: scale(20)}}>
            <IconCircle
              style={{borderColor: 'white'}}
              label={'Skip'}
              labelStyle={{color: 'white'}}
              iconName="forward"
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: '100%',
            margin: scale(20),
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              dispatch(changeUserMatchingStatus(0));
            }}>
            <IconCircle
              style={{borderColor: 'white', backgroundColor: 'black'}}
              label={'Skip & Turn Matching Off'}
              labelStyle={{color: 'white'}}
              iconColor="white"
              iconName="power-off"
            />
          </TouchableOpacity>
        </View>
      </ReactNativeModal>

      {/* CueCards Modal */}
      <ReactNativeModal
        isVisible={areCueCardsVisible}
        style={{margin: 0}}
        backdropTransitionInTiming={0}
        backdropTransitionOutTiming={0}
        useNativeDriver={true}
        onBackdropPress={() => {
          setAreCueCardsVisible(false);
        }}
        onBackButtonPress={() => {
          setAreCueCardsVisible(false);
        }}>
        <CueCardsScreen
          FOFMode={true}
          onPressX={() => {
            setAreCueCardsVisible(false);
          }}
        />
      </ReactNativeModal>

      {/* Header */}
      <AnonymousChatHeader
        viaFriend={viaFriend}
        FOF={FOF}
        online={isFOFOnline}
        onPressCards={() => {
          Keyboard.dismiss();
          setAreCueCardsVisible(true);
        }}
        onPressEllipsis={() => {
          setIsModalVisible(true);
        }}
        onPressX={() => {
          Keyboard.dismiss();
          dispatch(skipThisFOF());
          dispatch(changeUserMatchingStatus(1));
        }}
        {...props}
      />

      {/* Chat Screen */}
      <GiftedChat
        messages={messages}
        onSend={newMessages => {
          if (attachedImage) newMessages[0].image = attachedImage.uri;
          onSend(newMessages);
        }}
        renderAvatar={null}
        isTyping={isFOFTyping}
        scrollToBottom
        textInputProps={{
          onBlur: () => {
            setUserIsTyping(FOF.id, false);
            setUserIsAlreadyTyping(false);
          },
        }}
        onInputTextChanged={text => {
          if (!text || text === '') {
            setUserIsTyping(FOF.id, false);
            setUserIsAlreadyTyping(false);
            return;
          }
          if (userIsAlreadyTyping) return;

          setUserIsTyping(FOF.id, true);
          setUserIsAlreadyTyping(true);
        }}
        renderBubble={props => <Bubble {...props}></Bubble>}
        renderChatFooter={() => {
          return (
            <View>
              {replying ? (
                <ReplyChatFooter
                  onDismiss={() => {
                    setReplying(false);
                  }}
                />
              ) : null}
              {attachedImage ? (
                <ImageChatFooter
                  text={
                    attachedImage.uri.substring(0, 30) +
                    '...' +
                    attachedImage.extension
                  }
                  onDismiss={() => {
                    setAttachedImage(null);
                  }}
                />
              ) : null}
            </View>
          );
        }}
        user={{
          _id: auth().currentUser.uid,
          name: 'Shaurya',
        }}
        user={{
          _id: auth().currentUser.uid,
        }}
        renderComposer={props => <CustomComposer {...props} />}
        renderActions={props => (
          <Actions
            {...props}
            iconTextStyle={{color: 'white'}}
            wrapperStyle={{borderColor: 'white'}}
            options={{
              'Send Image': props => {
                launchImageLibrary(
                  {mediaType: 'photo', quality: 1},
                  response => {
                    if (response.didCancel) return;
                    const pickedImage = {
                      uri: response.uri,
                      extension: response.type,
                    };
                    setAttachedImage(pickedImage);
                  },
                );
              },
              Cancel: () => {},
            }}></Actions>
        )}
        renderSend={props => <CustomSend {...props} iconColor="blue" />}
        renderInputToolbar={props => (
          <InputToolbar
            {...props}
            containerStyle={{
              backgroundColor: '#0078ff',
              borderTopColor: 'black',
              marginTop: 0,
              overflow: 'hidden',
            }}
          />
        )}
      />
    </View>
  );
};

export default AnonymousChatScreen;
