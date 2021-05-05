import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  TouchableWithoutFeedback,
  View,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {scale, verticalScale} from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import AppText from '../../components/AppText';
import FriendCard from '../../components/FriendCard';
import SearchBar from '../../components/SearchBar';
import styles from '../../styles';
import FormButton from '../../components/FormButton';
import {
  searchFriendByUsername,
  searchFriendsByNameOrUsername,
} from '../../firebase/utils';
import {useDispatch, useSelector} from 'react-redux';
import {setSearchingForFriends} from '../../store/actions/loading';
import {setErrorMessage} from '../../store/actions/error';
import FriendsListItem from '../../components/FriendsListItem';
import {TouchableOpacity} from 'react-native-gesture-handler';
import ReactNativeModal from 'react-native-modal';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

const SearchFriendsScreen = () => {
  const loadingState = useSelector(state => state.loading);
  const searchingForFriends = loadingState.searchingForFriends;
  const [friends, setFriends] = useState(null);
  const [nameOrUsername, setNameOrUsername] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalUser, setModalUser] = useState(null);
  const [isFriend, setIsFriend] = useState(null);
  const [inRequests, setInRequests] = useState(null);
  const [sentRequest, setSentRequest] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!modalUser) return;
    const db = database();

    const listenForChanges = () => {
      //listen for change in relation with current Modal User

      //Checking if modal user is my friend
      db.ref('/friends')
        .child(auth().currentUser.uid)
        .child(modalUser.id)
        .on('value', snapshot => {
          if (snapshot.exists()) setIsFriend(true);
          else setIsFriend(false);
        });

      //Checking if modal user is in my requests (could be done on the client side)
      db.ref('/requests')
        .child(auth().currentUser.uid)
        .child(modalUser.id)
        .on('value', snapshot => {
          if (snapshot.exists()) setInRequests(true);
          else setInRequests(false);
        });

      //Checking if I sent a request to modal user
      db.ref('/requests')
        .child(modalUser.id)
        .child(auth().currentUser.uid)
        .on('value', snapshot => {
          if (snapshot.exists()) setSentRequest(true);
          else setSentRequest(false);
        });
    };
    listenForChanges();
  }, [modalUser]);

  useEffect(() => {
    if (!modalUser || isModalVisible) return;
    const db = database();

    //Close all listening connections
    db.ref('/friends').child(auth().currentUser.uid).child(modalUser.id).off();

    db.ref('/requests')
      .child(auth().currentUser.uid)
      .orderByValue()
      .equalTo(modalUser.id)
      .off();

    db.ref('/requests')
      .child(modalUser.id)
      .orderByValue()
      .equalTo(auth().currentUser.uid)
      .off();

    //reinitailize state
    setIsFriend(null);
    setInRequests(null);
    setSentRequest(null);
    setModalUser(null);
  }, [isModalVisible]);

  useEffect(() => {
    if (isFriend === null || inRequests === null || sentRequest === null) {
      setCheckingStatus(true);
    } else setCheckingStatus(false);
  }, [isFriend, inRequests, sentRequest]);

  const searchFriendHandler = async () => {
    if (nameOrUsername.trim().length === 0) {
      setFriends(null);
      return;
    }
    try {
      dispatch(setSearchingForFriends(true));
      let friends = await searchFriendsByNameOrUsername(
        nameOrUsername.trim(),
        10,
      );
      setFriends(friends);
      dispatch(setSearchingForFriends(false));
    } catch (err) {
      dispatch(setErrorMessage(err.message));
      dispatch(setSearchingForFriends(false));
      setFriends(null);
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsKeyboardVisible(true); // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  return (
    <View style={{...styles.rootView, backgroundColor: 'white'}}>
      <ReactNativeModal
        style={{justifyContent: 'center', alignItems: 'center', margin: 0}}
        onBackdropPress={() => setIsModalVisible(false)}
        isVisible={isModalVisible}
        backdropTransitionInTiming={0}
        backdropTransitionOutTiming={0}>
        <FriendCard
          imageUri={modalUser?.dp}
          userId={modalUser?.id}
          name={modalUser?.name}
          username={'@' + modalUser?.username}
          age={modalUser?.age}
          type={
            checkingStatus
              ? 'loading'
              : isFriend
              ? 'isFriend'
              : sentRequest
              ? 'sentRequest'
              : inRequests
              ? 'inRequests'
              : 'add'
          }
        />
      </ReactNativeModal>
      <SearchBar
        onSubmitEditing={() => {
          searchFriendHandler();
        }}
        value={nameOrUsername}
        onChangeText={newUsername => {
          setNameOrUsername(newUsername);
        }}
        placeholder="Name or username"
      />
      <View
        style={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <FormButton
          onPress={() => {
            searchFriendHandler();
            Keyboard.dismiss();
          }}
          style={{width: '70%'}}
          title="Search"
        />
      </View>

      <View style={{...styles.rootView, paddingTop: scale(20)}}>
        {!isKeyboardVisible && nameOrUsername.trim() !== '' ? (
          searchingForFriends ? (
            <View style={styles.expandedCenterView}>
              <ActivityIndicator size="large" color="black" />
            </View>
          ) : friends !== null ? (
            <FlatList
              data={friends}
              renderItem={({item}) => (
                <View>
                  <View
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <FriendsListItem
                      imageUri={item.dp}
                      userId={item.id}
                      name={item.name}
                      username={'@' + item.username}
                      age={item.age}
                      onPress={() => {
                        setModalUser(item);
                        setIsModalVisible(true);
                      }}
                    />
                  </View>
                </View>
              )}
            />
          ) : (
            //When there is either an error or no results
            <View style={styles.expandedCenterView}>
              <View style={styles.centerView}>
                <AppText style={styles.titleText}>Oops !</AppText>
                <Image
                  source={require('../../assets/stumble.png')}
                  style={{resizeMode: 'contain'}}
                />
                <AppText style={{...styles.nameText, textAlign: 'center'}}>
                  No matching results
                </AppText>
                <AppText style={{...styles.labelText, textAlign: 'center'}}>
                  Please check your search or try again later.
                </AppText>
              </View>
            </View>
          )
        ) : (
          //When keyboard is visible or searchBar is empty
          <TouchableWithoutFeedback
            style={{...styles.rootView, backgroundColor: 'blue'}}
            onPress={() => {
              Keyboard.dismiss();
            }}>
            <View />
          </TouchableWithoutFeedback>
        )}
      </View>
    </View>
  );
};

export default SearchFriendsScreen;
