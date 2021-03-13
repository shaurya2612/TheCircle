import React from "react";
import { Button, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { verticalScale } from "react-native-size-matters";
import AppText from "../components/AppText";
import FormButton from "../components/FormButton";
import FormTextInput from "../components/FormTextInput";
import SelectionButton from "../components/SelectionButton";
import * as Animatable from "react-native-animatable";
import styles from "../styles";
import { loginUser } from "../store/actions/user";
import { useState } from "react";
import { useDispatch } from "react-redux";

const LoginScreen = (props) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  return (
    <View style={{ ...styles.rootView, backgroundColor: "white" }}>
      <SafeAreaView style={styles.expandedCenterView}>
        <Animatable.View
          style={{ ...styles.expandedCenterView, width: "100%" }}
          animation={"slideInUp"}
        >
          <View style={styles.titleView}>
            <AppText style={styles.titleText}>Login</AppText>
          </View>
          <FormTextInput
            keyboardType={"number-pad"}
            onChangeText={(text) => {
              setPhoneNumber(text);
            }}
            placeholder="Mobile Number"
          />
          <FormTextInput
            onChangeText={(text) => {
              setPassword(text);
            }}
            secureTextEntry={true}
            style={{ marginBottom: verticalScale(30) }}
            placeholder="Password"
          />
          <FormButton
            onPress={() => {
              dispatch(loginUser(phoneNumber, password));
            }}
            title={"Log me in"}
          />
          <AppText style={{ margin: verticalScale(5) }}>Or</AppText>
          <SelectionButton
            title={"Sign me up !"}
            onPress={() => {
              props.navigation.navigate("PhoneAuthScreen");
            }}
          />
        </Animatable.View>
      </SafeAreaView>
    </View>
  );
};

export default LoginScreen;
