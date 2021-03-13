import React from "react";
import {
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import ReactNativeModal from "react-native-modal";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import Icon from "react-native-vector-icons/FontAwesome5";
import ModalCardView from "./ModalCardView";
import styles from "../styles";
import AppText from "./AppText";
import NameText from "./NameText";
import { useState } from "react";

export const EditInfoBar = ({
  iconName,
  title,
  value,
  onPress,
  onValueChange,
  valueOptions,
  removeOption,
  ...props
}) => {
  const [areOptionsVisible, setAreOptionsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  return (
    <TouchableOpacity
      onPress={() => {
        if (onPress) onPress()
        else setAreOptionsVisible(true);
      }}
      style={{
        width: "90%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: scale(100),
        backgroundColor: "white",
        padding: scale(10),
        paddingRight: scale(18),
        ...styles.elevation_medium,
        ...props.style,
      }}
    >
      <ReactNativeModal
        style={{ justifyContent: "flex-end", margin: 0 }}
        onBackdropPress={() => {
          setAreOptionsVisible(false);
        }}
        onModalHide={async () => {
          setLoading(true);
          if (onValueChange) await onValueChange(localValue);
          setLoading(false);
        }}
        backdropTransitionInTiming={0}
        backdropTransitionOutTiming={0}
        isVisible={areOptionsVisible}
        onBackButtonPress={() => {
          setAreOptionsVisible(false);
        }}
      >
        <ModalCardView style={{ maxHeight: "50%" }}>
          <View>
            <View
              style={{
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <View>
                {removeOption == true && localValue !== null ? (
                  <NameText style={{ color: "white" }}>Clear</NameText>
                ) : null}
              </View>
              <View>
                <AppText style={styles.titleText}>{title}</AppText>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setLocalValue(null);
                  setAreOptionsVisible(false);
                }}
              >
                {removeOption == true && localValue !== null ? (
                  <NameText style={{ color: "#ff3217" }}>Clear</NameText>
                ) : null}
              </TouchableOpacity>
            </View>

            <FlatList
              data={valueOptions}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setLocalValue(item);
                    setAreOptionsVisible(false);
                  }}
                  style={{
                    padding: scale(10),
                    backgroundColor: item === localValue ? "#cccccc" : "white",
                    borderRadius: scale(10),
                  }}
                >
                  <NameText
                    style={{
                      fontWeight: item === localValue ? "bold" : "normal",
                    }}
                  >
                    {item}
                  </NameText>
                </TouchableOpacity>
              )}
            />
          </View>
        </ModalCardView>
      </ReactNativeModal>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: scale(50),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon
            size={scale(20)}
            style={{ margin: scale(10) }}
            name={iconName}
          />
        </View>
        <NameText>{title}</NameText>
      </View>
      {loading ? <ActivityIndicator /> : <NameText>{value}</NameText>}
    </TouchableOpacity>
  );
};
