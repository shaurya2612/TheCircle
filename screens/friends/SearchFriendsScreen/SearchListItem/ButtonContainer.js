import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import styles from './styles';
import FormButton from '../../../../components/FormButton';
import gstyles from '../../../../styles';
import {scale, verticalScale} from 'react-native-size-matters';
import colors from '../../../../constants/colors';
import AppText from '../../../../components/AppText';
import Octicons from 'react-native-vector-icons/Octicons';

const ButtonContainer = props => {
  return (
    <View style={[gstyles.centerView, styles.buttonContainer]}>
      <TouchableOpacity
        style={[
          styles.button,
          gstyles.centerView,
          {backgroundColor: colors.primary},
        ]}
        activeOpacity={0.5}>
        <Text style={styles.text}>
          Add friend <Octicons name="plus" />
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ButtonContainer;
