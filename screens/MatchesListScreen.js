import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  FlatList,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {scale, verticalScale} from 'react-native-size-matters';
import AppText from '../components/AppText';
import AvatarCircle from '../components/AvatarCircle';
import ChatListItem from '../components/ChatListItem';
import styles from '../styles';
import Modal from 'react-native-modalbox';
// import Modal from 'react-native-modal';
import UserProfileScreen from './UserProfileScreen';
import {createRef} from 'react';
import SearchBar from '../components/SearchBar';
import {useDispatch, useSelector} from 'react-redux';
import colors from '../constants/colors';
import {listenForMatches} from '../store/actions/user';
import {setMatch} from '../store/actions/chat';
import MatchProfileScreen from './MatchProfileScreen';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
// const data = [
//   {
//     name: "Mila",
//     dp:
//       "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80",
//     lastMessage: null,
//   },
//   {
//     name: "Marilyn",
//     dp:
//       "https://images.unsplash.com/photo-1599200786358-4a661fb85b1e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
//     lastMessage: null,
//   },
//   {
//     name: "Andrea",
//     dp:
//       "https://images.unsplash.com/photo-1488716820095-cbe80883c496?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=666&q=80",
//     lastMessage: null,
//   },
//   {
//     name: "Mila",
//     dp:
//       "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80",
//     lastMessage: null,
//   },
//   {
//     name: "Marilyn",
//     dp:
//       "https://images.unsplash.com/photo-1599200786358-4a661fb85b1e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
//     lastMessage: null,
//   },
//   {
//     name: "Andrea",
//     dp:
//       "https://images.unsplash.com/photo-1488716820095-cbe80883c496?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=666&q=80",
//     lastMessage: null,
//   },
//   {
//     name: "Mila",
//     dp:
//       "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80",
//     lastMessage: "The quick brown fox jumps over",
//   },
//   {
//     name: "Marilyn",
//     dp:
//       "https://images.unsplash.com/photo-1599200786358-4a661fb85b1e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
//     lastMessage: "The quick brown fox jumps over",
//   },
//   {
//     name: "Andrea",
//     dp:
//       "https://images.unsplash.com/photo-1488716820095-cbe80883c496?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=666&q=80",
//     lastMessage: "The quick brown fox jumps over",
//   },
//   {
//     name: "Mila",
//     dp:
//       "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80",
//     lastMessage: "The quick brown fox jumps over",
//   },
//   {
//     name: "Marilyn",
//     dp:
//       "https://images.unsplash.com/photo-1599200786358-4a661fb85b1e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
//     lastMessage: "The quick brown fox jumps over",
//   },
//   {
//     name: "Andrea",
//     dp:
//       "https://images.unsplash.com/photo-1488716820095-cbe80883c496?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=666&q=80",
//     lastMessage: "The quick brown fox jumps over",
//   },
// ];

export const MatchesListScreen = props => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentMatchId, setCurrentMatchId] = useState(null);
  const matches = useSelector(state => state.user.matches);
  const listeningForMatches = useSelector(
    state => state.user.listeningForMatches,
  );
  const dispatch = useDispatch();
  const scrollViewRef = createRef();
  const modalRef = createRef();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    dispatch(listenForMatches(20));
  }, []);

  if (!listeningForMatches) {
    return (
      <View style={{...styles.expandedCenterView, backgroundColor: 'white'}}>
        <ActivityIndicator color={colors.primary} size={'large'} />
      </View>
    );
  }

  //This function helps in closing the scrollview modal whenever the offset is negative
  const handleOnScroll = event => {
    if (event.nativeEvent.contentOffset.y < -25) {
      setIsModalVisible(false);
      modalRef.current.close();
    }
  };

  return (
    <View style={{...styles.rootView, backgroundColor: 'white'}}>
      <Modal
        style={{margin: 0}}
        ref={modalRef}
        swipeToClose={true}
        swipeArea={verticalScale(25)} // The height in pixels of the swipeable area, window height by default
        swipeThreshold={50} // The threshold to reach in pixels to close the modal
        isOpen={isModalVisible}
        onClosed={() => {
          setIsModalVisible(false);
        }}
        backdropOpacity={0}
        isVisible={isModalVisible}>
        <MatchProfileScreen
          matchId={currentMatchId}
          scrollViewRef={scrollViewRef}
          onScroll={handleOnScroll}
        />
      </Modal>

      <View style={{paddingTop: insets.top}} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <SearchBar
          style={{width: '100%'}}
          placeholder="Search your matches"
        />

        {(matches || []).filter(item => {
          if (item.lastMessage === null && !item.hasPhoto) return true;
          else return false;
        }).length === 0 ? null : (
          <View>
            <View style={{padding: scale(10), backgroundColor: 'white'}}>
              <AppText style={styles.titleText}>Match queue</AppText>
            </View>
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={(matches || []).filter(item => {
                if (item.lastMessage === null) return true;
                else return false;
              })}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => {
                return (
                  <AvatarCircle
                    onPress={() => {
                      dispatch(setMatch(item));
                      props.navigation.navigate('ChatScreen');
                    }}
                    style={{
                      marginHorizontal: scale(5),
                      marginVertical: scale(10),
                    }}
                    size={100}
                    source={{uri: item.dp}}
                  />
                );
              }}
            />
          </View>
        )}
        <View>
          <FlatList
            data={matches}
            contentContainerStyle={{flexGrow: 1}}
            keyExtractor={(item, index) => item.id}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => {
              return (
                <View
                  style={{
                    paddingHorizontal: scale(10),
                    backgroundColor: 'white',
                  }}>
                  <AppText style={styles.titleText}>Conversations</AppText>
                </View>
              );
            }}
            renderItem={({item}) => {
              if (item.lastMessage || item.hasPhoto)
                return (
                  <ChatListItem
                    onPressAvatar={() => {
                      setCurrentMatchId(item.id);
                      modalRef.current.open();
                      setIsModalVisible(true);
                    }}
                    onPress={() => {
                      dispatch(setMatch(item));
                      props.navigation.navigate('ChatScreen');
                    }}
                    id={item.id}
                    imageUri={item.dp}
                    name={item.name}
                    label={item.unseen}
                    lastMessage={
                      item.hasPhoto ? (
                        <View style={{flexDirection: 'row'}}>
                          <Icon
                            style={{marginRight: scale(5)}}
                            name={'camera'}
                            size={15}
                          />
                          <AppText>Photo</AppText>
                        </View>
                      ) : item.lastMessage.length > 15 ? (
                        item.lastMessage.substring(0, 16) + '...'
                      ) : (
                        item.lastMessage
                      )
                    }
                  />
                );
              else return null;
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default MatchesListScreen;
