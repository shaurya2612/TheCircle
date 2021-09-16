import React from 'react';
import {useState} from 'react';
import {useEffect} from 'react';
import {
  ActivityIndicator,
  FlatList,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import {scale, verticalScale} from 'react-native-size-matters';
import {useDispatch, useSelector} from 'react-redux';
import AppText from '../../components/AppText';
import ModalCardView from '../../components/ModalCardView';
import NameText from '../../components/NameText';
import StreamsListItem, {
  StreamsListItemIcon,
} from '../../components/StreamsListItem';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import {joinStream, leaveStream} from '../../firebase/utils';
import {fetchAllStreams} from '../../store/actions/streams';
import styles from '../../styles';

export default StreamsListScreen = () => {
  const dispatch = useDispatch();
  const streams = useSelector(state => state.streams.streams);
  const [modalStream, setModalStream] = useState(null);
  const [modalButtonState, setModalButtonState] = useState('loading'); // loading || join || joined

  useEffect(() => {
    dispatch(fetchAllStreams());
  }, []);

  const subscribeToModalStreamChanges = () => {
    if (modalStream) {
      const db = database();
      const uid = auth().currentUser.uid;
      const dbRef = db
        .ref('/streamsubs')
        .child(uid)
        .child(modalStream.streamId);

      dbRef.on('value', snapshot => {
        if (snapshot.exists()) setModalButtonState('joined');
        else setModalButtonState('join');
      });
    }
  };

  const unsubscribeToModalStreamChanges = () => {
    if (modalStream) {
      const db = database();
      const uid = auth().currentUser.uid;
      const dbRef = db
        .ref('/streamsubs')
        .child(uid)
        .child(modalStream.streamId);
      dbRef.off();
    }
  };

  return (
    <View style={{...styles.rootView, backgroundColor: 'white'}}>
      <ReactNativeModal
        style={{justifyContent: 'flex-end', margin: 0}}
        onBackdropPress={() => {
          unsubscribeToModalStreamChanges();
          setModalButtonState('loading');
          setModalStream(null);
        }}
        onBackButtonPress={() => {
          unsubscribeToModalStreamChanges();
          setModalButtonState('loading');
          setModalStream(null);
        }}
        onModalWillShow={() => {
          subscribeToModalStreamChanges();
        }}
        isVisible={modalStream ? true : false}
        backdropTransitionInTiming={0}
        backdropTransitionOutTiming={0}>
        <ModalCardView
          style={{borderBottomLeftRadius: 0, borderBottomRightRadius: 0}}>
          <View>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <AppText style={styles.titleText}>Actions</AppText>
            </View>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <StreamsListItemIcon
                size={scale(100)}
                icon={modalStream?.icon}
                iconSize={scale(50)}
                style={{marginRight: scale(15)}}
              />
              <View>
                <NameText>{modalStream?.name}</NameText>
                <AppText style={styles.usernameText}>{`${
                  modalStream?.members ?? 'No'
                } Members`}</AppText>
              </View>
            </View>
          </View>
          <View style={{marginVertical: scale(10)}}>
            <AppText>{modalStream?.description}</AppText>
          </View>
          <TouchableOpacity
            disabled={modalButtonState === 'loading'}
            onPress={async () => {
              const currentState = modalButtonState;

              //ModalButtonState is changed after joining is complete via the listener
              if (currentState === 'join') {
                setModalButtonState('loading');
                await joinStream(modalStream.streamId);
              }
              if (currentState === 'joined') {
                setModalButtonState('loading');
                await leaveStream(modalStream.streamId);
              }
            }}
            style={{
              padding: scale(10),
              width: '100%',
              height: verticalScale(45),
              backgroundColor: modalButtonState === 'join' ? '#3490dc' : 'grey',
            }}>
            <View style={styles.expandedCenterView}>
              {modalButtonState === 'loading' ? (
                <ActivityIndicator color="white" size="large" />
              ) : (
                <AppText style={{color: 'white', fontSize: scale(15)}}>
                  {modalButtonState === 'join' ? 'Join' : 'Joined'}
                </AppText>
              )}
            </View>
          </TouchableOpacity>
        </ModalCardView>
      </ReactNativeModal>
      <FlatList
        data={streams}
        renderItem={({item}) => {
          return (
            <StreamsListItem
              icon={item.icon}
              name={item.name}
              members={item.members}
              onPress={() => {
                setModalStream(item);
              }}
            />
          );
        }}
      />
    </View>
  );
};
