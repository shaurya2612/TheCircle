import React from "react";
import { View, TouchableOpacity } from "react-native";
import { scale } from "react-native-size-matters";
import Icon from "react-native-vector-icons/Feather";
import { useDispatch } from "react-redux";
import AppText from "../../components/AppText";
import CustomHeader from "../../components/CustomHeader";
import CustomSafeAreaView from "../../components/CustomSafeAreaView";
import FormButton from "../../components/FormButton";
import OptionView from "../../components/OptionView";
import SelectionButton from "../../components/SelectionButton";
import StackHeader from "../../components/StackHeader";
import { logoutUser } from "../../store/actions/user";
import styles from "../../styles";

const SettingsScreen = (props) => {
  const dispatch = useDispatch();
  return (
    <View style={{ ...styles.rootView, backgroundColor: "white" }}>
      <CustomSafeAreaView style={{ flex: 1 }}>
        <CustomHeader>
          <TouchableOpacity
            onPress={() => {
              props.navigation.goBack();
            }}
          >
            <Icon
              style={{ marginHorizontal: scale(10) }}
              name={"arrow-left"}
              size={scale(30)}
            />
          </TouchableOpacity>
          <AppText style={styles.titleText}>Settings</AppText>
          <View style={{ width: scale(50) }} />
        </CustomHeader>

        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
            padding: scale(10),
          }}
        >
          <View>
            <OptionView title="Something" />
            <OptionView title="Something" />
            <OptionView title="Something" />
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-evenly" }}
          >
            <FormButton
              onPress={() => {
                dispatch(logoutUser());
              }}
              title="Log Out"
            />
            <FormButton style={{ backgroundColor: "#ff3217" }} title="Delete" />
          </View>
        </View>
      </CustomSafeAreaView>
    </View>
  );
};

export default SettingsScreen;
