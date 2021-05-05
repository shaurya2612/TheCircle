import React, {useEffect, useRef, useState} from 'react';
import {
  Keyboard,
  Platform,
  Text,
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

const SignupAgeScreen = props => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isErrShown, setIsErrShown] = useState(false);
  const [errMessage, setErrMessage] = useState('');
  const signupFormData = useSelector(state => state.signupForm);
  const dd = signupFormData.birthDate.dd;
  const mm = signupFormData.birthDate.mm;
  const yyyy = signupFormData.birthDate.yyyy;
  const dispatch = useDispatch();
  const monthTextInputRef = useRef();
  const yearTextInputRef = useRef();

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
      <SafeAreaView
        style={{...styles.rootView, backgroundColor: colors.primary}}>
        <ProgressLine
          style={{
            width: '42.9%',
            backgroundColor: 'white',
            height: verticalScale(5),
          }}
        />
        <StackHeader backIconColor={'white'} navigation={props.navigation} />
        <View style={styles.expandedCenterView}>
          <View style={styles.titleView}>
            <AppText style={{...styles.titleText, color: 'white'}}>
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
              <FormTextInput
                placeholder="DD"
                textAlign={'center'}
                letterSpacing={scale(6)}
                maxLength={2}
                selectedBorderColor="white"
                style={{fontSize: moderateScale(20, 0.4), color: 'white'}}
                selectionColor={'white'}
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
                  // if (text.length == 2) monthTextInputRef.current.focus();
                }}
              />
            </View>

            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <AppText style={{...styles.titleText, color: 'white'}}>/</AppText>
            </View>

            <View style={styles.expandedCenterView}>
              <FormTextInput
                // ref={monthTextInputRef}
                placeholder="MM"
                textAlign={'center'}
                letterSpacing={scale(6)}
                selectedBorderColor="white"
                style={{fontSize: moderateScale(20, 0.4), color: 'white'}}
                selectionColor={'white'}
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
                  // if (text.length == 2) yearTextInputRef.current.focus();
                }}
              />
            </View>

            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <AppText style={{...styles.titleText, color: 'white'}}>/</AppText>
            </View>

            <View style={{...styles.expandedCenterView, flex: 2}}>
              <FormTextInput
                // ref={yearTextInputRef}
                placeholder="YYYY"
                textAlign={'center'}
                letterSpacing={scale(6)}
                selectedBorderColor="white"
                style={{fontSize: moderateScale(20, 0.4), color: 'white'}}
                selectionColor={'white'}
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
