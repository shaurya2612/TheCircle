import React, { useState } from "react";
import {
  ImageBackground,
  View,
  TouchableWithoutFeedback,
  ScrollView,
  Dimensions,
  FlatList,
  ActivityIndicator,
  Platform,
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import colors from "../constants/colors";
import styles from "../styles";
import {
  useSafeAreaInsets,
  SafeAreaView,
} from "react-native-safe-area-context";
import IconCircle from "../components/IconCircle";
import AppText from "../components/AppText";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMatchProfile,
  fetchName,
  fetchUser,
  fetchUserPhotos,
  fetchUserProfile,
} from "../store/actions/user";
import { useFocusEffect } from "@react-navigation/native";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import CustomSafeAreaView from "../components/CustomSafeAreaView";
import LinearGradient from "react-native-linear-gradient";

export const MatchProfileScreen = ({ scrollViewRef, onScroll, matchId }) => {
  const insets = useSafeAreaInsets();
  let { height, width } = Dimensions.get("window");
  height -= insets.top + insets.bottom;
  width -= insets.left + insets.right;

  const userState = useSelector((state) => state.user);
  const { currentMatchProfile } = userState;
  let { userPhotos, profile, name, age, id } = currentMatchProfile ?? {};

  userPhotos = (userPhotos || []).filter((item) => item !== null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMatchProfile(matchId));
    setSelectedIndex(0);
  }, [matchId]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const photoTabs = () => {
    let arr = [];
    var i;
    var j;
    for (var i = 0; i < selectedIndex + 1; i++) {
      arr.push(
        <View
          key={i.toString()}
          style={{
            flex: 1,
            height: "100%",
            backgroundColor: colors.primary,
            marginHorizontal: scale(0.5),
          }}
        ></View>
      );
    }
    for (var j = 0; j < userPhotos.length - i; j++) {
      arr.push(
        <View
          key={(i + j + 1).toString()}
          style={{
            flex: 1,
            height: "100%",
            backgroundColor: "#cccccc",
            marginHorizontal: scale(0.5),
          }}
        ></View>
      );
    }
    return (
      <View
        style={{
          flexDirection: "row",
          height: verticalScale(5),
          backgroundColor: "white",
        }}
      >
        {arr}
      </View>
    );
  };

  if (matchId !== id) {
    return (
      <View style={styles.expandedCenterView}>
        <ActivityIndicator color="black" size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      ref={scrollViewRef ?? null}
      onScroll={onScroll ?? null}
      snapToInterval={height}
      scrollEventThrottle={20}
      decelerationRate="fast"
      showsVerticalScrollIndicator={false}
    >
      <CustomSafeAreaView style={{ flex: 1 }}>
        <View>
          <View
            style={{
              height: height - verticalScale(40),
              width,
              borderRadius: scale(100),
            }}
          >
            {userPhotos ? (
              <View style={styles.rootView}>
                {/* Notch */}
                <View
                  style={{
                    height: verticalScale(25),
                    width: "100%",
                    backgroundColor: "white",
                    justifyContent: "center",
                    alignItems: "center",
                    borderTopRightRadius: scale(100),
                    borderLeftRightRadius: scale(100),
                    ...styles.elevation_small,
                  }}
                >
                  <FontAwesome5Icon name={"grip-lines"} size={scale(15)} />
                </View>

                {photoTabs()}

                <ImageBackground
                  imageStyle={{ resizeMode: "contain" }}
                  style={{ flexDirection: "row", flex: 1 }}
                  source={{ uri: userPhotos[selectedIndex] }}
                >
                  <LinearGradient
                    style={{ flexDirection: "row", flex: 1 }}
                    colors={["rgba(255, 255, 255, 0)", "rgba(0, 0, 0, 1)"]}
                    start={{ x: 0, y: 0 }}
                    end={{
                      x: 0,
                      y:
                        selectedIndex == 0
                          ? Platform.OS === "android"
                            ? 9
                            : 4
                          : 100,
                    }}
                  >
                    {selectedIndex === 0 ? (
                      <View
                        style={{ position: "absolute", top: "90%", left: "2%" }}
                      >
                        <AppText
                          style={{
                            fontSize: scale(32),
                            color: "white",
                            fontWeight: "bold",
                            textShadowColor: "rgba(0, 0, 0, 0.5)",
                            textShadowOffset: { width: -1, height: 1 },
                            textShadowRadius: 10,
                          }}
                        >
                          {`${name}, ${age}  `}
                        </AppText>
                      </View>
                    ) : null}

                    {/* /////////Left and right click to change picture////// */}
                    <TouchableWithoutFeedback
                      onPress={() => {
                        setSelectedIndex(
                          selectedIndex > 0 ? selectedIndex - 1 : 0
                        );
                      }}
                      style={{ flex: 1 }}
                    >
                      <View style={{ flex: 1 }}></View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback
                      onPress={() => {
                        setSelectedIndex(
                          selectedIndex < userPhotos.length - 1
                            ? selectedIndex + 1
                            : selectedIndex
                        );
                      }}
                      style={{ flex: 1 }}
                    >
                      <View style={{ flex: 1 }}></View>
                    </TouchableWithoutFeedback>
                    {/* ////////////////////////////////////////// */}
                  </LinearGradient>
                </ImageBackground>
              </View>
            ) : (
              <View style={styles.expandedCenterView}>
                <ActivityIndicator size={"large"} color={colors.primary} />
              </View>
            )}
          </View>

          {/* info page */}
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              overflow: "scroll",
            }}
          >
            {profile ? (
              <View>
                {profile.about ? (
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      padding: scale(20),
                      marginVertical: scale(20),
                    }}
                  >
                    <AppText style={{ fontSize: scale(20) }}>
                      {profile.about}
                    </AppText>
                  </View>
                ) : null}
                <View
                  style={{
                    ...styles.expandedCenterView,
                    paddingHorizontal: scale(20),
                    flexGrow: 1,
                    overflow: "scroll",
                  }}
                >
                  {/*IconCircles*/}
                  {profile.info ? (
                    <FlatList
                      numColumns={2}
                      data={Object.keys(profile.info)}
                      renderItem={({ item }) => (
                        <IconCircle
                          iconType={item}
                          label={profile.info[item]}
                        />
                      )}
                      columnWrapperStyle={{
                        justifyContent: "space-evenly",
                        alignContent: "center",
                        marginVertical: verticalScale(10),
                      }}
                    />
                  ) : null}
                </View>
              </View>
            ) : null}
          </View>
        </View>
      </CustomSafeAreaView>
    </ScrollView>
  );
};

export default MatchProfileScreen;
