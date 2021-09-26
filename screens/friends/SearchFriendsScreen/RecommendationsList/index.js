import React from 'react';
import {View} from 'react-native';
import {scale} from 'react-native-size-matters';
import AppText from '../../../../components/AppText';
import styles from '../../../../styles';

const RecommendationsList = () => {
  return (
    <View style={[styles.rootView, {paddingHorizontal: scale(10)}]}>
      <AppText>Suggested</AppText>
    </View>
  );
};

export default RecommendationsList;
