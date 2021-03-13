import React from "react";
import { useState } from "react";
import {
  ImageBackground,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { scale, verticalScale } from "react-native-size-matters";
import Icon from "react-native-vector-icons/Feather";
import { useSelector } from "react-redux";
import styles from "../../styles";
import AppText from "../AppText";
import SmallStatBox from "./SmallStatBox";

const HomeStatCard = ({ onPressImage }) => {
  const userState = useSelector((state) => state.user);
  const { name, dp, username } = userState;
  const [areEditOptionsVisible, setAreEditOptionsVisible] = useState(true);
  return (
    <View style={styles.homeStatCardView}>
      <TouchableWithoutFeedback onPressIn={onPressImage}>
        <ImageBackground
          source={{
            uri: dp,
          }}
          style={{
            ...styles.homeStatCardImageBackground,
            ...styles.elevation_small,
          }}
        ></ImageBackground>
      </TouchableWithoutFeedback>
      <AppText
        style={{
          ...styles.titleText,
          textAlign: "center",
          marginTop: verticalScale(20),
        }}
      >
        {name}
      </AppText>
      <AppText
        style={{
          ...styles.usernameText,
          textAlign: "center",
        }}
      >
        {username?'@'+username:"loading..."}
      </AppText>
      <View style={{ flexDirection: "row", marginTop: verticalScale(10) }}>
        <SmallStatBox statName="Stat 1" statNumber="145" />
        <SmallStatBox
          style={{ borderRightWidth: scale(1), borderLeftWidth: scale(1) }}
          statName="Stat 2"
          statNumber="286"
        />
        <SmallStatBox statName="Stat 3" statNumber="137" />
      </View>
    </View>
  );
};

export default HomeStatCard;
