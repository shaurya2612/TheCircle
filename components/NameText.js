import React from 'react';
import {Text} from 'react-native';
import styles from '../styles';

export const NameText = props => {
  return (
    <Text {...props} style={{...styles.nameText, ...props.style}}>
      {props.children}
    </Text>
  );
};

export default NameText;
