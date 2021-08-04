//Screen that asks for first name
import React, {useEffect, useState} from 'react';
import {
  Button,
  Text,
  View,
  TextInput,
  ImageBackground,
  Keyboard,
} from 'react-native';
import AppText from '../../components/AppText';
import FormButton from '../../components/FormButton';
import FormTextInput from '../../components/FormTextInput';
import Spacer from '../../components/Spacer';
import styles from '../../styles';
import * as Animatable from 'react-native-animatable';
import {SafeAreaView} from 'react-native-safe-area-context';
import {setSignupFormData} from '../../store/actions/signupForm';
import {useDispatch, useSelector} from 'react-redux';
import ProgressLine from '../../components/ProgressLine';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import colors from '../../constants/colors';
import CocentricCircles from '../../components/svgs/CocentricCircles';

const SignupNameScreen = props => {
  const signupFormData = useSelector(state => state.signupForm);
  const firstName = signupFormData.name;
  const isProfileCompleted = useSelector(
    state => state.user.isProfileCompleted,
  );
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isErrShown, setIsErrShown] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const dispatch = useDispatch();

  //Validator for firstName
  const firstNameValidator = name => {
    let rjx = /^[a-zA-Z]{1,30}$/;
    let isValid = rjx.test(name);
    return isValid;
  };

  useEffect(() => {
    if (firstName === '') {
      setIsButtonDisabled(true);
      setIsErrShown(false);
      return;
    }
    setIsButtonDisabled(!firstNameValidator(firstName.trim()));
    setIsErrShown(!firstNameValidator(firstName.trim()));
  }, [firstName]);

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

  if (isProfileCompleted !== false) {
    return null;
  }

  return (
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
      <View style={{...styles.rootView}}>
        <ProgressLine
          style={{
            width: '28.6%',
            backgroundColor: '#cccccc',
            height: verticalScale(5),
          }}
        />
        <View style={{height: verticalScale(50)}} />

        <View style={styles.expandedCenterView}>
          <View style={styles.titleView}>
            <AppText style={{...styles.titleText, color: colors.primary}}>
              Enter your first name
            </AppText>
          </View>
          <FormTextInput
            value={firstName}
            selectedBorderColor={colors.primary}
            style={{color: colors.primary}}
            selectionColor={'#cccccc'}
            onChangeText={text => {
              dispatch(setSignupFormData({...signupFormData, name: text}));
            }}
          />
          {isErrShown ? (
            <Animatable.View
              style={{flexDirection: 'row', justifyContent: 'flex-start'}}
              animation={'fadeInLeft'}
              duration={500}>
              <AppText>Please enter a valid name</AppText>
            </Animatable.View>
          ) : null}
        </View>

        <View style={styles.formButtonView}>
          <FormButton
            title={'Continue'}
            textColor={colors.primary}
            disabled={isButtonDisabled}
            autoCorrect={false}
            onPress={() => {
              Keyboard.dismiss();
              props.navigation.navigate('SignupAgeScreen');
            }}
          />
        </View>
        <Spacer height={80} />
      </View>
    </SafeAreaView>
  );
};

export default SignupNameScreen;
