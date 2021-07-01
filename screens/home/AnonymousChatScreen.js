import React, {useEffect, useState} from 'react';
import {
  Keyboard,
  Text,
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
  paginateMessagesInAnonymousChatRoomQuery,
  sendMessageInAnonymousChatRoom,
  skipThisFOF,
  startListeningForAnonymousChatRoom,
} from '../../store/actions/matching';
import AppText from '../../components/AppText';
import ReactNativeModal from 'react-native-modal';
import IconCircle from '../../components/IconCircle';
import colors from '../../constants/colors';
import {scale, verticalScale} from 'react-native-size-matters';
import Modal from 'react-native-modalbox';
import CueCardsScreen from '../CueCardsScreen';
import {setUserIsTyping} from '../../firebase/utils';
import auth from '@react-native-firebase/auth';
import {launchImageLibrary} from 'react-native-image-picker';
import ImageChatFooter from '../../components/chat/ImageChatFooter';
import LinearGradient from 'react-native-linear-gradient';
import TheCircleLoading from '../../components/svgs/TheCircleLoading';
import {setErrorMessage} from '../../store/actions/error';
import MatchProfileScreen from '../matches/MatchProfileScreen';
import {setItsAMatchModalVisible} from '../../store/actions/loading';

const AnonymousChatScreen = props => {
  const matchingState = useSelector(state => state.matching);
  const {via, messages, matchingStatus, canLoadEarlierMessages} = matchingState;
  const FOF = useSelector(state => state.matching.FOF);
  const dispatch = useDispatch();
  const [isActionsModalVisible, setIsActionsModalVisible] = useState(false);
  const [isFOFProfileModalVisible, setIsFOFProfileModalVisible] = useState(
    false,
  );
  const [areCueCardsVisible, setAreCueCardsVisible] = useState(false);
  const [userLikes, setUserLikes] = useState(matchingStatus === 3);
  const isFOFOnline = useSelector(state => state.matching.isFOFOnline);
  const [replying, setReplying] = useState(false); //Render chat list footer and reply property in new message accordingly
  const [attachedImage, setAttachedImage] = useState(null);
  const isFOFTyping = useSelector(state => state.matching.isFOFTyping);
  const listeningForAnonymousChatRoom = useSelector(
    state => state.matching.listeningForAnonymousChatRoom,
  );
  const [userIsAlreadyTyping, setUserIsAlreadyTyping] = useState(null);
  useEffect(() => {
    console.warn('Ran useEffect', FOF);
    if (FOF === null) {
      dispatch(configureAnonymousChatRoom());
    } else {
      console.warn(
        'listeningForAnonymousChatRoom',
        listeningForAnonymousChatRoom,
      );
      if (!listeningForAnonymousChatRoom) {
        dispatch(paginateMessagesInAnonymousChatRoomQuery());
        dispatch(startListeningForAnonymousChatRoom());
      }
    }
  }, [FOF]);

  useEffect(() => {
    return () => {
      setIsActionsModalVisible(false);
      setAreCueCardsVisible(false);
      setIsFOFProfileModalVisible(false);
      setItsAMatchModalVisible(false);
    };
  }, []);

  const customOnSend = (newMessages = []) => {
    // setMessages((previousState) => GiftedChat.append(previousState, messages));
    dispatch(sendMessageInAnonymousChatRoom(newMessages));
    setAttachedImage(false);
    setReplying(false);
  };
  if (FOF === null) {
    return (
      <LinearGradient
        colors={[colors.primary, colors.accent]}
        style={styles.expandedCenterView}>
        <TheCircleLoading />
        <AppText style={{color: 'white', textAlign: 'center'}}>
          {'Loading Chat Room...'}
        </AppText>
      </LinearGradient>
    );
  }

  return (
    <View style={{...styles.rootView, backgroundColor: 'white'}}>
      {/* Modal */}
      <ReactNativeModal
        isVisible={isActionsModalVisible}
        backdropTransitionInTiming={0}
        backdropTransitionOutTiming={0}
        useNativeDriver={true}
        hasBackdrop={true}
        onBackdropPress={() => {
          setIsActionsModalVisible(false);
        }}
        onBackButtonPress={() => {
          setIsActionsModalVisible(false);
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
              setIsActionsModalVisible(false);
            }}>
            <IconCircle
              style={{borderColor: 'white'}}
              label={userLikes ? 'Unlike' : 'Like'}
              labelStyle={{color: 'white'}}
              solid={userLikes}
              iconColor={userLikes ? 'red' : 'black'}
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
              iconColor={'black'}
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

      {/* Profile Modal */}
      <Modal
        style={{margin: 0, elevation: 5}}
        swipeToClose={true}
        swipeArea={verticalScale(25)} // The height in pixels of the swipeable area, window height by default
        swipeThreshold={0} // The threshold to reach in pixels to close the modal
        onClosed={() => {
          setIsFOFProfileModalVisible(false);
        }}
        backButtonClose={true}
        isOpen={isFOFProfileModalVisible}
        onOpened={() => {
          Keyboard.dismiss();
        }}
        coverScreen={true}
        backdropOpacity={0}>
        <MatchProfileScreen
          matchId={FOF?.id}
          onPressX={() => {
            setIsFOFProfileModalVisible(false);
          }}
        />
      </Modal>

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
        via={via}
        FOF={FOF}
        online={isFOFOnline}
        onPressName={
          via.type === 'stream'
            ? () => {
                setIsFOFProfileModalVisible(true);
              }
            : null
        }
        onPressCards={() => {
          Keyboard.dismiss();
          setAreCueCardsVisible(true);
        }}
        onPressEllipsis={() => {
          setIsActionsModalVisible(true);
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
          customOnSend(newMessages);
        }}
        lightboxProps={{springConfig: {tension: 900000, friction: 90000}}}
        alwaysShowSend={attachedImage ? true : false}
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
        loadEarlier={canLoadEarlierMessages}
        onLoadEarlier={() => {
          dispatch(paginateMessagesInAnonymousChatRoomQuery());
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
          name: 'Shaurya',
        }}
        user={{
          _id: auth().currentUser.uid,
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
                  {mediaType: 'photo', quality: 0.8},
                  response => {
                    if (response.didCancel) return;
                    if (response.fileSize / 1048576 > 10) {
                      dispatch(
                        setErrorMessage('Max file size for upload is 10 MB'),
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
              },
              Cancel: () => {},
            }}></Actions>
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
              paddingTop: scale(2),
              paddingBottom: scale(5),
              overflow: 'hidden',
              borderTopWidth: 0,
            }}
          />
        )}
      />
    </View>
  );
};

export default AnonymousChatScreen;
