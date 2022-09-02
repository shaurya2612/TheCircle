import React from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import {scale, verticalScale} from 'react-native-size-matters';
import Feather from 'react-native-vector-icons/Feather';
import gstyles from '../styles';
import AppText from './AppText';

//data : [{icon: <Icon/>, title: String, onPress: () => any}]
export const ActionsModal = ({data, isVisible, setIsVisible, ...props}) => {
  const renderItem = ({item}) => {
    return (
      <TouchableOpacity onPress={item.onPress} style={styles.itemContainer}>
        <View style={styles.iconContainer}>{item.icon}</View>
        <AppText style={styles.title}>{item.title}</AppText>
      </TouchableOpacity>
    );
  };
  return (
    <ReactNativeModal
      style={styles.modal}
      isVisible={isVisible}
      useNativeDriver={true}
      onBackdropPress={() => {
        setIsVisible(false);
      }}
      onBackButtonPress={() => {
        setIsVisible(false);
      }}>
      <View style={{backgroundColor: '#fff'}}>
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      </View>
    </ReactNativeModal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  itemContainer: {
    height: verticalScale(40),
    width: '100%',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
    flexDirection: 'row',
    paddingHorizontal: scale(30),
  },
  iconContainer: {
    paddingRight: scale(20),
  },
  title: {
    fontSize: scale(16),
  },
});
