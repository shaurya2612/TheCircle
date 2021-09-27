import {StyleSheet} from 'react-native';
import {scale} from 'react-native-size-matters';
import colors from '../../../../constants/colors';

const styles = StyleSheet.create({
  titleContainer: {
    padding: scale(10),
  },
  suggested: {
    fontSize: scale(18),
    fontFamily: 'Quicksand-SemiBold',
    color: '#000',
  },
});

export default styles;
