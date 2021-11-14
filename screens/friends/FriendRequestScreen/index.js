import React, {useEffect, useState} from 'react';
import {Keyboard, TouchableWithoutFeedback, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {scale, verticalScale} from 'react-native-size-matters';
import {useDispatch, useSelector} from 'react-redux';
import AppText from '../../../components/AppText';
import FriendCard from '../../../components/FriendCard';
import SearchBar from '../../../components/SearchBar';
import {listenForRequests, loadMoreRequests} from '../../../store/actions/user';
import styles from '../../../styles';
import SearchListItem from '../SearchFriendsScreen/SearchListItem';
import RequestListItem from './RequestListItem';

const data = [
  {dp: 'https://picsum.photos/200/300', name: 'Chad'},
  {dp: 'https://picsum.photos/200/300', name: 'Chad'},
  {dp: 'https://picsum.photos/200/300', name: 'Chad'},
  {dp: 'https://picsum.photos/200/300', name: 'Chad'},
];

const FriendRequestsScreen = () => {
  const dispatch = useDispatch();
  let requestsAllIds = useSelector(state => state.user.requests.allIds);

  useEffect(() => {
    dispatch(listenForRequests());
  }, []);

  return (
    <View style={{...styles.rootView, backgroundColor: 'white'}}>
      <View style={{...styles.rootView}}>
        {(requestsAllIds || []).length > 0 ? (
          <FlatList
            data={requestsAllIds || []}
            // ListHeaderComponent={() => {
            //   return (
            //     <View
            //       style={{
            //         paddingHorizontal: scale(10),
            //         backgroundColor: 'white',
            //         marginBottom: scale(50),
            //         marginTop: verticalScale(10),
            //       }}>
            //       {/* <AppText style={styles.titleText}>Requests</AppText> */}
            //     </View>
            //   );
            // }}
            renderItem={({item}) => (
              <View
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <RequestListItem userId={item} />
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <View style={styles.expandedCenterView}>
            <AppText style={styles.nameText}>No requests !</AppText>
          </View>
        )}
      </View>
    </View>
  );
};

export default FriendRequestsScreen;
