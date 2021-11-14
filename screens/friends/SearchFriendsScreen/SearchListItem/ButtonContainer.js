import React, {useCallback, useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import styles from './styles';
import FormButton from '../../../../components/FormButton';
import gstyles from '../../../../styles';
import {scale, verticalScale} from 'react-native-size-matters';
import colors from '../../../../constants/colors';
import AppText from '../../../../components/AppText';
import Octicons from 'react-native-vector-icons/Octicons';
import Feather from 'react-native-vector-icons/Feather';
import functions from '@react-native-firebase/functions';
import auth from '@react-native-firebase/auth';
import {
  acceptRequest,
  declineRequest,
  relations,
  sendFCM,
  sendFriendRequest,
} from '../../../../firebase/util';
import {useDispatch, useSelector} from 'react-redux';
import SimpleToast from 'react-native-simple-toast';
import {ActionsModal} from '../../../../components/ActionsModal';
import {setRelation} from '../../../../store/actions/user';

const ButtonContainer = ({uid, ...props}) => {
  let status = useSelector(
    state => state.recommendations.facebook.byIds?.[uid]?.status,
  );
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(false);

  const addFriendHandler = useCallback(async () => {
    console.warn('huh');
    const oldStatus = status;
    dispatch(setRelation(uid, relations.USER_SENT_REQUEST));
    try {
      await sendFriendRequest(uid);
    } catch (err) {
      dispatch(setRelation(uid, oldStatus));
      SimpleToast.show('An error occured, please try again later');
      console.error(err);
    }
  }, []);

  const renderButtons = useCallback(() => {
    switch (status) {
      case relations.NONE:
        return (
          <TouchableOpacity
            style={[styles.button, gstyles.centerView, styles.addFriend]}
            activeOpacity={0.5}
            onPress={addFriendHandler}>
            <Text numberOfLines={1} style={styles.addFriendText}>
              Add friend <Octicons name="plus" />
            </Text>
          </TouchableOpacity>
        );

      case relations.USER_SENT_REQUEST:
        return (
          <TouchableOpacity
            style={[styles.button, gstyles.centerView, styles.pending]}
            activeOpacity={1}
            onPress={() => {}}>
            <Text numberOfLines={1} style={styles.pendingText}>
              Pending <Octicons name="clock" />
            </Text>
          </TouchableOpacity>
        );

      case relations.USER_RECEIVED_REQUEST:
        return (
          <TouchableOpacity
            style={[styles.button, gstyles.centerView, styles.respond]}
            activeOpacity={0.5}
            onPress={() => {
              setIsVisible(true);
            }}>
            <Text numberOfLines={1} style={styles.respondText}>
              Respond <Octicons name="chevron-right" />
            </Text>
          </TouchableOpacity>
        );

      case relations.FRIENDS:
        console.warn('friend button render');
        return (
          <TouchableOpacity
            style={[styles.button, gstyles.centerView, styles.friends]}
            activeOpacity={1}
            onPress={() => {}}>
            <Text numberOfLines={1} style={styles.friendsText}>
              Friends
            </Text>
          </TouchableOpacity>
        );

      default:
        return null;
    }
  }, [status]);

  return (
    <View style={[gstyles.centerView, styles.buttonContainer]}>
      {renderButtons()}
      <ActionsModal
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        data={[
          {
            icon: <Feather size={scale(22)} name="user-plus" />,
            title: 'Accept',
            onPress: async () => {
              setIsVisible(false);
              try {
                var oldStatus = status;
                dispatch(setRelation(uid, relations.FRIENDS));
                await acceptRequest(uid);
              } catch (error) {
                dispatch(setRelation(uid, oldStatus));
                SimpleToast.show('An error occurred, please try again');
                console.error(error);
              }
            },
          },
          {
            icon: <Feather size={scale(22)} name="user-x" />,
            title: 'Decline',
            onPress: async () => {
              setIsVisible(false);
              try {
                var oldStatus = status;
                dispatch(setRelation(uid, relations.NONE));
                await declineRequest(uid);
              } catch (error) {
                dispatch(setRelation(uid, oldStatus));
                SimpleToast.show('An error occurred, please try again');
                console.error(error);
              }
            },
          },
        ]}
      />
    </View>
  );
};

export default ButtonContainer;
