import React from 'react';
import {Text, View} from 'react-native';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import colors from '../constants/colors';
import styles from '../styles';

const CountryCodeInput = () => (
  <TouchableHighlight style={styles.countryCodeInputView}>
    <Text style={{fontSize: verticalScale(20), color: colors.primary}}>
      IN +91
    </Text>
  </TouchableHighlight>
);

export default CountryCodeInput;
