import React from 'react';
import {FlatList, View} from 'react-native';
import {scale} from 'react-native-size-matters';
import AppText from '../../../../components/AppText';
import gstyles from '../../../../styles';
import styles from './styles';
import FriendsListItem from '../../../../components/FriendsListItem';
import SearchListItem from '../SearchListItem';
import {useSelector} from 'react-redux';

const RecommendationsList = ({...props}) => {
  const facebookRecommendationsAllIds = useSelector(
    state => state.recommendations.facebook.allIds,
  );
  // console.warn(facebookRecommendationsAllIds);
  return (
    <View style={[gstyles.rootView]}>
      <View style={styles.titleContainer}>
        <AppText style={styles.suggested}>Suggested</AppText>
      </View>
      <FlatList
        data={facebookRecommendationsAllIds}
        keyExtractor={(item, index) => String(item)}
        renderItem={({item}) => {
          console.warn(item);
          return <SearchListItem userId={item} />;
        }}
      />
    </View>
  );
};

export default RecommendationsList;
