import React, {useEffect, useRef, useState} from 'react';
import {
  Keyboard,
  Platform,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import styles from '../../styles';
import StackHeader from '../../components/StackHeader';
import FormButton from '../../components/FormButton';
import FormTextInput from '../../components/FormTextInput';
import Spacer from '../../components/Spacer';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import AppText from '../../components/AppText';
import * as Animatable from 'react-native-animatable';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {setSignupFormData} from '../../store/actions/signupForm';
import ProgressLine from '../../components/ProgressLine';
import CustomSafeAreaView from '../../components/CustomSafeAreaView';
import colors from '../../constants/colors';
import CocentricCircles from '../../components/svgs/CocentricCircles';

const SignupAgeScreen = props => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isErrShown, setIsErrShown] = useState(false);
  const [errMessage, setErrMessage] = useState('');
  const signupFormData = useSelector(state => state.signupForm);
  const dd = signupFormData.birthDate.dd;
  const mm = signupFormData.birthDate.mm;
  const yyyy = signupFormData.birthDate.yyyy;
  const dispatch = useDispatch();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const monthTextInputRef = useRef();
  const yearTextInputRef = useRef();

  const [isDateTextInputFocused, setIsDateTextInputFocused] = useState(false);
  const [isMonthTextInputFocused, setIsMonthTextInputFocused] = useState(false);
  const [isYearTextInputFocused, setIsYearTextInputFocused] = useState(false);

  useEffect(() => {
    if (!yyyy || !dd || !mm) {
      setIsButtonDisabled(true);
      setIsErrShown(false);
      return;
    }

    if (yyyy.length < 4 || dd.length < 2 || mm.length < 2) {
      setIsButtonDisabled(true);
      setIsErrShown(false);
      return;
    }

    const birthDate = new Date(parseInt(yyyy), parseInt(mm) - 1, parseInt(dd));
    setIsButtonDisabled(!birthDateValidator(birthDate));
    setIsErrShown(!birthDateValidator(birthDate));
  }, [dd, mm, yyyy]);

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

  const numberValidator = text => {
    let rjx = /^[0-9]*$/;
    let isValid = rjx.test(text);
    return isValid;
  };

  const birthDateValidator = date => {
    if (parseInt(yyyy) < parseInt(new Date().getFullYear()) - 99) {
      setErrMessage('You must be 18-99 yrs old to proceed');
      return false;
    }

    if (
      date.getFullYear() !== parseInt(yyyy) ||
      date.getMonth() !== parseInt(mm) - 1 ||
      date.getDate() !== parseInt(dd)
    ) {
      setErrMessage('Please enter a valid date');
      return false;
    }

    var ageDifMs = Date.now() - date.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    const age = ageDate.getUTCFullYear() - 1970;
    if (age < 18) {
      if (age < 0) setErrMessage('Please enter a valid date');
      else setErrMessage('You must be 18-99 yrs old to proceed');
      return false;
    } else return true;
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
      style={styles.rootView}>
      <SafeAreaView style={{...styles.rootView, backgroundColor: 'white'}}>
        {/* <CocentricCircles
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
        /> */}
        <ProgressLine
          style={{
            width: '42.9%',
            backgroundColor: '#cccccc',
            height: verticalScale(5),
          }}
        />
        <StackHeader backIconColor={'black'} navigation={props.navigation} />
        <View style={styles.expandedCenterView}>
          <View style={styles.titleView}>
            <AppText style={{...styles.titleText, color: colors.primary}}>
              Enter your birth date
            </AppText>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: scale(10),
            }}>
            <View style={styles.expandedCenterView}>
              <TextInput
                placeholder="DD"
                textAlign={'center'}
                letterSpacing={scale(6)}
                maxLength={2}
                onFocus={() => {
                  setIsDateTextInputFocused(true);
                }}
                onBlur={() => {
                  setIsDateTextInputFocused(false);
                }}
                style={{
                  ...styles.selectedFormTextInput,
                  fontSize: moderateScale(20, 0.4),
                  color: colors.primary,
                  borderColor: isDateTextInputFocused
                    ? colors.primary
                    : '#cccccc',
                }}
                keyboardType="number-pad"
                value={dd}
                onChangeText={text => {
                  if (!numberValidator(text)) return;
                  dispatch(
                    setSignupFormData({
                      ...signupFormData,
                      birthDate: {...signupFormData.birthDate, dd: text},
                    }),
                  );
                  if (text.length == 2) monthTextInputRef.current.focus();
                }}
              />
            </View>

            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <AppText style={{...styles.titleText, color: colors.primary}}>
                /
              </AppText>
            </View>

            <View style={styles.expandedCenterView}>
              <TextInput
                ref={monthTextInputRef}
                placeholder="MM"
                textAlign={'center'}
                letterSpacing={scale(6)}
                onFocus={() => {
                  setIsMonthTextInputFocused(true);
                }}
                onBlur={() => {
                  setIsMonthTextInputFocused(false);
                }}
                style={{
                  ...styles.selectedFormTextInput,
                  fontSize: moderateScale(20, 0.4),
                  color: colors.primary,
                  borderColor: isMonthTextInputFocused
                    ? colors.primary
                    : '#cccccc',
                }}
                maxLength={2}
                keyboardType="number-pad"
                value={mm}
                onChangeText={text => {
                  if (!numberValidator(text)) return;
                  dispatch(
                    setSignupFormData({
                      ...signupFormData,
                      birthDate: {...signupFormData.birthDate, mm: text},
                    }),
                  );
                  if (text.length == 2) yearTextInputRef.current.focus();
                }}
              />
            </View>

            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <AppText style={{...styles.titleText, color: colors.primary}}>
                /
              </AppText>
            </View>

            <View style={{...styles.expandedCenterView, flex: 2}}>
              <TextInput
                ref={yearTextInputRef}
                placeholder="YYYY"
                textAlign={'center'}
                letterSpacing={scale(6)}
                onFocus={() => {
                  setIsYearTextInputFocused(true);
                }}
                onBlur={() => {
                  setIsYearTextInputFocused(false);
                }}
                style={{
                  ...styles.selectedFormTextInput,
                  fontSize: moderateScale(20, 0.4),
                  color: colors.primary,
                  borderColor: isYearTextInputFocused
                    ? colors.primary
                    : '#cccccc',
                }}
                maxLength={4}
                keyboardType="number-pad"
                value={yyyy}
                onChangeText={text => {
                  if (!numberValidator(text)) return;
                  dispatch(
                    setSignupFormData({
                      ...signupFormData,
                      birthDate: {...signupFormData.birthDate, yyyy: text},
                    }),
                  );
                }}
              />
            </View>
          </View>
          {isErrShown ? (
            <Animatable.View
              style={{flexDirection: 'row', justifyContent: 'flex-start'}}
              animation={'fadeInLeft'}
              duration={500}>
              <AppText>{errMessage}</AppText>
            </Animatable.View>
          ) : null}
        </View>
        <View style={styles.formButtonView}>
          <FormButton
            disabled={isButtonDisabled}
            title="Continue"
            onPress={() => {
              Keyboard.dismiss();
              props.navigation.navigate('SignupUsernameScreen');
            }}
          />
        </View>
        <Spacer height={80} />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default SignupAgeScreen;
