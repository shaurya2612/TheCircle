import React from "react";
import { useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { scale, verticalScale } from "react-native-size-matters";
import { useDispatch } from "react-redux";
import colors from "../constants/colors";
import { declineRequest, sendFriendRequest } from "../firebase/utils";
import { setErrorMessage } from "../store/actions/error";
import { acceptRequest } from "../store/actions/user";
import styles from "../styles";
import AppText from "./AppText";
import SmallStatBox from "./homeStatCard/SmallStatBox";
import IconCircle from "./IconCircle";
import StartMatchingButton from "./StartMatchingButton";

const FriendCard = ({
  imageUri,
  name,
  type,
  username,
  age,
  userId,
  keyInRequests,
  ...props
}) => {
  const dispatch = useDispatch();
  const renderContent = () => {
    switch (type) {
      case "add":
        return (
          <StartMatchingButton
            onPress={async () => {
              await sendFriendRequest(userId);
            }}
            title="Add Friend"
          />
        );
      case "loading":
        return <ActivityIndicator color={colors.primary} size={"large"} />;
      case "isFriend":
        return <StartMatchingButton disabled={true} title="Friends" />;
      case "sentRequest":
        return <StartMatchingButton disabled={true} title="Pending" />;
      case "inRequests":
        return (
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <TouchableOpacity
              onPress={async () => {
                try {
                  dispatch(acceptRequest(keyInRequests, userId));
                } catch (err) {
                  dispatch(setErrorMessage(err.message));
                }
              }}
            >
              <IconCircle
                size={verticalScale(60)}
                style={{ backgroundColor: "green", borderColor: "white" }}
                iconColor="white"
                iconName="check"
                label="Accept"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                try {
                  await declineRequest(keyInRequests);
                } catch (err) {
                  dispatch(setErrorMessage(err.message));
                }
              }}
            >
              <IconCircle
                size={verticalScale(60)}
                style={{ backgroundColor: "red", borderColor: "white" }}
                iconColor="white"
                iconName="times"
                label="Decline"
              />
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <Animatable.View
      animation="bounceIn"
      style={{
        ...styles.homeStatCardView,
        ...styles.elevation_small,
        ...props.style,
        borderWidth: scale(type === "inRequests" ? 0 : 1),
        elevation: 5,
      }}
    >
      <ImageBackground
        source={{
          uri: imageUri,
        }}
        style={{
          ...styles.homeStatCardImageBackground,
          ...styles.elevation_small,
        }}
        imageStyle={{ resizeMode: "cover" }}
      ></ImageBackground>

      <AppText
        style={{
          ...styles.titleText,
          textAlign: "center",
          marginTop: verticalScale(20),
        }}
      >
        <AppText style={{ ...styles.nameText, color: "white" }}>
          {age ? `(${age})  ` : null}
        </AppText>

        {name}

        <AppText style={{ ...styles.nameText, color: "grey" }}>
          {age ? `  (${age})` : null}
        </AppText>
      </AppText>

      {username ? (
        <AppText
          style={{
            fontSize: scale(15),
            textAlign: "center",
            color: "grey",
          }}
        >
          {username}
        </AppText>
      ) : null}
      <View style={{ flexDirection: "row", marginTop: verticalScale(10) }}>
        {renderContent()}
      </View>
    </Animatable.View>
  );
};

export default FriendCard;
