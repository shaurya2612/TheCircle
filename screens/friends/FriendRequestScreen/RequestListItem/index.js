import React, {useEffect} from 'react';
import ButtonContainer from './ButtonContainer';
import {useSelector} from 'react-redux';
import ConnectListItem from '../../../../components/ConnectListItem';

const RequestListItem = ({userId, onPress, ...props}) => {
  const requestById = useSelector(state => state.user.requests.byIds?.[userId]);
  const {id, name, age, username, dp, status, createdAt} = requestById || {};

  if (!requestById) return null;

  return (
    <ConnectListItem
      name={name}
      username={username}
      uid={id}
      status={status}
      dp={dp}>
      <ButtonContainer uid={id} />
    </ConnectListItem>
  );
};

export default RequestListItem;
