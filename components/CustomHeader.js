import React from 'react'
import { View } from 'react-native';
import styles from '../styles';

const CustomHeader = (props) => (
    <View style={{...styles.headerView, ...props.style}}>
        {props.children}
    </View>
);

export default CustomHeader;