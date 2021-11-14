import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import AppText from '../../../../components/AppText';
import gstyles from '../../../../styles';
import styles from './styles';
import Octicons from 'react-native-vector-icons/Octicons';
import {acceptRequest, declineRequest} from '../../../../firebase/util';
import {scale} from 'react-native-size-matters';
import SimpleToast from 'react-native-simple-toast';

const ButtonContainer = ({uid, ...props}) => {
  return (
    <View style={[gstyles.centerView, styles.buttonContainer]}>
      <TouchableOpacity
        style={[styles.button, gstyles.centerView, styles.accept]}
        activeOpacity={0.5}
        onPress={async () => {
          try {
            await acceptRequest(uid);
          } catch (error) {
            console.error(error);
            SimpleToast.show('An error occurred, please try again');
          }
        }}>
        <Text numberOfLines={1} style={styles.acceptText}>
          Accept
        </Text>
      </TouchableOpacity>

      <View style={{width: scale(10)}} />

      <TouchableOpacity
        style={[styles.button, gstyles.centerView, styles.pending]}
        activeOpacity={0.5}
        onPress={async () => {
          try {
            await declineRequest(uid);
          } catch (error) {
            console.error(error);
            SimpleToast.show('An error occurred, please try again');
          }
        }}>
        <Text numberOfLines={1} style={styles.pendingText}>
          Decline
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ButtonContainer;
