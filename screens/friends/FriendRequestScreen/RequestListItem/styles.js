import {StyleSheet} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import colors from '../../../../constants/colors';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: verticalScale(10),
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  username: {fontSize: scale(12)},
  avatarContainer: {
    paddingHorizontal: scale(10),
  },
  nameContainer: {
    maxWidth: '75%',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: scale(4),
    height: '100%',
  },
  buttonContainer: {
    flex: 0.5,
    padding: scale(10),
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
  },
  button: {
    paddingVertical: scale(8),
    paddingHorizontal: scale(12),
    borderRadius: scale(10),
    flex: 1,
  },
  addFriend: {backgroundColor: colors.primary},
  addFriendText: {
    color: '#fff',
    fontSize: scale(12),
    fontFamily: 'Quicksand-Bold',
  },
  accept: {
    backgroundColor: colors.primary,
  },
  acceptText: {
    color: '#fff',
    fontSize: scale(12),
    fontFamily: 'Quicksand-Bold',
  },
  pending: {
    backgroundColor: '#fff',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
  },
  pendingText: {
    color: '#000',
    fontSize: scale(12),
    fontFamily: 'Quicksand-Bold',
  },
  respond: {
    backgroundColor: '#fff',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
  },
  respondText: {
    color: '#000',
    fontSize: scale(12),
    fontFamily: 'Quicksand-Bold',
  },
  friends: {
    backgroundColor: '#fff',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
  },
  friendsText: {
    color: '#000',
    fontSize: scale(12),
    fontFamily: 'Quicksand-Bold',
  },
  icon: {
    marginLeft: scale(3),
  },
});

export default styles;
