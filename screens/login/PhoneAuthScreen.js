import React, {useEffect, useState} from 'react';
import {
  Button,
  Dimensions,
  ImageBackground,
  Keyboard,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import {useDispatch, useSelector} from 'react-redux';
import AppText from '../../components/AppText';
import CountryCodeInput from '../../components/CountryCodeInput';
import CustomHeader from '../../components/CustomHeader';
import FormButton from '../../components/FormButton';
import FormTextInput from '../../components/FormTextInput';
import Spacer from '../../components/Spacer';
import colors from '../../constants/colors';
import {
  clearSignupFormData,
  setSignupFormData,
} from '../../store/actions/signupForm';
import auth from '@react-native-firebase/auth';
import styles from '../../styles';
import CustomSafeAreaView from '../../components/CustomSafeAreaView';
import Svg, {Circle} from 'react-native-svg';
import * as Animatable from 'react-native-animatable';
import CocentricCircles from '../../components/svgs/CocentricCircles';

const PhoneAuthScreen = props => {
  const signupFormData = useSelector(state => state.signupForm);
  const {phoneNumber} = signupFormData;
  const dispatch = useDispatch();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

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

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
      style={styles.rootView}>
      <CustomSafeAreaView
        style={{...styles.rootView, backgroundColor: 'white'}}>
        <View style={{...styles.rootView, backgroundColor: 'white'}}>
          <CocentricCircles
            innerCircleColor={colors.primary}
            outerCircleColor={'pink'}
            animatableViewProps={{
              animation: 'pulse',
              iterationCount: 'infinite',
              iterationDelay: 2000,
              easing: 'ease-out',
              delay: 200,
              style: {
                position: 'absolute',
                left: '50%',
                top: isKeyboardVisible ? '-33%' : '-22%',
              },
            }}
          />
          <CustomHeader>
            <Icon
              name={'x'}
              size={35}
              color={'black'}
              onPress={() => {
                dispatch(clearSignupFormData());
                props.navigation.goBack();
              }}
            />
          </CustomHeader>
          <View style={styles.expandedCenterView}>
            <View style={styles.titleView}>
              <AppText style={{...styles.titleText, color: colors.primary}}>
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
                value={phoneNumber}
                selectedBorderColor={colors.primary}
                style={{
                  fontSize: verticalScale(20),
                  color: colors.primary,
                }}
                selectionColor={"#cccccc"}
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
              onPress={async () => {
                Keyboard.dismiss();
                props.navigation.navigate('PhoneVerificationScreen');
              }}
            />
          </View>
          <Spacer height={80} />
        </View>
      </CustomSafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default PhoneAuthScreen;
