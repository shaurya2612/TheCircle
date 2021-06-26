import React, {useEffect} from 'react';
import {useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import {scale, verticalScale} from 'react-native-size-matters';
import AppText from '../../components/AppText';
import ModalCardView from '../../components/ModalCardView';
import FriendsListItem from '../../components/FriendsListItem';
import SearchBar from '../../components/SearchBar';
import styles from '../../styles';
import NameText from '../../components/NameText';
import {useDispatch, useSelector} from 'react-redux';
import {listenForFriends, loadMoreFriends} from '../../store/actions/user';
import {unfriend} from '../../firebase/utils';
import colors from '../../constants/colors';
import LinearGradient from 'react-native-linear-gradient';
import AvatarCircle from '../../components/AvatarCircle';

const dummyData = [
  {
    name: 'Dave',
    dp:
      'https://images.unsplash.com/photo-1599476912965-4be339dabe7e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80',
    id: 'dummyUid0',
    username: 'something',
  },
  {
    name: 'Dave',
    dp:
      'https://images.unsplash.com/photo-1599476912965-4be339dabe7e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80',
    id: 'dummyUid1',
    username: 'something',
  },
];

const FriendsScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalUser, setModalUser] = useState(null);

  const {friends, canLoadMoreFriends, listeningForFriends} = useSelector(
    state => state.user,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listenForFriends(10));
  }, []);

  if (!listeningForFriends) {
    return (
      <View style={{...styles.expandedCenterView, backgroundColor: 'white'}}>
        <ActivityIndicator color={colors.primary} size={'large'} />
      </View>
    );
  }

  return (
    <View style={{...styles.rootView, backgroundColor: 'white'}}>

      {/* Actions Modal  */}
      <ReactNativeModal
        style={{justifyContent: 'flex-end', margin: 0}}
        onBackdropPress={() => setIsModalVisible(false)}
        onModalHide={() => {
          setModalUser(null);
        }}
        isVisible={isModalVisible}
        backdropTransitionInTiming={0}
        backdropTransitionOutTiming={0}>
        <ModalCardView>
          <View>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <AppText style={styles.titleText}>Actions</AppText>
            </View>
            {/* <FriendsListItem
                onPress={() => {
                  setModalUser(item);
                  setIsModalVisible(true);
                }}
                imageUri={modalUser?.dp}
                name={modalUser?.name}
                userId={modalUser?.id}
                username={'@' + modalUser?.username}
              /> */}
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <AvatarCircle
                disabled={true}
                source={{uri: modalUser?.dp}}
                size={scale(100)}
                style={{marginRight: scale(15)}}
              />
              <View>
                <NameText>{modalUser?.name}</NameText>
                <AppText style={styles.usernameText}>
                  {'@' + modalUser?.username}
                </AppText>
              </View>
            </View>
            <TouchableOpacity
              onPress={async () => {
                if (!modalUser) return;
                await unfriend(modalUser.id);
                setIsModalVisible(false);
              }}
              style={{padding: scale(10)}}>
              <NameText style={{color: '#ff3217'}}>Unfriend</NameText>
            </TouchableOpacity>
          </View>
        </ModalCardView>
      </ReactNativeModal>

      {(friends || []).length > 0 ? (
        <FlatList
          data={friends}
          // onEndReachedThreshold={0}
          // onEndReached={() => {
          //   if (canLoadMoreFriends) dispatch(loadMoreFriends(10));
          // }}
          showsVerticalScrollIndicator={false}
          // ListHeaderComponent={() => {
          //   return (
          //     <View colors={[colors.primary, colors.accent]}>
          //       <View
          //         style={{
          //           paddingHorizontal: scale(10),
          //           marginVertical: verticalScale(10),
          //         }}>
          //         <AppText style={{...styles.titleText, color:"white"}}>Friends</AppText>
          //       </View>
          //     </View>
          //   );
          // }}
          renderItem={({item}) => {
            return (
              <FriendsListItem
                onPress={() => {
                  setModalUser(item);
                  setIsModalVisible(true);
                }}
                imageUri={item.dp}
                name={item.name}
                userId={item.id}
                username={'@' + item.username}
              />
            );
          }}
        />
      ) : (
        <View style={styles.expandedCenterView}>
          <AppText style={styles.nameText}>No friends yet !</AppText>
          <AppText style={styles.labelText}>
            Tip: Try searching for friends
          </AppText>
        </View>
      )}
    </View>
  );
};

export default FriendsScreen;
