import React from 'react';
import {FlatList, View} from 'react-native';
import {scale} from 'react-native-size-matters';
import AppText from '../../../../components/AppText';
import gstyles from '../../../../styles';
import styles from './styles';
import FriendsListItem from '../../../../components/FriendsListItem';
import SearchListItem from '../SearchListItem';
import {useSelector} from 'react-redux';
import {getFacebookUid} from '../../../../utils';
import auth from '@react-native-firebase/auth';

const RecommendationsList = ({...props}) => {
  const facebookRecommendationsAllIds = useSelector(
    state => state.recommendations.facebook.allIds,
  );
  const renderItem = ({item}) => {
    console.warn(item);
    return <SearchListItem userId={item} />;
  };
  return (
    <View style={[gstyles.rootView]}>
      <View style={styles.titleContainer}>
        <AppText style={styles.suggested}>Suggested</AppText>
      </View>
      {true ? (
        <FlatList
          data={facebookRecommendationsAllIds}
          keyExtractor={(item, index) => String(item)}
          renderItem={renderItem}
        />
      ) : (
        <View style={gstyles.expandedCenterView}>
          <AppText>Hi</AppText>
        </View>
      )}
    </View>
  );
};

export default RecommendationsList;
