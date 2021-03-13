import React, { useEffect, useState } from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import AppText from "../components/AppText";
import FormButton from "../components/FormButton";
import FormTextInput from "../components/FormTextInput";
import Spacer from "../components/Spacer";
import StackHeader from "../components/StackHeader";
import styles from "../styles";
import { SafeAreaView } from "react-native-safe-area-context";
import SelectionButton from "../components/SelectionButton";
import Modal from "react-native-modal";
import { moderateScale, verticalScale } from "react-native-size-matters";
import ModalCardView from "../components/ModalCardView";
import { useDispatch, useSelector } from "react-redux";
import { setSignupFormData } from "../store/actions/signupForm";
import ProgressLine from "../components/ProgressLine";
import CustomHeader from "../components/CustomHeader";

const SignupShowMeInTheSearchForScreen = (props) => {
  const signupFormData = useSelector((state) => state.signupForm);
  const { gender } = signupFormData;
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    if (gender) setIsButtonDisabled(false);
    else setIsButtonDisabled(true);
  }, [gender]);

  return (
    <SafeAreaView style={styles.rootView}>
      <ProgressLine
        style={{
          width: "85.8%",
          backgroundColor: "black",
          height: verticalScale(5),
        }}
      />

      <StackHeader navigation={props.navigation} />
      <View style={styles.expandedCenterView}>
        <View style={styles.titleView}>
          <AppText style={styles.titleText}>Show me in the search for</AppText>
        </View>

        <View
          style={{
            width: "80%",
          }}
        >
          <SelectionButton
            onPress={() => {
              dispatch(
                setSignupFormData({ ...signupFormData, gender: "Male" })
              );
            }}
            disabledStyle={gender === "Male" ? false : true}
            style={localStyles.selectionButton}
            title="Men"
          />
          <SelectionButton
            onPress={() => {
              dispatch(
                setSignupFormData({ ...signupFormData, gender: "Female" })
              );
            }}
            disabledStyle={gender === "Female" ? false : true}
            style={localStyles.selectionButton}
            title="Women"
          />
        </View>
      </View>

      <View style={styles.formButtonView}>
        <FormButton
          title={"CONTINUE"}
          disabled={isButtonDisabled ? true : false}
          autoCorrect={false}
          onPress={() => {
            Keyboard.dismiss();
            props.navigation.navigate("SignupInterestedInScreen");
          }}
        />
      </View>
      <Spacer height={80} />
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  selectionButton: { marginVertical: verticalScale(5) },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: moderateScale(10, 0.4),
  },
});

export default SignupShowMeInTheSearchForScreen;
