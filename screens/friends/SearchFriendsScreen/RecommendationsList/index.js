import React from 'react';
import {FlatList, View} from 'react-native';
import {scale} from 'react-native-size-matters';
import AppText from '../../../../components/AppText';
import gstyles from '../../../../styles';
import styles from './styles';
import FriendsListItem from '../../../../components/FriendsListItem';
import SearchListItem from '../SearchListItem';

const RecommendationsList = ({data, ...props}) => {
  return (
    <View style={[gstyles.rootView]}>
      <View style={styles.titleContainer}>
        <AppText style={styles.suggested}>Suggested</AppText>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item, index) => String(item.uid)}
        renderItem={({item}) => (
          <SearchListItem
            name={item.name}
            imageUri={item.dp}
            userId={item.uid}
            username={'@' + item.username}
          />
        )}
      />
    </View>
  );
};

export default RecommendationsList;
