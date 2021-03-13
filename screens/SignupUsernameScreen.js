//Screen that asks username
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Keyboard, View } from "react-native";
import AppText from "../components/AppText";
import FormButton from "../components/FormButton";
import FormTextInput from "../components/FormTextInput";
import Spacer from "../components/Spacer";
import StackHeader from "../components/StackHeader";
import styles from "../styles";
import * as Animatable from "react-native-animatable";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { setSignupFormData } from "../store/actions/signupForm";
import { scale, verticalScale } from "react-native-size-matters";
import ProgressLine from "../components/ProgressLine";
import { isUsernameValid } from "../firebase/utils";
import { setLoadingState } from "../store/actions/loading";
import colors from "../constants/colors";

const SignupUsernameScreen = (props) => {
  const signupFormData = useSelector((state) => state.signupForm);
  const loadingState = useSelector((state) => state.loading);
  const { fetchingUsername } = loadingState.SignupUsernameScreen;
  const { username } = signupFormData;
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isErrShown, setIsErrShown] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const dispatch = useDispatch();

  const usernameValidator = async (name) => {
    dispatch(
      setLoadingState({
        ...loadingState,
        SignupUsernameScreen: { fetchingUsername: true },
      })
    );
    let rjx = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,20}$/;
    let isValid = rjx.test(name) && (await isUsernameValid(username));
    dispatch(
      setLoadingState({
        ...loadingState,
        SignupUsernameScreen: { fetchingUsername: false },
      })
    );
    return isValid;
  };

  useEffect(() => {
    const asyncValidate = async () => {
      if (username === "" || !username) {
        setIsButtonDisabled(true);
        setIsErrShown(false);
        return;
      }
      if (username.length <= 3) {
        setIsButtonDisabled(true);
        setIsErrShown(true);
        setErrMessage("Username is too short");
        return;
      }
      setIsButtonDisabled(!(await usernameValidator(username.trim())));
      setIsErrShown(!(await usernameValidator(username.trim())));
      if (!(await usernameValidator(username.trim()))) {
        setErrMessage("This username is already taken");
        return;
      }
      //make req to database to check if username is there or not
    };
    asyncValidate();
  }, [username]);

  return (
    <SafeAreaView style={styles.rootView}>
      <ProgressLine
        style={{
          width: "57.2%",
          backgroundColor: "black",
          height: verticalScale(5),
        }}
      />
      <StackHeader navigation={props.navigation} />

      <View style={styles.expandedCenterView}>
        <View style={styles.titleView}>
          <AppText style={styles.titleText}>Select a username</AppText>
          {fetchingUsername ? (
            <ActivityIndicator
              style={{ marginHorizontal: scale(10) }}
              size={scale(30)}
              color={colors.primary}
            />
          ) : null}
        </View>
        <FormTextInput
          maxLength={20}
          autoCorrect={false}
          autoCapitalize="none"
          value={username}
          onChangeText={(text) => {
            dispatch(setSignupFormData({ ...signupFormData, username: text }));
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
          disabled={isButtonDisabled || fetchingUsername}
          onPress={() => {
            Keyboard.dismiss();
            props.navigation.navigate("SignupPasswordScreen");
          }}
        />
      </View>
      <Spacer height={80} />
    </SafeAreaView>
  );
};

export default SignupUsernameScreen;
