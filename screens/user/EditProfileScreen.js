import React from 'react';
import {useEffect} from 'react';
import {useState, createRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  TouchableWithoutFeedback,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ReactNativeModal from 'react-native-modal';
import Modal from 'react-native-modalbox';
import {scale, verticalScale} from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import {useDispatch, useSelector} from 'react-redux';
import AppText from '../../components/AppText';
import CustomHeader from '../../components/CustomHeader';
import CustomSafeAreaView from '../../components/CustomSafeAreaView';
import {EditInfoBar} from '../../components/EditInfoBar';
import EditUserPhotoGrid from '../../components/EditUserPhotoGrid';
import NameText from '../../components/NameText';
import colors from '../../constants/colors';
import {
  fetchUserPhotos,
  fetchUserProfile,
  updateAbout,
  updateProfileInfo,
} from '../../store/actions/user';
import gstyles from '../../styles';

const iconMap = {
  Zodiac: 'moon',
  Drinks: 'wine-glass-alt',
  Smokes: 'smoking',
  'Looking For': 'search',
  Political: 'balance-scale',
  Food: 'utensils',
};

const valueOptions = {
  Zodiac: [
    'Aries',
    'Taurus',
    'Gemini',
    'Cancer',
    'Leo',
    'Virgo',
    'Libra',
    'Scorpio',
    'Sagittarius',
    'Capricorn',
    'Aquarius',
    'Pisces',
  ],
  Drinks: ['Never', 'Sometimes', 'Frequently', 'Socially'],
  Smokes: ['Never', 'Sometimes', 'Frequently', 'Socially'],
  'Looking For': ['Something casual', 'Marriage', 'Friends', "Don't know yet"],
  Political: ['Conservative', 'Liberal', 'Moderate', 'Apolitical'],
  Food: [
    'Chinese',
    'Continental',
    'French',
    'Greek',
    'Indian',
    'Italian',
    'Japanese',
    'Lebanese',
    'Mexican',
    'Mughlai',
    'Thai',
    'Turkish',
  ],
};

const EditProfileScreen = props => {
  const userState = useSelector(state => state.user);
  const {profile, profileUpdated} = userState;
  const [about, setAbout] = useState(null);

  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [isDraggingPhotoGrid, setIsDraggingPhotoGrid] = useState(false);
  const aboutRef = createRef();
  const photoGridRef = createRef();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserPhotos());
    dispatch(fetchUserProfile());
  }, []);

  useEffect(() => {
    setAbout(profile?.about ? profile.about : null);
  }, [profile?.about]);

  const save = () => {
    //Save About/////////////////////////
    let comparisonText = profile ? (profile.about ? profile.about : '') : '';

    //About has been changed
    if (about !== comparisonText) {
      dispatch(updateAbout(about ? about.trim() : null));
    }
    /////////////////////////////////////

    ///Save Photos //////////////////////
    photoGridRef.current.savePhotos();
    /////////////////////////////////////
  };
  const renderItem = ({item}) => (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: verticalScale(10),
      }}>
      {/* //Fetch the value of the bar for the user from the database */}
      <EditInfoBar
        valueOptions={valueOptions[item]}
        onValueChange={value => {
          dispatch(updateProfileInfo(item, value));
        }}
        removeOption={true}
        title={item}
        iconName={iconMap[item]}
        value={
          profile
            ? profile.info
              ? profile.info[item]
                ? profile.info[item]
                : null
              : null
            : null
        }
      />
    </View>
  );

  if (!profileUpdated) {
    return (
      <LinearGradient
        colors={[colors.primary, colors.accent]}
        style={{...gstyles.expandedCenterView}}>
        <ActivityIndicator style={'white'} />
      </LinearGradient>
    );
  }
  return (
    <View style={{...gstyles.rootView, backgroundColor: 'white'}}>
      <CustomSafeAreaView style={gstyles.rootView}>
        <LinearGradient
          style={gstyles.rootView}
          colors={[colors.primary, colors.accent]}>
          <ScrollView
            scrollEnabled={!isDraggingPhotoGrid}
            style={{flexGrow: 1}}>
            {/* Header */}
            <CustomHeader>
              <TouchableOpacity
                onPress={() => {
                  save();
                  props.navigation.goBack();
                }}>
                <Icon
                  style={{marginHorizontal: scale(5)}}
                  name={'arrow-left'}
                  size={scale(25)}
                  color="white"
                />
              </TouchableOpacity>
              <View />
            </CustomHeader>

            <EditUserPhotoGrid
              ref={photoGridRef}
              onDragStart={() => setIsDraggingPhotoGrid(true)}
              onDragEnd={() => setIsDraggingPhotoGrid(false)}
            />
            <View style={{padding: scale(10)}}>
              <NameText style={{color: 'white'}}>About</NameText>
            </View>
            <TouchableWithoutFeedback
              onPress={() => {
                aboutRef.current.focus();
              }}>
              <View style={styles.aboutContainer}>
                <TextInput
                  placeholder="Type in something interesting!"
                  ref={aboutRef}
                  style={styles.aboutTextInput}
                  placeholderTextColor="grey"
                  multiline
                  onChangeText={text => {
                    setAbout(text);
                  }}
                  value={about}
                />
              </View>
            </TouchableWithoutFeedback>
            <FlatList
              data={Object.keys(iconMap)}
              extraData={profile}
              renderItem={renderItem}
            />
          </ScrollView>
        </LinearGradient>
      </CustomSafeAreaView>
    </View>
  );
};
const styles = StyleSheet.create({
  aboutTextInput: {
    fontSize: scale(15),
    color: 'black',
    textAlignVertical:'top'
  },
  aboutContainer: {
    height: scale(100),
    backgroundColor: 'white',
    marginHorizontal: scale(10),
    borderRadius: scale(20),
    paddingHorizontal: scale(10),
    paddingVertical: scale(8),
    marginBottom: verticalScale(50),
  },
});
export default EditProfileScreen;
