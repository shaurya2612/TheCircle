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

const SignupNameScreen = props => {
  const signupFormData = useSelector(state => state.signupForm);
  const firstName = signupFormData.name;
  // const [firstName, setFirstName] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isErrShown, setIsErrShown] = useState(false);
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

  return (
    <SafeAreaView style={{...styles.rootView, backgroundColor: colors.accent}}>
      <View style={{...styles.rootView}}>
        <ProgressLine
          style={{
            width: '28.6%',
            backgroundColor: 'white',
            height: verticalScale(5),
          }}
        />
        <View style={{height: verticalScale(50)}} />

        <View style={styles.expandedCenterView}>
          <View style={styles.titleView}>
            <AppText style={{...styles.titleText, color: 'white'}}>
              Enter your first name
            </AppText>
          </View>
          <FormTextInput
            value={firstName}
            selectedBorderColor="white"
            style={{fontSize: moderateScale(20, 0.4), color: 'white'}}
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
            textColor={colors.accent}
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
