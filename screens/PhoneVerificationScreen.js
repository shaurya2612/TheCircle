import React, {useEffect, useRef, useState} from 'react';
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
  const textInputRef1 = useRef();
  const textInputRef2 = useRef();
  const textInputRef3 = useRef();
  const textInputRef4 = useRef();
  const textInputRef5 = useRef();
  const [confirm, setConfirm] = useState(null);
  const [verificationCode, setVerificationCode] = useState({
    0: null,
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
  });
  const {phoneNumber} = useSelector(state => state.signupForm);
  const dispatch = useDispatch();

  async function signInWithPhoneNumber() {
    try {
      const confirmation = await auth().signInWithPhoneNumber(
        '+91' + phoneNumber,
      );
      setConfirm(confirmation);
    } catch (err) {
      dispatch(setErrorMessage(err.message));
    }
  }

  async function confirmCode() {
    try {
      await confirm.confirm(code);
    } catch (error) {
      dispatch(setErrorMessage(error.message));
    }
  }

  useEffect(() => {
    signInWithPhoneNumber();
  }, []);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
      style={styles.rootView}>
      <SafeAreaView
        style={{...styles.rootView, backgroundColor: colors.primary}}>
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
              maxLength={1}
              onChangeText={text => {
                setVerificationCode({...verificationCode, 0: text});
                if (text.length === 1) {
                  textInputRef1.current.focus();
                }
              }}
            />
            <TextInput
              ref={textInputRef1}
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
              maxLength={1}
              onChangeText={text => {
                setVerificationCode({...verificationCode, 1: text});
                if (text.length === 1) {
                  textInputRef2.current.focus();
                }
              }}
            />
            <TextInput
              ref={textInputRef2}
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
              maxLength={1}
              onChangeText={text => {
                setVerificationCode({...verificationCode, 2: text});
                if (text.length === 1) {
                  textInputRef3.current.focus();
                }
              }}
            />
            <TextInput
              ref={textInputRef3}
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
              maxLength={1}
              onChangeText={text => {
                setVerificationCode({...verificationCode, 3: text});
                if (text.length === 1) {
                  textInputRef4.current.focus();
                }
              }}
            />
            <TextInput
              ref={textInputRef4}
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
              maxLength={1}
              onChangeText={text => {
                setVerificationCode({...verificationCode, 4: text});
                if (text.length === 1) {
                  textInputRef5.current.focus();
                }
              }}
            />
            <TextInput
              ref={textInputRef5}
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
              maxLength={1}
              onChangeText={text => {
                setVerificationCode({...verificationCode, 5: text});
              }}
            />
          </View>
        </View>

        <View style={styles.formButtonView}>
          <FormButton
            disabled={Object.values(verificationCode).join('').length !== 6}
            title={'Continue'}
            onPress={async () => {
              Keyboard.dismiss();
              await confirmCode();
            }}
          />
        </View>
        <Spacer height={80} />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default PhoneVerificationScreen;
