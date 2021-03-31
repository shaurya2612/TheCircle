import React, {useEffect, useState} from 'react';
import {
  Keyboard,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import CustomSafeAreaView from '../components/CustomSafeAreaView';
import styles from '../styles';
import auth from '@react-native-firebase/auth';
import {useDispatch, useSelector} from 'react-redux';
import {setErrorMessage} from '../store/actions/error';
import StackHeader from '../components/StackHeader';
import colors from '../constants/colors';
import AppText from '../components/AppText';
import FormTextInput from '../components/FormTextInput';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import {SafeAreaView} from 'react-native-safe-area-context';
import ProgressLine from '../components/ProgressLine';
import FormButton from '../components/FormButton';
import Spacer from '../components/Spacer';

const PhoneVerificationScreen = props => {
  const [verificationState, setVerificationState] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const {phoneNumber} = useSelector(state => state.signupForm);
  const dispatch = useDispatch();

  const listenForVerificationState = async () => {
    let confirm = await auth()
      .verifyPhoneNumber('+91' + phoneNumber)
      .on('state_changed', phoneAuthSnapshot => {
        if (phoneAuthSnapshot.state === 'error') {
          dispatch(setErrorMessage(phoneAuthSnapshot.error.message));
        }
        setVerificationState(phoneAuthSnapshot.state);
      });
    setConfirm(confirm);
  };

  useEffect(() => {
    // listenForVerificationState();
  }, []);

  useEffect(() => {
    if (verificationState === 'verified')
      props.navigation.navigate('SignupNameScreen');
  }, [verificationState]);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
      style={styles.rootView}>
      <SafeAreaView
        style={{...styles.rootView, backgroundColor: colors.primary}}>
        <ProgressLine
          style={{
            width: '14.3%',
            backgroundColor: 'white',
            height: verticalScale(5),
          }}
        />
        <StackHeader backIconColor={'white'} navigation={props.navigation} />
        <View style={styles.expandedCenterView}>
          <View style={styles.titleView}>
            <AppText style={{color: 'white', fontSize: scale(20)}}>
              Enter the verification code sent to {`+91 ${phoneNumber}`}
            </AppText>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: scale(70),
              flex: 1,
            }}>
            <TextInput
              style={{
                ...styles.selectedFormTextInput,
                borderColor: 'white',
                fontSize: moderateScale(20, 0.4),
                color: 'white',
                width: '16.66%',
                textAlign: 'center',
              }}
              selectionColor={'white'}
              keyboardType={'number-pad'}
            />
            <TextInput
              style={{
                ...styles.selectedFormTextInput,
                borderColor: 'white',
                fontSize: moderateScale(20, 0.4),
                color: 'white',
                width: '16.66%',
                textAlign: 'center',
              }}
              selectionColor={'white'}
              keyboardType={'number-pad'}
            />
            <TextInput
              style={{
                ...styles.selectedFormTextInput,
                borderColor: 'white',
                fontSize: moderateScale(20, 0.4),
                color: 'white',
                width: '16.66%',
                textAlign: 'center',
              }}
              selectionColor={'white'}
              keyboardType={'number-pad'}
            />
            <TextInput
              style={{
                ...styles.selectedFormTextInput,
                borderColor: 'white',
                fontSize: moderateScale(20, 0.4),
                color: 'white',
                width: '16.66%',
                textAlign: 'center',
              }}
              selectionColor={'white'}
              keyboardType={'number-pad'}
            />
            <TextInput
              style={{
                ...styles.selectedFormTextInput,
                borderColor: 'white',
                fontSize: moderateScale(20, 0.4),
                color: 'white',
                width: '16.66%',
                textAlign: 'center',
              }}
              selectionColor={'white'}
              keyboardType={'number-pad'}
            />
            <TextInput
              style={{
                ...styles.selectedFormTextInput,
                borderColor: 'white',
                fontSize: moderateScale(20, 0.4),
                color: 'white',
                width: '16.66%',
                textAlign: 'center',
              }}
              selectionColor={'white'}
              keyboardType={'number-pad'}
            />
          </View>
        </View>

        <View style={styles.formButtonView}>
          <FormButton
            disabled={isButtonDisabled}
            title={'Continue'}
            onPress={async () => {
              Keyboard.dismiss();
              props.navigation.navigate('SignupNameScreen');
            }}
          />
        </View>
        <Spacer height={80} />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default PhoneVerificationScreen;
