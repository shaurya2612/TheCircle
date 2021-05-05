import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Keyboard,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  GiftedChat,
  Composer,
  Send,
  InputToolbar,
  Actions,
  Bubble,
} from 'react-native-gifted-chat';
import CustomHeader from '../../components/CustomHeader';
import CustomSafeAreaView from '../../components/CustomSafeAreaView';
import Icon from 'react-native-vector-icons/Feather';
import StackHeader from '../../components/StackHeader';
import styles from '../../styles';
import {scale, verticalScale} from 'react-native-size-matters';
import AvatarCircle from '../../components/AvatarCircle';
import AppText from '../../components/AppText';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Modal from 'react-native-modalbox';
import UserProfileScreen from '../user/UserProfileScreen';
import IconCircle from '../../components/IconCircle';
import FormTextInput from '../../components/FormTextInput';
import ReplyChatFooter from '../../components/chat/ReplyChatFooter';
import CustomComposer from '../../components/chat/CustomComposer';
import CustomSend from '../../components/chat/CustomSend';
import MatchChatHeader from '../../components/chat/MatchChatHeader';
import colors from '../../constants/colors';
import {useDispatch, useSelector} from 'react-redux';
import {
  CLEAR_CHAT_STATE,
  paginateMessagesQuery,
  removeUnseenMessages,
  sendMessageToMatch,
  startListeningForChat,
  stopListeningForChat,
} from '../../store/actions/chat';
import MatchProfileScreen from './MatchProfileScreen';
import CueCardsScreen from '../CueCardsScreen';
import ReactNativeModal from 'react-native-modal';
import {setUserIsTyping} from '../../firebase/utils';
import auth from '@react-native-firebase/auth';
import ImageChatFooter from '../../components/chat/ImageChatFooter';
import {launchImageLibrary} from 'react-native-image-picker';

const ChatScreen = props => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const chatState = useSelector(state => state.chat);
  const {messages, listeningForChat, match, canLoadEarlierMessages} = chatState;
  const [areCueCardsVisible, setAreCueCardsVisible] = useState(false);
  const dispatch = useDispatch();
  const [replying, setReplying] = useState(false); //Render chat list footer and reply property in new message accordingly
  const [attachedImage, setAttachedImage] = useState(null);
  const isMatchOnline = useSelector(state => state.chat.isMatchOnline);
  const isMatchTyping = useSelector(state => state.chat.isMatchTyping);
  const [userIsAlreadyTyping, setUserIsAlreadyTyping] = useState(null);

  useEffect(() => {
    if (!listeningForChat) {
      dispatch(paginateMessagesQuery());
      dispatch(startListeningForChat());
      dispatch(removeUnseenMessages());
    }
    return () => {
      dispatch(stopListeningForChat());
      dispatch({type: CLEAR_CHAT_STATE});
    };
  }, []);

  const onSend = (newMessages = []) => {
    // setMessages((previousState) => GiftedChat.append(previousState, messages));
    dispatch(sendMessageToMatch(newMessages));
    setAttachedImage(false);
    setReplying(false);
  };

  if (!listeningForChat || !match)
    return (
      <View style={{...styles.expandedCenterView, backgroundColor: 'white'}}>
        <ActivityIndicator color={colors.primary} size={'large'} />
      </View>
    );

  return (
    <View style={styles.rootView}>
      {/* Profile Modal */}
      <Modal
        style={{margin: 0, elevation: 5}}
        swipeToClose={true}
        swipeArea={verticalScale(25)} // The height in pixels of the swipeable area, window height by default
        swipeThreshold={0} // The threshold to reach in pixels to close the modal
        isOpen={isModalVisible}
        onClosed={() => {
          setIsModalVisible(false);
        }}
        onOpened={() => {
          Keyboard.dismiss();
        }}
        backdropOpacity={0}
        isVisible={isModalVisible}>
        <MatchProfileScreen
          matchId={match.id}
          onPressX={() => {
            setIsModalVisible(false);
          }}
        />
      </Modal>

      {/* Cue cards modal */}
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
          matchMode={true}
          onPressX={() => {
            setAreCueCardsVisible(false);
          }}
        />
      </ReactNativeModal>

      <CustomSafeAreaView
        style={{...styles.rootView, backgroundColor: 'white'}}>
        {/* Header */}
        <MatchChatHeader
          online={isMatchOnline}
          onPressCueCards={() => {
            setAreCueCardsVisible(true);
          }}
          onPressName={() => {
            setIsModalVisible(true);
          }}
          {...props}
        />

        {/* Chat Screen */}
        <GiftedChat
          messages={messages}
          renderAvatar={null}
          onSend={newMessages => {
            if (attachedImage) newMessages[0].image = attachedImage.uri;
            onSend(newMessages);
          }}
          alwaysShowSend={attachedImage ? true : false}
          isTyping={isMatchTyping}
          scrollToBottom
          textInputProps={{
            onBlur: () => {
              setUserIsTyping(match.id, false);
              setUserIsAlreadyTyping(false);
            },
          }}
          onInputTextChanged={text => {
            if (!text || text === '') {
              setUserIsTyping(match.id, false);
              setUserIsAlreadyTyping(false);
              return;
            }
            if (userIsAlreadyTyping) return;

            setUserIsTyping(match.id, true);
            setUserIsAlreadyTyping(true);
          }}
          renderBubble={props => (
            <Bubble
              wrapperStyle={{
                right: {
                  backgroundColor: colors.primary,
                },
              }}
              {...props}></Bubble>
          )}
          loadEarlier={canLoadEarlierMessages}
          onLoadEarlier={() => {
            dispatch(paginateMessagesQuery());
          }}
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
          renderComposer={props => <CustomComposer {...props} />}
          renderActions={props => (
            <Actions
              {...props}
              iconTextStyle={{color: '#cccccc'}}
              wrapperStyle={{borderColor: '#cccccc'}}
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
          renderSend={props => (
            <CustomSend {...props} iconColor={colors.primary} />
          )}
          renderInputToolbar={props => (
            <InputToolbar
              {...props}
              containerStyle={{
                backgroundColor: 'white',
                // borderTopColor: 'black',
                marginTop: 0,
                paddingTop: scale(2),
                paddingBottom: scale(5),
                overflow: 'hidden',
              }}
            />
          )}
        />
      </CustomSafeAreaView>
    </View>
  );
};

export default ChatScreen;
