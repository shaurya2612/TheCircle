import {StyleSheet} from 'react-native';
import {
  scale,
  verticalScale,
  moderateScale,
  moderateVerticalScale,
} from 'react-native-size-matters';
import colors from './constants/colors';

const styles = StyleSheet.create({
  centerView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandedCenterView: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  rootView: {
    flex: 1,
  },
  headerView: {
    height: verticalScale(50),
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(5),
  },
  titleView: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: scale(10),
    marginVertical: verticalScale(20),
  },
  titleText: {
    fontSize: scale(30),
  },
  labelText: {fontSize: scale(10), textAlign: 'center'},
  formTextInput: {
    height: verticalScale(40),
    borderColor: '#cccccc',
    borderBottomWidth: 1,
    width: '90%',
    fontSize: verticalScale(20),
    marginVertical: verticalScale(10),
    marginHorizontal: scale(10),
  },
  searchBarTextInput: {
    height: verticalScale(20),
    borderColor: '#cccccc',
    borderBottomWidth: 1,
    width: '90%',
    fontSize: verticalScale(10),
    marginVertical: verticalScale(10),
    backgroundColor: '#cccccc',
  },
  selectedFormTextInput: {
    height: verticalScale(40),
    borderColor: colors.primary,
    borderBottomWidth: 1,
    width: '90%',
    fontSize: verticalScale(20),
    marginVertical: verticalScale(10),
    marginHorizontal: scale(10),
  },
  formButton: {
    paddingHorizontal: scale(30),
    paddingVertical: verticalScale(5),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: moderateScale(20, 0.4),
  },
  formButtonView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionButton: {
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(5),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(20, 0.4),
    borderWidth: moderateScale(2, 0.4),
    borderColor: 'rgba(255, 255, 255, 0)',
  },
  disabledSelectionButton: {
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(5),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(20, 0.4),
    borderWidth: moderateScale(2, 0.4),
    borderColor: '#cccccc',
  },
  appText: {
    color: colors.appText,
  },
  countryCodeInputView: {
    height: moderateScale(30, 0.4),
    justifyContent: 'center',
    alignItems: 'center',
    // width: "100%"
  },
  formContainer: {
    marginHorizontal: scale(10),
  },
  modalCardView: {
    padding: scale(10),
    backgroundColor: 'white',
    borderRadius: moderateScale(10, 0.4),
    padding: moderateScale(10, 0.4),
  },
  smallStatBoxView: {
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(5),
    justifyContent: 'center',
    alignItems: 'center',
    width: '33.3%',
  },
  homeStatCardView: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: scale(10),
    borderRadius: verticalScale(15),
    paddingBottom: verticalScale(10),
    paddingTop: verticalScale(30),
    minWidth: '80%',
  },
  homeStatCardImageBackground: {
    height: scale(120),
    width: scale(120),
    position: 'absolute',
    bottom: '95%',
    borderRadius: scale(60),
    zIndex: 1,
    overflow: 'hidden',
    borderWidth: scale(3),
    borderColor: 'white',
    backgroundColor: 'white',
  },
  startMatchingButton: {
    paddingHorizontal: scale(30),
    paddingVertical: verticalScale(10),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: scale(3),
    borderColor: colors.accent,
    borderRadius: scale(40),
    flexWrap:"nowrap",
    // width:"100%"
  },
  nameText: {fontSize: scale(17)},
  lastMessageText: {fontSize: scale(12), color: 'grey'},
  usernameText: {fontSize: scale(15), color: 'grey'},
  chatComposerText: {fontSize: scale(15)},
  elevation_small: {
    shadowColor: '#000',
    shadowOffset: {width: 0.5, height: 0.5},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
  elevation_medium: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
  },
});

export default styles;
