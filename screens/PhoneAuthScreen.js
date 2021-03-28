import React, {useEffect, useState} from 'react';
import {
  Button,
  Keyboard,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import {useDispatch, useSelector} from 'react-redux';
import AppText from '../components/AppText';
import CountryCodeInput from '../components/CountryCodeInput';
import CustomHeader from '../components/CustomHeader';
import FormButton from '../components/FormButton';
import FormTextInput from '../components/FormTextInput';
import ProgressLine from '../components/ProgressLine';
import Spacer from '../components/Spacer';
import colors from '../constants/colors';
import {
  clearSignupFormData,
  setSignupFormData,
} from '../store/actions/signupForm';
import styles from '../styles';

const PhoneAuthScreen = props => {
  const signupFormData = useSelector(state => state.signupForm);
  const {phoneNumber} = signupFormData;
  const dispatch = useDispatch();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const phoneNumberValidator = phoneNum => {
    let rjx = /^[0-9]{10}$/;
    let isValid = rjx.test(phoneNum);
    return isValid;
  };

  useEffect(() => {
    if (phoneNumber === '' || !phoneNumber) {
      setIsButtonDisabled(true);
      return;
    }
    setIsButtonDisabled(!phoneNumberValidator(phoneNumber.trim()));
  }, [phoneNumber]);

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
        <CustomHeader>
          <Icon
            name={'x'}
            size={35}
            color={'white'}
            onPress={() => {
              dispatch(clearSignupFormData());
              props.navigation.goBack();
            }}
          />
        </CustomHeader>
        <View style={styles.expandedCenterView}>
          <View style={styles.titleView}>
            <AppText style={{...styles.titleText, color: 'white'}}>
              Enter your phone number
            </AppText>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: scale(70),
            }}>
            <CountryCodeInput />
            <FormTextInput
              placeholder={'Phone Number'}
              selectedBorderColor="white"
              style={{fontSize: moderateScale(20, 0.4), color: 'white'}}
              selectionColor={'white'}
              keyboardType={'number-pad'}
              onChangeText={text => {
                dispatch(
                  setSignupFormData({...signupFormData, phoneNumber: text}),
                );
              }}
              maxLength={10}
            />
          </View>
        </View>

        <View style={styles.formButtonView}>
          <FormButton
            disabled={isButtonDisabled}
            title={'Continue'}
            onPress={() => {
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

export default PhoneAuthScreen;
