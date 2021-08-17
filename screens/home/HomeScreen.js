import React, {useState} from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import styles from '../../styles';
import * as Animatable from 'react-native-animatable';
import {scale, verticalScale} from 'react-native-size-matters';
import AppText from '../../components/AppText';
import HomeStatCard from '../../components/homeStatCard/HomeStatCard';
import StartMatchingButton from '../../components/StartMatchingButton';
import CustomSafeAreaView from '../../components/CustomSafeAreaView';
import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchUser, listenForUserStats} from '../../store/actions/user';
import {
  changeUserMatchingStatus,
  listenForUserMatchingStatus,
  SET_USER_MATCHING_STATUS,
} from '../../store/actions/matching';
import SearchingScreen from './SearchingScreen';
import ChatScreen from '../matches/ChatScreen';
import AnonymousChatScreen from './AnonymousChatScreen';
import colors from '../../constants/colors';
import LinearGradient from 'react-native-linear-gradient';
import CocentricCircles from '../../components/svgs/CocentricCircles';
import TheCircleLoading from '../../components/svgs/TheCircleLoading';
import ReactNativeModal from 'react-native-modal';
import ModalCardView from '../../components/ModalCardView';
import AvatarCircle from '../../components/AvatarCircle';
import HowItWorksScreen from './HowItWorksScreen';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

const HomeScreen = props => {
  const userState = useSelector(state => state.user);
  const loadingState = useSelector(state => state.loading);
  const matchingState = useSelector(state => state.matching);
  const {dp, stats} = userState;
  const {signingUp, loadingAd} = loadingState;
  const {matchingStatus} = matchingState;
  const dispatch = useDispatch();
  const isItsAMatchModalVisible = useSelector(
    state => state.loading.isItsAMatchModalVisible,
  );
  const [isHowItWorksModalVisible, setIsHowItWorksModalVisible] = useState(
    false,
  );

  useEffect(() => {
    if (!signingUp) {
      dispatch(fetchUser());
      dispatch(listenForUserMatchingStatus());
      dispatch(listenForUserStats());
    }
  }, [signingUp]);

  const renderContent = () => {
    //matching off
    if (matchingStatus === 0)
      return (
        <Animatable.View style={styles.rootView} animation={'fadeIn'}>
          <LinearGradient
            colors={[colors.primary, colors.accent]}
            style={{
              ...styles.rootView,
              backgroundColor: 'white',
            }}>
            <TouchableOpacity
              style={{
                position: 'absolute',
                alignSelf: 'flex-end',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                padding: scale(10),
              }}
              onPress={() => {
                setIsHowItWorksModalVisible(true);
              }}>
              <AppText style={{color: 'white'}}>Help</AppText>
              <FontAwesome5Icon
                size={scale(15)}
                style={{marginHorizontal: scale(5), color: 'white'}}
                name="question"
              />
            </TouchableOpacity>

            <ReactNativeModal
              backdropTransitionOutTiming={0}
              useNativeDriver={true}
              onBackButtonPress={() => setIsHowItWorksModalVisible(false)}
              isVisible={isHowItWorksModalVisible}
              style={{margin: 0}}>
              <HowItWorksScreen
                onPressX={() => {
                  setIsHowItWorksModalVisible(false);
                }}
              />
            </ReactNativeModal>
            <View style={{flex: 1}} />
            <View
              style={{
                ...styles.expandedCenterView,
              }}>
              <Animatable.View animation={'fadeInUp'}>
                <HomeStatCard
                  friends={stats?.friends}
                  matches={stats?.matches}
                />
              </Animatable.View>
            </View>
            <Animatable.View
              animation={'fadeInUp'}
              style={styles.expandedCenterView}>
              <Animatable.View iterationCount="infinite" animation="pulse">
                <StartMatchingButton
                  title="START MATCHING !"
                  onPress={() => {
                    dispatch(changeUserMatchingStatus(0.5));
                    dispatch(changeUserMatchingStatus(1));
                  }}
                />
              </Animatable.View>
            </Animatable.View>
          </LinearGradient>
        </Animatable.View>
      );
    //matching on
    else if (matchingStatus === 1) return <SearchingScreen />;
    //in chat room
    else if (matchingStatus === 2 || matchingStatus === 3)
      return <AnonymousChatScreen />;
    else
      return (
        <LinearGradient
          colors={[colors.primary, colors.accent]}
          style={styles.expandedCenterView}>
          <TheCircleLoading height={scale(100)} width={scale(100)} />
        </LinearGradient>
      );
  };

  if (loadingAd)
    return (
      <LinearGradient
        colors={[colors.primary, colors.accent]}
        style={styles.expandedCenterView}>
        <TheCircleLoading />
        <AppText style={{color: 'white', textAlign: 'center'}}>
          Loading Ad...
        </AppText>
      </LinearGradient>
    );

  return (
    <View style={styles.rootView}>
      <CustomSafeAreaView style={styles.rootView}>
        <ReactNativeModal
          isVisible={isItsAMatchModalVisible}
          backdropTransitionInTiming={0}
          backdropTransitionOutTiming={0}
          useNativeDriver={true}
          hasBackdrop={true}
          onBackdropPress={() => {
            setIsModalVisible(false);
          }}
          onBackButtonPress={() => {
            setIsModalVisible(false);
          }}>
          <ModalCardView>
            {/* It's a match */}
            <View></View>
            <View style={{flexDirection: 'row'}}>
              <AvatarCircle />
              <AvatarCircle />
            </View>
            {/* See who it is */}
            <View></View>
          </ModalCardView>
        </ReactNativeModal>
        {renderContent()}
      </CustomSafeAreaView>
    </View>
  );
};

export default HomeScreen;
