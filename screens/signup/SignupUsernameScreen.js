//Screen that asks username
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Keyboard, View} from 'react-native';
import AppText from '../../components/AppText';
import FormButton from '../../components/FormButton';
import FormTextInput from '../../components/FormTextInput';
import Spacer from '../../components/Spacer';
import StackHeader from '../../components/StackHeader';
import styles from '../../styles';
import * as Animatable from 'react-native-animatable';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {setSignupFormData} from '../../store/actions/signupForm';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import ProgressLine from '../../components/ProgressLine';
import {isUsernameValid} from '../../firebase/utils';
import {setLoadingState} from '../../store/actions/loading';
import colors from '../../constants/colors';
import CocentricCircles from '../../components/svgs/CocentricCircles';
import LinearGradient from 'react-native-linear-gradient';

const SignupUsernameScreen = props => {
  const signupFormData = useSelector(state => state.signupForm);
  const loadingState = useSelector(state => state.loading);
  const {fetchingUsername} = loadingState.SignupUsernameScreen;
  const {username} = signupFormData;
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [isErrShown, setIsErrShown] = useState(false);
  const [errMessage, setErrMessage] = useState('');
  const dispatch = useDispatch();

  const usernameValidator = name => {
    let rjx = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,20}$/;
    let isValid = rjx.test(name);
    setErrMessage('Username must contain only letters and numbers.');
    return isValid;
  };

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

  useEffect(() => {
    if (username === '' || !username) {
      setIsButtonDisabled(true);
      setIsErrShown(false);
      return;
    }
    if (username.length <= 3) {
      setIsButtonDisabled(true);
      setIsErrShown(true);
      setErrMessage('Username is too short.');
      return;
    }
    setIsButtonDisabled(!usernameValidator(username.trim()));
    setIsErrShown(!usernameValidator(username.trim()));
  }, [username]);

  return (
    <View style={{...styles.rootView, backgroundColor: 'white'}}>
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
          width: '57.2%',
          backgroundColor: '#cccccc',
          height: verticalScale(5),
        }}
      />
      <StackHeader backIconColor="black" navigation={props.navigation} />

      <View style={styles.expandedCenterView}>
        <View style={styles.titleView}>
          <AppText style={{...styles.titleText, color: colors.primary}}>
            Select a username
          </AppText>
          {fetchingUsername ? (
            <ActivityIndicator
              style={{marginHorizontal: scale(10)}}
              size={scale(30)}
              color={colors.primary}
            />
          ) : null}
        </View>
        <FormTextInput
          maxLength={20}
          selectedBorderColor={colors.primary}
          style={{fontSize: moderateScale(20, 0.4), color: colors.primary}}
          selectionColor={'#cccccc'}
          autoCorrect={false}
          autoCapitalize="none"
          value={username}
          onChangeText={text => {
            dispatch(setSignupFormData({...signupFormData, username: text}));
          }}
        />
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
          title={'Continue'}
          textColor={colors.primary}
          disabled={isButtonDisabled || fetchingUsername}
          onPress={async () => {
            Keyboard.dismiss();
            dispatch(
              setLoadingState({
                ...loadingState,
                SignupUsernameScreen: {fetchingUsername: true},
              }),
            );

            let isValid = await isUsernameValid(username.trim());

            dispatch(
              setLoadingState({
                ...loadingState,
                SignupUsernameScreen: {fetchingUsername: false},
              }),
            );

            if (!isValid) {
              setErrMessage('This username is already taken.');
              setIsErrShown(true);
              return;
            }
            props.navigation.navigate('SignupGenderScreen');
          }}
        />
      </View>
      <Spacer height={80} />
    </View>
  );
};

export default SignupUsernameScreen;
