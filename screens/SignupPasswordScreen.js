//Screen that asks for setting a password
import React, { useEffect, useState } from "react";
import { Keyboard, View } from "react-native";
import AppText from "../components/AppText";
import FormButton from "../components/FormButton";
import FormTextInput from "../components/FormTextInput";
import Spacer from "../components/Spacer";
import StackHeader from "../components/StackHeader";
import styles from "../styles";
import * as Animatable from "react-native-animatable";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { setSignupFormData } from "../store/actions/signupForm";
import ProgressLine from "../components/ProgressLine";

const SignupPasswordScreen = (props) => {
  const signupFormData = useSelector((state) => state.signupForm);
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isErrShown, setIsErrShown] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const dispatch = useDispatch();

  //Validator for firstName
  const passwordValidator = (name) => {
    let rjx = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,20}$/;
    let isValid = rjx.test(name);
    return isValid;
  };

  useEffect(() => {
    if (password === "") {
      setIsButtonDisabled(true);
      setIsErrShown(false);
      return;
    }
    if (password.length < 6) {
      setIsButtonDisabled(true);
      setIsErrShown(true);
      setErrMessage("Password is too short");
      return;
    }
    if (password !== password2) {
      setIsButtonDisabled(true);
      setIsErrShown(true);
      setErrMessage("Passwords do not match");
      return;
    }
    setIsButtonDisabled(false);
    setIsErrShown(false);
  }, [password, password2]);

  return (
    <SafeAreaView style={styles.rootView}>
      <ProgressLine
        style={{
          width: "71.5%",
          backgroundColor: "black",
          height: verticalScale(5),
        }}
      />
      <StackHeader navigation={props.navigation} />

      <View style={styles.expandedCenterView}>
        <View style={styles.titleView}>
          <AppText style={styles.titleText}>Select a password</AppText>
        </View>
        <FormTextInput
          autoCorrect={false}
          autoCapitalize="none"
          secureTextEntry={true}
          style={{ fontSize: moderateScale(20, 0.4) }}
          placeholder={"Password"}
          placeholderTextColor={"#cccccc"}
          onChangeText={(text) => {
            setPassword(text);
          }}
        />

        <FormTextInput
          autoCorrect={false}
          autoCapitalize="none"
          secureTextEntry={true}
          style={{ fontSize: moderateScale(20, 0.4) }}
          placeholder={"Confirm password"}
          placeholderTextColor={"#cccccc"}
          onChangeText={(text) => {
            setPassword2(text);
          }}
        />
        {isErrShown ? (
          <Animatable.View
            style={{ flexDirection: "row", justifyContent: "flex-start" }}
            animation={"fadeInLeft"}
            duration={500}
          >
            <AppText>{errMessage}</AppText>
          </Animatable.View>
        ) : null}
      </View>

      <View style={styles.formButtonView}>
        <FormButton
          title={"CONTINUE"}
          disabled={isButtonDisabled}
          onPress={() => {
            Keyboard.dismiss()
            props.navigation.navigate("SignupGenderScreen");
            dispatch(
              setSignupFormData({ ...signupFormData, password: password })
            );
          }}
        />
      </View>
      <Spacer height={80} />
    </SafeAreaView>
  );
};

export default SignupPasswordScreen;
