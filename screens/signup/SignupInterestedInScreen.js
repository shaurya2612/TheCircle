import React, {useEffect, useState} from 'react';
import {Keyboard, StyleSheet, View} from 'react-native';
import AppText from '../../components/AppText';
import FormButton from '../../components/FormButton';
import Spacer from '../../components/Spacer';
import StackHeader from '../../components/StackHeader';
import styles from '../../styles';
import {SafeAreaView} from 'react-native-safe-area-context';
import SelectionButton from '../../components/SelectionButton';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import {useDispatch, useSelector} from 'react-redux';
import {setSignupFormData} from '../../store/actions/signupForm';
import ProgressLine from '../../components/ProgressLine';
import colors from '../../constants/colors';
import CocentricCircles from '../../components/svgs/CocentricCircles';

const SignupInterestedInScreen = props => {
  const signupFormData = useSelector(state => state.signupForm);
  const {interestedIn} = signupFormData;
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (interestedIn) setIsButtonDisabled(false);
    else setIsButtonDisabled(true);
  }, [interestedIn]);

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
          width: '85.8%',
          backgroundColor: '#cccccc',
          height: verticalScale(5),
        }}
      />
      <StackHeader backIconColor="black" navigation={props.navigation} />

      <View style={styles.expandedCenterView}>
        <View style={styles.titleView}>
          <AppText style={{...styles.titleText, color: colors.primary}}>
            Show me
          </AppText>
        </View>

        <View
          style={{
            width: '80%',
          }}>
          <SelectionButton
            onPress={() => {
              dispatch(
                setSignupFormData({...signupFormData, interestedIn: 'Male'}),
              );
            }}
            disabledStyle={interestedIn === 'Male' ? true : false}
            style={localStyles.selectionButton}
            textColor={colors.primary}
            title="Men"
          />
          <SelectionButton
            onPress={() => {
              dispatch(
                setSignupFormData({...signupFormData, interestedIn: 'Female'}),
              );
            }}
            disabledStyle={interestedIn === 'Female' ? true : false}
            style={localStyles.selectionButton}
            textColor={colors.primary}
            title="Women"
          />
          <SelectionButton
            onPress={() => {
              dispatch(
                setSignupFormData({
                  ...signupFormData,
                  interestedIn: 'Everyone',
                }),
              );
            }}
            disabledStyle={interestedIn === 'Everyone' ? true : false}
            style={localStyles.selectionButton}
            textColor={colors.primary}
            title="Everyone"
          />
        </View>
      </View>

      <View style={styles.formButtonView}>
        <FormButton
          title={'Continue'}
          disabled={isButtonDisabled ? true : false}
          autoCorrect={false}
          textColor={colors.primary}
          onPress={() => {
            Keyboard.dismiss();
            props.navigation.navigate('SignupUserPhotos');
          }}
        />
      </View>
      <Spacer height={80} />
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  selectionButton: {marginVertical: verticalScale(5)},
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: moderateScale(10, 0.4),
  },
});

export default SignupInterestedInScreen;
