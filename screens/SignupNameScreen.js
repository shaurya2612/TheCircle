//Screen that asks for first name
import React, { useEffect, useState } from "react";
import { Button, Text, View, TextInput, ImageBackground, Keyboard } from "react-native";
import AppText from "../components/AppText";
import CustomHeader from "../components/CustomHeader";
import FormButton from "../components/FormButton";
import FormTextInput from "../components/FormTextInput";
import Spacer from "../components/Spacer";
import StackHeader from "../components/StackHeader";
import styles from "../styles";
import * as Animatable from "react-native-animatable";
import { SafeAreaView } from "react-native-safe-area-context";
import { setSignupFormData } from "../store/actions/signupForm";
import { useDispatch, useSelector } from "react-redux";
import ProgressLine from "../components/ProgressLine";
import { verticalScale } from "react-native-size-matters";

const SignupNameScreen = (props) => {
  const signupFormData = useSelector((state) => state.signupForm);
  const firstName = signupFormData.name;
  // const [firstName, setFirstName] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isErrShown, setIsErrShown] = useState(false);
  const dispatch = useDispatch();

  //Validator for firstName
  const firstNameValidator = (name) => {
    let rjx = /^[a-zA-Z]{1,30}$/;
    let isValid = rjx.test(name);
    return isValid;
  };

  useEffect(() => {
    if (firstName === "") {
      setIsButtonDisabled(true);
      setIsErrShown(false);
      return;
    }
    setIsButtonDisabled(!firstNameValidator(firstName.trim()));
    setIsErrShown(!firstNameValidator(firstName.trim()));
  }, [firstName]);

  return (
    <SafeAreaView style={styles.rootView}>
      <ProgressLine
        style={{
          width: "28.6%",
          backgroundColor: "black",
          height: verticalScale(5),
        }}
      />
      <StackHeader navigation={props.navigation} />

      <View style={styles.expandedCenterView}>
        <View style={styles.titleView}>
          <AppText style={styles.titleText}>Enter your first name</AppText>
        </View>
        <FormTextInput
          value={firstName}
          onChangeText={(text) => {
            dispatch(setSignupFormData({ ...signupFormData, name: text }));
          }}
        />
        {isErrShown ? (
          <Animatable.View
            style={{ flexDirection: "row", justifyContent: "flex-start" }}
            animation={"fadeInLeft"}
            duration={500}
          >
            <AppText>Please enter a valid name</AppText>
          </Animatable.View>
        ) : null}
      </View>

      <View style={styles.formButtonView}>
        <FormButton
          title={"CONTINUE"}
          disabled={isButtonDisabled}
          autoCorrect={false}
          onPress={() => {
            Keyboard.dismiss()
            props.navigation.navigate("SignupAgeScreen");
          }}
        />
      </View>
      <Spacer height={80} />
    </SafeAreaView>
  );
};

export default SignupNameScreen;
