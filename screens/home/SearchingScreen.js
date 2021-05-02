import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Button, View} from 'react-native';
import colors from '../../constants/colors';
import FormButton from '../../components/FormButton';
import styles from '../../styles';
import {useDispatch} from 'react-redux';
import {changeUserMatchingStatus} from '../../store/actions/matching';
import {scale} from 'react-native-size-matters';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import CustomSafeAreaView from '../../components/CustomSafeAreaView';
import LinearGradient from 'react-native-linear-gradient';
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from '@react-native-firebase/admob';
import {setErrorMessage} from '../../store/actions/error';

const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ['fashion', 'clothing'],
});

const SearchingScreen = () => {
  const dispatch = useDispatch();
  const [canCancel, setCanCancel] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const firestoreDb = firestore();
    const {uid} = auth().currentUser;
    const unsubscribe = firestoreDb
      .collection('waitingUsers')
      .doc(uid)
      .onSnapshot(snapshot => {
        if (snapshot.exists) setCanCancel(true);
        else setCanCancel(false);
      });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const eventListener = interstitial.onAdEvent(type => {
      if (type === AdEventType.LOADED) {
        setLoaded(true);
      }
      if (type === AdEventType.CLOSED) {
        setClosed(true);
        setLoaded(false);
      }
    });

    // Start loading the interstitial straight away
    interstitial.load();

    // Unsubscribe from events on unmount
    return () => {
      eventListener();
    };
  }, [closed]);

  if (!loaded) return null;

  return (
    <Button
      title="Show Interstitial"
      onPress={() => {
        interstitial.show();
      }}
    />
  );

  return (
    <LinearGradient
      style={styles.expandedCenterView}
      colors={[colors.primary, colors.accent]}>
      {loaded && !closed ? (
        interstitial.show()
      ) : (
        <ActivityIndicator size={'large'} color={'white'} />
      )}
      {/* {canCancel ? (
        <FormButton
          title={'Cancel'}
          onPress={() => {
            dispatch(changeUserMatchingStatus(0));
          }}
          style={{marginVertical: scale(30)}}
        />
      ) : null} */}
    </LinearGradient>
  );
};

export default SearchingScreen;
