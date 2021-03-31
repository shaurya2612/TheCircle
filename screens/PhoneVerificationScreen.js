import React from 'react';
import {Text, View} from 'react-native';
import CustomSafeAreaView from '../components/CustomSafeAreaView';
import styles from '../styles';

export const PhoneVerificationScreen = () => {
  return (
    <View style={styles.rootView}>
      <CustomSafeAreaView style={styles.expandedCenterView}>
        <Text>Phone verification screen</Text>
      </CustomSafeAreaView>
    </View>
  );
};
