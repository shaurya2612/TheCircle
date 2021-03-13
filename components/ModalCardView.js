import React from 'react'
import { View } from 'react-native';
import styles from '../styles';

export const ModalCardView = (props) => {
    return (
        <View style={{...styles.modalCardView, ...props.style}}>
            {props.children}
        </View>
    )
}

export default ModalCardView;