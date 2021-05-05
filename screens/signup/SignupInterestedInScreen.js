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

const SignupInterestedInScreen = props => {
  const signupFormData = useSelector(state => state.signupForm);
  const {interestedIn} = signupFormData;
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    if (interestedIn) setIsButtonDisabled(false);
    else setIsButtonDisabled(true);
  }, [interestedIn]);

  return (
    <SafeAreaView style={{...styles.rootView, backgroundColor: colors.accent}}>
      <ProgressLine
        style={{
          width: '85.8%',
          backgroundColor: 'white',
          height: verticalScale(5),
        }}
      />
      <StackHeader backIconColor="white" navigation={props.navigation} />

      <View style={styles.expandedCenterView}>
        <View style={styles.titleView}>
          <AppText style={{...styles.titleText, color: 'white'}}>
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
            textColor="white"
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
            textColor="white"
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
            textColor="white"
            title="Everyone"
          />
        </View>
      </View>

      <View style={styles.formButtonView}>
        <FormButton
          title={'Continue'}
          disabled={isButtonDisabled ? true : false}
          autoCorrect={false}
          textColor={colors.accent}
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
