import React, {useCallback, useEffect} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import styles from './styles';
import FormButton from '../../../../components/FormButton';
import gstyles from '../../../../styles';
import {scale, verticalScale} from 'react-native-size-matters';
import colors from '../../../../constants/colors';
import AppText from '../../../../components/AppText';
import Octicons from 'react-native-vector-icons/Octicons';
import functions from '@react-native-firebase/functions';
import auth from '@react-native-firebase/auth';
import {relations, sendFCM, sendFriendRequest} from '../../../../firebase/util';
import {useDispatch, useSelector} from 'react-redux';
import {setRecommendationStatus} from '../../../../store/actions/recommendations';
import SimpleToast from 'react-native-simple-toast';

const ButtonContainer = ({uid, ...props}) => {
  let status = useSelector(
    state => state.recommendations.facebook.byIds?.[uid]?.status,
  );
  const dispatch = useDispatch();

  const addFriendHandler = useCallback(async () => {
    const oldStatus = status;
    dispatch(setRecommendationStatus(uid, relations.USER_SENT_REQUEST));
    try {
      await sendFriendRequest(uid);
    } catch (err) {
      dispatch(setRecommendationStatus(uid, oldStatus));
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
    }
  }, [status]);

  return (
    <View style={[gstyles.centerView, styles.buttonContainer]}>
      {renderButtons()}
    </View>
  );
};

export default ButtonContainer;
