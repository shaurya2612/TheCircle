import LinearGradient from "react-native-linear-gradient";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import Icon from "react-native-vector-icons/Feather";
import { useDispatch, useSelector } from "react-redux";
import AppText from "../components/AppText";
import CustomHeader from "../components/CustomHeader";
import CustomSafeAreaView from "../components/CustomSafeAreaView";
import { fetchMatchCueCards } from "../store/actions/chat";
import { fetchFOFCueCards } from "../store/actions/matching";
import questions from "../constants/questions";
import styles from "../styles";

const CueCardsScreen = ({ matchMode, FOFMode, onPressX, ...props }) => {
  const currentMatch = useSelector((state) => state.chat.match);
  const matchCueCards = useSelector((state) => state.chat.matchCueCards);
  const currentFOF = useSelector((state) => state.matching.FOF);
  const FOFCueCards = useSelector((state) => state.matching.FOFCueCards);
  const dispatch = useDispatch();

  useEffect(() => {
    if (matchMode === true) dispatch(fetchMatchCueCards());
  }, [currentMatch]);

  useEffect(() => {
    if (FOFMode === true) dispatch(fetchFOFCueCards());
  }, [currentFOF]);

  const renderContent = () => {
    if (matchMode && matchCueCards === null) {
      return (
        <View style={styles.expandedCenterView}>
          <ActivityIndicator color="white" size="large" />
        </View>
      );
    }
    if (matchMode && matchCueCards?.length === 0)
      return (
        <View style={styles.expandedCenterView}>
          <AppText style={{ color: "white" }}>Nothing much to show</AppText>
        </View>
      );

    if (FOFMode && FOFCueCards === null) {
      return (
        <View style={styles.expandedCenterView}>
          <ActivityIndicator color="white" size="large" />
        </View>
      );
    }

    if (FOFMode && FOFCueCards?.length === 0)
      return (
        <View style={styles.expandedCenterView}>
          <AppText style={{ color: "white" }}>Nothing much to show</AppText>
        </View>
      );
    else
      return (
        <FlatList
          data={matchMode ? matchCueCards : FOFCueCards}
          renderItem={({ item }) => (
            <View
              style={{
                minHeight: scale(200),
                minWidth: "50%",
                borderRadius: scale(20),
                backgroundColor: "white",
                margin: scale(10),
                overflow: "hidden",
                ...styles.elevation_medium,
              }}
            >
              {/* Question  */}
              <View
                style={{
                  backgroundColor: "#6A82FB",
                  paddingVertical: scale(20),
                  paddingHorizontal: scale(10),
                }}
              >
                <View>
                  <AppText
                    style={{
                      fontSize: scale(18),
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    {questions[item.qid]}
                  </AppText>
                </View>
              </View>

              {/* Answer */}
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  paddingHorizontal: scale(10),
                  paddingVertical: scale(20),
                }}
              >
                <AppText
                  style={{
                    fontSize: scale(15),
                    color: "black",
                    textAlign: "justify",
                    lineHeight: verticalScale(20),
                    // fontWeight: "bold",
                  }}
                >
                  {item.ans}
                </AppText>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.qid.toString()}
        />
      );
  };

  return (
    <CustomSafeAreaView style={styles.rootView}>
      <LinearGradient colors={["#FC5C7D", "#6A82FB"]} style={styles.rootView}>
        <CustomHeader style={{ height: verticalScale(40) }}>
          <View
            style={{
              width: scale(40),
              justifyContent: "center",
              height: "100%",
              alignItems: "center",
            }}
          />
          <View
            style={{
              flex: 1,
              paddingHorizontal: scale(10),
              overflow: "hidden",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
            }}
          >
            <AppText
              style={{
                fontSize: scale(18),
                color: "white",
              }}
            >
              {`${matchMode ? currentMatch.name : "Stranger"}'s Cue`}
            </AppText>
          </View>
          <TouchableOpacity
            onPress={onPressX}
            style={{
              width: scale(40),
              justifyContent: "center",
              height: "100%",
              alignItems: "center",
            }}
          >
            <Icon color={"white"} name={"x"} size={scale(20)} />
          </TouchableOpacity>
        </CustomHeader>
        {renderContent()}
      </LinearGradient>
    </CustomSafeAreaView>
  );
};

export default CueCardsScreen;
