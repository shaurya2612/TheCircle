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
import TheCircleLoading from '../../components/svgs/TheCircleLoading';
import AppText from '../../components/AppText';

const SearchingScreen = () => {
  const dispatch = useDispatch();
  const [canCancel, setCanCancel] = useState(false);

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

  return (
    <LinearGradient
      style={styles.expandedCenterView}
      colors={[colors.primary, colors.accent]}>
      <TheCircleLoading height={scale(100)} width={scale(100)} />
      <AppText style={{color: 'white', textAlign: 'center'}}>
        {canCancel
          ? "You've been put in the waiting list...\n We will notify you as soon as we find someone."
          : 'Searching for a match...'}
      </AppText>
      {canCancel ? (
        <FormButton
          title={'Cancel'}
          onPress={() => {
            dispatch(changeUserMatchingStatus(0));
          }}
          style={{position: 'absolute', bottom: '30%'}}
        />
      ) : null}
    </LinearGradient>
  );
};

export default SearchingScreen;
