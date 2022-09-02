import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {scale} from 'react-native-size-matters';
import NameText from './NameText';

const OptionView = ({onPress, title, style, fontStyle}) => {
  return (
    <TouchableOpacity onPress={onPress} style={{padding: scale(7), ...style}}>
      <NameText style={fontStyle}>{title}</NameText>
    </TouchableOpacity>
  );
};

export default OptionView;
