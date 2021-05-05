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
import Spacer from '../../components/Spacer';
import StackHeader from '../../components/StackHeader';
import styles from '../../styles';
import {verticalScale} from 'react-native-size-matters';
import {useDispatch, useSelector} from 'react-redux';
import {setSignupFormData, signupUser} from '../../store/actions/signupForm';
import ProgressLine from '../../components/ProgressLine';
import SignupUserPhotoGrid from '../../components/SignupUserPhotoGrid';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../constants/colors';
import CustomSafeAreaView from '../../components/CustomSafeAreaView';

const SignupUserPhotos = props => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const signupUserPhotos = useSelector(state => state.signupForm.userPhotos);
  const dispatch = useDispatch();

  useEffect(() => {
    let hasPhoto = false;
    for (var i = 0; i < 6; i++) {
      if (signupUserPhotos[i] !== null) {
        hasPhoto = true;
        break;
      }
    }
    setIsButtonDisabled(!hasPhoto);
  }, [signupUserPhotos]);

  return (
    <LinearGradient
      colors={[colors.primary, colors.accent]}
      style={styles.rootView}>
      <CustomSafeAreaView style={styles.rootView}>
        <ProgressLine
          style={{
            width: '100%',
            backgroundColor: 'white',
            height: verticalScale(5),
          }}
        />
        <StackHeader backIconColor="white" navigation={props.navigation} />
        <View style={styles.expandedCenterView}>
          <View style={styles.titleView}>
            <AppText style={{...styles.titleText, color: 'white'}}>
              Enter your photos
            </AppText>
          </View>

          <View style={styles.rootView}>
            <SignupUserPhotoGrid />
          </View>
        </View>

        <View style={styles.formButtonView}>
          <FormButton
            title={'Submit'}
            disabled={isButtonDisabled}
            autoCorrect={false}
            onPress={() => {
              Keyboard.dismiss();
              //****perform signup****//
              dispatch(signupUser());
            }}
          />
        </View>
        <Spacer height={80} />
      </CustomSafeAreaView>
    </LinearGradient>
  );
};

export default SignupUserPhotos;
