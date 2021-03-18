import React from "react";
import { useEffect } from "react";
import { createRef } from "react";
import { useState } from "react";
import { FlatList, ScrollView, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modalbox";
import { scale, verticalScale } from "react-native-size-matters";
import Icon from "react-native-vector-icons/Feather";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import { useDispatch, useSelector } from "react-redux";
import AppText from "../../components/AppText";
import AvatarCircle from "../../components/AvatarCircle";
import CustomHeader from "../../components/CustomHeader";
import CustomSafeAreaView from "../../components/CustomSafeAreaView";
import { EditInfoBar } from "../../components/EditInfoBar";
import NameText from "../../components/NameText";
import colors from "../../constants/colors";
import { fetchUser, updateInterestedIn } from "../../store/actions/user";
import styles from "../../styles";
import UserProfileScreen from "../UserProfileScreen";

const UserScreen = (props) => {
  const userState = useSelector((state) => state.user);
  const loadingState = useSelector((state) => state.loading);
  const { dp, name, age, interestedIn } = userState;
  const { signingUp } = loadingState;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!signingUp) dispatch(fetchUser());
  }, [signingUp]);

  return (
    <View style={{ ...styles.rootView, backgroundColor: "white" }}>
      <CustomSafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
        <CustomHeader style={{ height: "auto", padding: scale(10) }}>
          {/* <View /> */}
          <Icon
            style={{ marginHorizontal: scale(5) }}
            onPress={() => {
              props.navigation.navigate("SettingsStack");
            }}
            name="settings"
            size={scale(25)}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <AppText style={styles.titleText}>Your Profile</AppText>
          </View>
          <View style={{ width: scale(35) }} />
        </CustomHeader>
        <View style={styles.expandedCenterView}>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate("EditProfileScreen");
            }}
          >
            <AvatarCircle disabled size={scale(110)} source={{ uri: dp }} />
            <View
              style={{
                position: "absolute",
                backgroundColor: "white",
                top: "75%",
                left: "25%",
                justifyContent: "center",
                alignItems: "center",
                padding: scale(5),
                borderRadius: scale(30),
                borderWidth: scale(1),
                borderColor: colors.primary,
              }}
            >
              <Icon size={scale(15)} color="black" name="edit-2" />
            </View>
          </TouchableOpacity>
          <View style={{ marginBottom: scale(20) }}>
            <AppText style={styles.titleText}>
              {name}, {age}
            </AppText>
          </View>
          <EditInfoBar
            iconName={"user"}
            title={"Show me"}
            value={(() => {
              if (interestedIn === "Male") return "Men";
              else if (interestedIn === "Female") return "Women";
              else return "Everyone";
            })()}
            valueOptions={["Men", "Women", "Everyone"]}
            onValueChange={(value) => {
              if (value === "Men") value = "Male";
              else if (value === "Women") value = "Female";
              else value = "Everyone";
              dispatch(updateInterestedIn(value));
            }}
            style={{ marginBottom: scale(20) }}
          />
          <EditInfoBar
            iconName={"clone"}
            title={"Cue Cards"}
            value={<FontAwesome5Icon name={"chevron-right"} />}
            style={{ marginBottom: scale(20) }}
            onPress={() => {
              props.navigation.navigate("UserCueCardsScreen");
            }}
          />
        </View>
      </CustomSafeAreaView>
    </View>
  );
};

export default UserScreen;
