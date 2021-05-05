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

const SignupShowMeInTheSearchForScreen = props => {
  const signupFormData = useSelector(state => state.signupForm);
  const {gender} = signupFormData;
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    if (gender) setIsButtonDisabled(false);
    else setIsButtonDisabled(true);
  }, [gender]);

  return (
    <SafeAreaView style={{...styles.rootView, backgroundColor: colors.primary}}>
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
            Show me in the search for
          </AppText>
        </View>

        <View
          style={{
            width: '80%',
          }}>
          <SelectionButton
            onPress={() => {
              dispatch(setSignupFormData({...signupFormData, gender: 'Male'}));
            }}
            textColor="white"
            disabledStyle={gender === 'Male' ? true : false}
            style={localStyles.selectionButton}
            title="Men"
          />
          <SelectionButton
            onPress={() => {
              dispatch(
                setSignupFormData({...signupFormData, gender: 'Female'}),
              );
            }}
            textColor="white"
            disabledStyle={gender === 'Female' ? true : false}
            style={localStyles.selectionButton}
            title="Women"
          />
        </View>
      </View>

      <View style={styles.formButtonView}>
        <FormButton
          title={'Continue'}
          disabled={isButtonDisabled ? true : false}
          autoCorrect={false}
          onPress={() => {
            Keyboard.dismiss();
            props.navigation.navigate('SignupInterestedInScreen');
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

export default SignupShowMeInTheSearchForScreen;
