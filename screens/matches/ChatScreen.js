import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  PermissionsAndroid,
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
  MessageImage,
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
import {setErrorMessage} from '../../store/actions/error';

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

  const customOnSend = (newMessages = []) => {
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
        backButtonClose={true}
        coverScreen={true}
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
            customOnSend(newMessages);
          }}
          lightboxProps={{springConfig: {tension: 900000, friction: 90000}}}
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
                    imageUri={attachedImage.uri}
                    text={
                      attachedImage.uri.substring(0, 20) +
                      '...' +
                      attachedImage.extension
                    }
                    onDismiss={() => {
                      setAttachedImage(null);
                    }}
                  />
                ) : (
                  <View style={{height: verticalScale(5)}} />
                )}
              </View>
            );
          }}
          user={{
            _id: auth().currentUser.uid,
          }}
          renderComposer={props => <CustomComposer {...props} />}
          renderActions={props => (
            <Actions
              {...props}
              icon={() => (
                <View
                  style={{alignSelf: 'center', flex: 1, ...styles.centerView}}>
                  <FontAwesome5Icon
                    name="plus-circle"
                    size={scale(20)}
                    color="grey"
                  />
                </View>
              )}
              // iconTextStyle={{color: '#cccccc'}}
              // wrapperStyle={{borderColor: '#cccccc'}}
              options={{
                'Send Image': async props => {
                  const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                  );
                  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    launchImageLibrary(
                      {mediaType: 'photo', quality: 0.8},
                      response => {
                        if (response.didCancel) return;
                        if (response.fileSize / 1048576 > 10) {
                          dispatch(
                            setErrorMessage({
                              message: 'Max file size for upload is 10 MB',
                            }),
                          );
                          return;
                        }
                        const pickedImage = {
                          uri: response.uri,
                          extension: response.type,
                        };
                        setAttachedImage(pickedImage);
                      },
                    );
                  }
                },
                Cancel: () => {},
              }}
            />
          )}
          renderSend={({onSend, text, sendButtonProps, ...props}) => (
            <CustomSend
              {...props}
              iconColor={colors.primary}
              sendButtonProps={{
                ...sendButtonProps,
                onPress: () => {
                  if (onSend) {
                    onSend({text: text ? text.trim() : ''}, true);
                  }
                },
              }}
              onSend={onSend}
              text={text}
            />
          )}
          imageStyle={{
            alignSelf: 'center',
            resizeMode: 'cover',
            width: '95%',
            minWidth: scale(150),
          }}
          renderInputToolbar={props => (
            <InputToolbar
              {...props}
              containerStyle={{
                backgroundColor: 'white',
                marginTop: 0,
                paddingTop: scale(5),
                paddingBottom: scale(5),
                overflow: 'hidden',
                borderTopWidth: 0,
              }}
            />
          )}
        />
      </CustomSafeAreaView>
    </View>
  );
};

export default ChatScreen;
