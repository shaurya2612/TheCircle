import {StyleSheet} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';

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
    height: '100%',
  },
  buttonContainer: {
    flex: 0.75,
    // backgroundColor: 'blue',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    paddingVertical: scale(8),
    paddingHorizontal: scale(12),
    borderRadius: scale(100),
    // borderWidth: StyleSheet.hairlineWidth,
  },
  text: {
    color: '#fff',
    fontSize: scale(12),
    fontFamily: 'Quicksand-Bold',
  },
  icon: {
    marginLeft: scale(3),
  },
});

export default styles;
