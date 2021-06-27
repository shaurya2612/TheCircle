import React from 'react';
import {useState} from 'react';
import {useEffect} from 'react';
import {
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
import {fetchAllStreams} from '../../store/actions/streams';
import styles from '../../styles';

export default StreamsListScreen = () => {
  const dispatch = useDispatch();
  const streams = useSelector(state => state.streams.streams);
  const [modalStream, setModalStream] = useState(null);

  useEffect(() => {
    dispatch(fetchAllStreams());
  }, []);

  return (
    <View style={{...styles.rootView, backgroundColor: 'white'}}>
      <ReactNativeModal
        style={{justifyContent: 'flex-end', margin: 0}}
        onBackdropPress={() => setModalStream(null)}
        onBackButtonPress={() => setModalStream(null)}
        onModalHide={() => {
          setModalStream(null);
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
                <AppText style={styles.usernameText}>{'Members count'}</AppText>
              </View>
            </View>
          </View>
          <View style={{marginVertical: scale(10)}}>
            <AppText>{modalStream?.description}</AppText>
          </View>
          <TouchableOpacity
          onPress={async () => {
            if (!modalStream) return;
            // await unfriend(modalUser.id);
            // setIsModalVisible(false);
          }}
          style={{
            padding: scale(10),
            width: '100%',
            height: verticalScale(45),
            backgroundColor: '#3490dc',
          }}>
          <View style={styles.expandedCenterView}>
            <AppText style={{color: 'white', fontSize: scale(15)}}>
              {'Join'}
            </AppText>
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
