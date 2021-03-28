import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
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
      <ActivityIndicator size={'large'} color={'white'} />
      {canCancel ? (
        <FormButton
          title={'Cancel'}
          onPress={() => {
            dispatch(changeUserMatchingStatus(0));
          }}
          style={{marginVertical: scale(30)}}
        />
      ) : null}
    </LinearGradient>
  );
};

export default SearchingScreen;
