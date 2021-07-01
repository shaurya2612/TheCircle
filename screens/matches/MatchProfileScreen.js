import React, {useCallback, useState} from 'react';
import {
  ImageBackground,
  View,
  TouchableWithoutFeedback,
  ScrollView,
  Dimensions,
  FlatList,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import colors from '../../constants/colors';
import styles from '../../styles';
import {useSafeAreaInsets, SafeAreaView} from 'react-native-safe-area-context';
import AppText from '../../components/AppText';
import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchMatchProfile,
  fetchName,
  fetchUser,
  fetchUserPhotos,
  fetchUserProfile,
} from '../../store/actions/user';
import {useFocusEffect} from '@react-navigation/native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import CustomSafeAreaView from '../../components/CustomSafeAreaView';
import LinearGradient from 'react-native-linear-gradient';
import {infoIconColors} from '../../constants/infoIconsConfig';
import Icon from 'react-native-vector-icons/Feather';
import InfoPill from '../../components/InfoPill';

export const MatchProfileScreen = ({
  scrollViewRef,
  onScroll,
  matchId,
  onPressX,
}) => {
  const insets = useSafeAreaInsets();
  let {height, width} = Dimensions.get('screen');
  height -= insets.top + insets.bottom;
  width -= insets.left + insets.right;

  const userState = useSelector(state => state.user);
  const {currentMatchProfile} = userState;
  let {userPhotos, profile, name, age, id} = currentMatchProfile ?? {};

  userPhotos = (userPhotos || []).filter(item => item !== null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMatchProfile(matchId));
    setSelectedIndex(0);
  }, [matchId]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(false);
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
            height: '100%',
            backgroundColor: colors.primary,
            marginHorizontal: scale(0.5),
          }}></View>,
      );
    }
    for (var j = 0; j < userPhotos.length - i; j++) {
      arr.push(
        <View
          key={(i + j + 1).toString()}
          style={{
            flex: 1,
            height: '100%',
            backgroundColor: '#cccccc',
            marginHorizontal: scale(0.5),
          }}></View>,
      );
    }
    return (
      <View
        style={{
          flexDirection: 'row',
          height: verticalScale(5),
          backgroundColor: 'white',
        }}>
        {arr}
      </View>
    );
  };

  const generateInfoPills = useCallback(() => {
    let arr = [];
    const infoKeys = Object.keys(profile.info);
    const n = infoKeys.length;

    for (var i = 0; i < n; i++) {
      arr.push(
        <InfoPill
          iconType={infoKeys[i]}
          text={profile.info[infoKeys[i]]}
          contentColor={infoIconColors[infoKeys[i]].contentColor}
          backgroundColor={infoIconColors[infoKeys[i]].backgroundColor}
        />,
      );
    }
    return arr;
  }, [profile?.info]);

  if (matchId !== id) {
    return (
      <View style={styles.expandedCenterView}>
        <ActivityIndicator color="black" size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      ref={scrollViewRef ?? null}
      onScroll={onScroll ?? null}
      snapToInterval={height}
      scrollEventThrottle={20}
      decelerationRate="fast"
      showsVerticalScrollIndicator={false}>
      <CustomSafeAreaView style={{flex: 1}}>
        <View>
          <View
            style={{
              height: height - verticalScale(100),
              width,
              borderRadius: scale(100),
            }}>
            {userPhotos ? (
              <View style={styles.rootView}>
                {/* Notch */}
                <View
                  style={{
                    height: verticalScale(25),
                    width: '100%',
                    backgroundColor: 'white',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    ...styles.elevation_small,
                  }}>
                  <Icon
                    style={{marginHorizontal: scale(2)}}
                    onPress={onPressX}
                    name={'x'}
                    size={scale(20)}
                  />
                </View>

                {photoTabs()}

                <ImageBackground
                  imageStyle={{resizeMode: 'cover'}}
                  style={{flexDirection: 'row', flex: 1}}
                  onLoadStart={() => {
                    setImageLoading(true);
                  }}
                  onLoadEnd={() => {
                    setImageLoading(false);
                  }}
                  onLoad={() => {
                    setImageLoading(false);
                  }}
                  source={{uri: userPhotos[selectedIndex]}}>
                  <View style={{flexDirection: 'row', flex: 1}}>
                    {/* /////////Left and right click to change picture////// */}
                    <TouchableWithoutFeedback
                      onPress={() => {
                        setSelectedIndex(
                          selectedIndex > 0 ? selectedIndex - 1 : 0,
                        );
                      }}
                      style={{flex: 1}}>
                      <View style={{flex: 1}}></View>
                    </TouchableWithoutFeedback>
                    {imageLoading ? (
                      <ActivityIndicator
                        color={colors.primary}
                        size="large"
                      />
                    ) : null}
                    <TouchableWithoutFeedback
                      onPress={() => {
                        setSelectedIndex(
                          selectedIndex < userPhotos.length - 1
                            ? selectedIndex + 1
                            : selectedIndex,
                        );
                      }}
                      style={{flex: 1}}>
                      <View style={{flex: 1}}></View>
                    </TouchableWithoutFeedback>
                    {/* ////////////////////////////////////////// */}
                  </View>
                </ImageBackground>
              </View>
            ) : (
              <View style={styles.expandedCenterView}>
                <ActivityIndicator size={'large'} color={colors.primary} />
              </View>
            )}
          </View>

          <View>
            {/* Name and age */}
            <View
              style={{
                height: verticalScale(60),
                justifyContent: 'center',
                paddingHorizontal: scale(10),
                paddingVertical: scale(2),
                borderTopWidth: scale(0.2),
                borderBottomWidth: scale(0.2),
                borderColor: '#cccccc',
              }}>
              {/* {onMessageIconPress ? (
                <TouchableWithoutFeedback
                  onPress={onMessageIconPress}
                  style={{
                    ...styles.centerView,
                    position: 'absolute',
                    height: scale(50),
                    width: scale(50),
                    borderRadius: scale(100),
                    left: '85%',
                    bottom: '60%',
                  }}>
                  <LinearGradient
                    colors={[colors.primary, colors.accent]}
                    style={{
                      ...styles.centerView,
                      position: 'absolute',
                      height: scale(50),
                      width: scale(50),
                      borderRadius: scale(100),
                      left: '85%',
                      bottom: '60%',
                    }}>
                    <Icon name="message" color="white" size={scale(20)} />
                  </LinearGradient>
                </TouchableWithoutFeedback>
              ) : null} */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <AppText>
                  <AppText
                    style={{
                      ...styles.titleText,
                      fontWeight: 'bold',
                    }}>{`${name}`}</AppText>
                  <View style={{width: scale(5)}} />
                  <AppText style={{fontSize: scale(20)}}>{age}</AppText>
                </AppText>
              </View>
            </View>

            {/* New Info Circles */}
            {Object.keys(profile?.info || {}).length > 0 ? (
              <View
                style={{
                  paddingHorizontal: scale(7.5),
                  paddingVertical: scale(10),
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                }}>
                {generateInfoPills()}
              </View>
            ) : null}

            {/* info page */}
            <View
              style={{
                overflow: 'scroll',
              }}>
              {profile ? (
                <View style={{width: '100%'}}>
                  {profile.about ? (
                    <View>
                      <View
                        style={{
                          justifyContent: 'center',
                          // alignItems: 'center',
                          padding: scale(10),
                        }}>
                        <AppText style={{fontSize: scale(15), color: 'grey'}}>
                          {profile.about}
                        </AppText>
                      </View>
                      {/* <View
                        style={{
                          marginVertical: scale(5),
                          width: '90%',
                          alignSelf: 'center',
                          height: scale(0.5),
                          backgroundColor: 'black',
                        }}
                      /> */}
                    </View>
                  ) : null}
                  {/* Old Icon Circles can be placed here */}
                </View>
              ) : null}
            </View>
          </View>
        </View>
      </CustomSafeAreaView>
    </ScrollView>
  );
};

export default MatchProfileScreen;
