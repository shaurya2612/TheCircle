import React, {useEffect} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {scale} from 'react-native-size-matters';
import AppText from '../../../../components/AppText';
import AvatarCircle from '../../../../components/AvatarCircle';
import NameText from '../../../../components/NameText';
import gstyles from '../../../../styles';
import ButtonContainer from './ButtonContainer';
import styles from './styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useSelector} from 'react-redux';
import ConnectListItem from '../../../../components/ConnectListItem';

const SearchListItem = ({userId, onPress, ...props}) => {
  const facebookRecommendationData = useSelector(
    state => state.recommendations.facebook.byIds?.[userId] || {},
  );
  const {name, username, uid, status, dp} = facebookRecommendationData;

  if (!facebookRecommendationData) return null;
  return (
    <ConnectListItem
      buttonInRow={true}
      name={name}
      username={username}
      uid={uid}
      facebook={true}
      status={status}
      dp={dp}>
      <ButtonContainer uid={uid} />
    </ConnectListItem>
  );
};

export default SearchListItem;
