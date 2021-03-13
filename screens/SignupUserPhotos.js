//Screen that asks for first name
import React, { useEffect, useState } from "react";
import {
  Button,
  Text,
  View,
  TextInput,
  ImageBackground,
  Keyboard,
} from "react-native";
import AppText from "../components/AppText";
import FormButton from "../components/FormButton";
import Spacer from "../components/Spacer";
import StackHeader from "../components/StackHeader";
import styles from "../styles";
import * as Animatable from "react-native-animatable";
import { SafeAreaView } from "react-native-safe-area-context";
import UserPhotoGrid from "../components/UserPhotoGrid";
import { verticalScale } from "react-native-size-matters";
import { useDispatch, useSelector } from "react-redux";
import { setSignupFormData, signupUser } from "../store/actions/signupForm";
import ProgressLine from "../components/ProgressLine";
import SignupUserPhotoGrid from "../components/SignupUserPhotoGrid";

const SignupUserPhotos = (props) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const signupUserPhotos = useSelector((state) => state.signupForm.userPhotos);
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
    <SafeAreaView style={styles.rootView}>
      <ProgressLine
        style={{
          width: "100%",
          backgroundColor: "black",
          height: verticalScale(5),
        }}
      />
      <StackHeader navigation={props.navigation} />
      <View style={styles.expandedCenterView}>
        <View style={styles.titleView}>
          <AppText style={styles.titleText}>Enter your photos</AppText>
        </View>

        <View style={styles.rootView}>
          <SignupUserPhotoGrid />
        </View>
      </View>

      <View style={styles.formButtonView}>
        <FormButton
          title={"SUBMIT"}
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
    </SafeAreaView>
  );
};

export default SignupUserPhotos;
