import React from 'react';
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
} from '../../store/actions/matching';
import SearchingScreen from './SearchingScreen';
import ChatScreen from '../ChatScreen';
import AnonymousChatScreen from './AnonymousChatScreen';
import colors from '../../constants/colors';
import LinearGradient from 'react-native-linear-gradient';

const HomeScreen = props => {
  const userState = useSelector(state => state.user);
  const loadingState = useSelector(state => state.loading);
  const matchingState = useSelector(state => state.matching);
  const {dp, stats} = userState;
  const {signingUp} = loadingState;
  const {matchingStatus} = matchingState;
  const dispatch = useDispatch();

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
            }}
            source={{
              uri: dp,
            }}
            blurRadius={Platform.OS === 'android' ? 4 : 12}>
            <View style={{flex: 1}} />
            <View
              style={{
                ...styles.expandedCenterView,
              }}>
              <Animatable.View animation={'fadeInUp'}>
                <HomeStatCard friends={stats?.friends} matches={stats?.matches} />
              </Animatable.View>
            </View>
            <Animatable.View
              animation={'fadeInUp'}
              style={styles.expandedCenterView}>
              <Animatable.View iterationCount="infinite" animation="pulse">
                <StartMatchingButton
                  title="START MATCHING !"
                  onPress={() => {
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
          <ActivityIndicator size="large" color={'white'} />
        </LinearGradient>
      );
  };

  useEffect(() => {
    console.log('matchingStatus', matchingStatus);
  }, [matchingStatus]);

  return (
    <View style={styles.rootView}>
      <CustomSafeAreaView style={styles.rootView}>
        {renderContent()}
      </CustomSafeAreaView>
    </View>
  );
};

export default HomeScreen;
