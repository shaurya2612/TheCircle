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
  const [verificationState, setVerificationState] = useState(null);
  const [correctCode, setCorrectCode] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const textInputRef1 = useRef();
  const textInputRef2 = useRef();
  const textInputRef3 = useRef();
  const textInputRef4 = useRef();
  const textInputRef5 = useRef();
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

  const listenForVerificationState = async () => {
    let confirm = await auth()
      .verifyPhoneNumber('+91' + phoneNumber)
      .on('state_changed', phoneAuthSnapshot => {
        if (phoneAuthSnapshot.state === 'error') {
          dispatch(setErrorMessage(phoneAuthSnapshot.error.message));
          props.navigation.navigate('PhoneAuthScreen');
        }
        setVerificationState(phoneAuthSnapshot.state);
      });
    setCorrectCode(confirm.code);
  };

  const confirmCode = () => {
    try {
      const verificationCodeString =
        Object.values(verificationCode).join('').length !== 6;
      if (verificationCodeString === correctCode) return true;
      else return false;
    } catch (error) {
      dispatch(setErrorMessage('Invalid code.'));
    }
  };

  useEffect(() => {
    listenForVerificationState();
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
            onPress={() => {
              Keyboard.dismiss();
              const isCorrectCode = confirmCode();
              if (isCorrectCode) props.navigation.navigate('SignupNameScreen');
              else dispatch()              
            }}
          />
        </View>
        <Spacer height={80} />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default PhoneVerificationScreen;
