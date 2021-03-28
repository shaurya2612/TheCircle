import React, {useCallback, useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {Keyboard, StyleSheet, View} from 'react-native';
import AppText from '../components/AppText';
import FormButton from '../components/FormButton';
import FormTextInput from '../components/FormTextInput';
import Spacer from '../components/Spacer';
import StackHeader from '../components/StackHeader';
import styles from '../styles';
import {SafeAreaView} from 'react-native-safe-area-context';
import SelectionButton from '../components/SelectionButton';
import Modal from 'react-native-modal';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import ModalCardView from '../components/ModalCardView';
import {useDispatch, useSelector} from 'react-redux';
import {setSignupFormData} from '../store/actions/signupForm';
import ProgressLine from '../components/ProgressLine';
import colors from '../constants/colors';

const SignupGenderScreen = props => {
  const signupFormData = useSelector(state => state.signupForm);
  const {gender, nonBinary} = signupFormData;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [moreText, setMoreText] = useState(nonBinary);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    if (gender) setIsButtonDisabled(false);
    else setIsButtonDisabled(true);
  }, [gender]);

  useFocusEffect(
    useCallback(() => {
      if (nonBinary)
        dispatch(setSignupFormData({...signupFormData, gender: nonBinary}));
    }, [props]),
  );

  return (
    <SafeAreaView style={{...styles.rootView, backgroundColor: colors.primary}}>
      <ProgressLine
        style={{
          width: '85.8%',
          backgroundColor: 'white',
          height: verticalScale(5),
        }}
      />
      <StackHeader backIconColor={'white'} navigation={props.navigation} />

      <View style={styles.expandedCenterView}>
        <View style={styles.titleView}>
          <AppText style={{...styles.titleText, color: 'white'}}>
            I am a
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
            disabledStyle={gender === 'Male' ? true : false}
            style={localStyles.selectionButton}
            textColor="white"
            title="Male"
          />
          <SelectionButton
            onPress={() => {
              dispatch(
                setSignupFormData({...signupFormData, gender: 'Female'}),
              );
            }}
            disabledStyle={gender === 'Female' ? true : false}
            style={localStyles.selectionButton}
            textColor="white"
            title="Female"
          />
          <SelectionButton
            onPress={() => {
              setIsModalVisible(true);
            }}
            disabledStyle={
              gender !== 'Male' && gender !== 'Female' && gender ? true : false
            }
            style={localStyles.selectionButton}
            textColor="white"
            title={moreText ? moreText : 'More'}
          />
        </View>
      </View>

      <Modal
        isVisible={isModalVisible}
        backdropTransitionOutTiming={0}
        style={{margin: 0}}>
        <SafeAreaView style={styles.modalCardView}>
          <ModalCardView>
            <FormTextInput
              value={moreText}
              onChangeText={text => {
                setMoreText(text);
              }}
              placeholder={'Start typing...'}
            />
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              {moreText.trim() !== '' ? (
                <FormButton
                  onPress={() => {
                    dispatch(
                      setSignupFormData({...signupFormData, gender: moreText}),
                    );
                    setIsModalVisible(false);
                  }}
                  title="Ok"
                  style={{margin: 5}}
                />
              ) : null}

              <FormButton
                onPress={() => {
                  setIsModalVisible(false);
                  if (
                    moreText === '' &&
                    gender !== 'Male' &&
                    gender !== 'Female'
                  )
                    setIsButtonDisabled(true);
                }}
                title="Cancel"
                style={{margin: 5}}
              />
            </View>
          </ModalCardView>
        </SafeAreaView>
      </Modal>

      <View style={styles.formButtonView}>
        <FormButton
          title={'Continue'}
          disabled={isButtonDisabled ? true : false}
          autoCorrect={false}
          onPress={() => {
            Keyboard.dismiss();
            if (gender !== 'Male' && gender !== 'Female') {
              dispatch(
                setSignupFormData({
                  ...signupFormData,
                  gender: '',
                  nonBinary: gender,
                }),
              );
              props.navigation.navigate('SignupShowMeInTheSearchForScreen');
            } else {
              dispatch(
                setSignupFormData({
                  ...signupFormData,
                  nonBinary: '',
                }),
              );
              props.navigation.navigate('SignupInterestedInScreen');
            }
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

export default SignupGenderScreen;
