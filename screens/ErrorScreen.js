import React from 'react';
import {View} from 'react-native';
import {verticalScale} from 'react-native-size-matters';
import {useDispatch, useSelector} from 'react-redux';
import AppText from '../components/AppText';
import FormButton from '../components/FormButton';
import ModalCardView from '../components/ModalCardView';
import NameText from '../components/NameText';
import {clearErrorMessage} from '../store/actions/error';
import styles from '../styles';

const ErrorScreen = () => {
  const {errorMessage, showErrorHeading} = useSelector(state => state.error);
  const dispatch = useDispatch();
  return (
    <View style={styles.expandedCenterView}>
      <ModalCardView
        style={{justifyContent: 'center', alignItems: 'center', width: '70%'}}>
        {showErrorHeading ? (
          <AppText style={styles.titleText}>Error</AppText>
        ) : null}
        <View style={{margin: verticalScale(20)}}>
          <NameText>{errorMessage}</NameText>
        </View>
        <FormButton
          title="Close"
          onPress={() => {
            dispatch(clearErrorMessage());
          }}
        />
      </ModalCardView>
    </View>
  );
};

export default ErrorScreen;
