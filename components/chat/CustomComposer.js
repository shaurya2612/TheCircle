import React from 'react';
import {Platform} from 'react-native';
import {Composer} from 'react-native-gifted-chat';
import {scale} from 'react-native-size-matters';
import styles from '../../styles';

const CustomComposer = props => {
  return (
    <Composer
      {...props}
      textInputStyle={{
        ...styles.chatComposerText,
        // elevation: 2,
        // borderWidth: Platform.OS === 'ios' ? 0.5 : 0,
        borderWidth: scale(0.5),
        borderColor: Platform.OS === 'android' ? '#cccccc' : 'grey',
        backgroundColor: 'white',
        borderRadius: scale(25),
        paddingHorizontal: scale(10),
        marginRight: scale(5),
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'scroll',
      }}></Composer>
  );
};

export default CustomComposer;
