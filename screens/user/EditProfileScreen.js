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
} from 'react-native';
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
import {startAppLoading, stopAppLoading} from '../../store/actions/loading';
import {
  fetchUserPhotos,
  fetchUserProfile,
  updateAbout,
  updateProfileInfo,
} from '../../store/actions/user';
import styles from '../../styles';
import UserProfileScreen from '../UserProfileScreen';

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
  'Looking For': [
    'Something casual',
    'Marriage',
    'Friendship',
    "Don't know yet",
  ],
  Political: ['Conservative', 'Liberal', 'Moderate', 'Apolitical'],
  Food: ['Indian', 'Italian', 'Continental', 'Chinese'],
};

const EditProfileScreen = props => {
  const userState = useSelector(state => state.user);
  const {profile, profileUpdated} = userState;
  const [about, setAbout] = useState(null);

  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [isDraggingPhotoGrid, setIsDraggingPhotoGrid] = useState(false);
  const modalRef = createRef();
  const photoGridRef = createRef();
  const aboutRef = createRef();
  const scrollViewRef = createRef();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserPhotos());
    dispatch(fetchUserProfile());
  }, []);

  useEffect(() => {
    setAbout(profile?.about ? profile.about : null);
  }, [profile?.about]);

  useEffect(() => {
    console.warn("p", profile)
  }, [profile]);

  const save = () => {
    //Save About/////////////////////////
    let comparisonText = profile ? (profile.about ? profile.about : '') : '';

    //About has been changed
    if (about !== comparisonText) {
      dispatch(updateAbout(about));
    }
    /////////////////////////////////////

    ///Save Photos //////////////////////
    photoGridRef.current.savePhotos();
    /////////////////////////////////////
  };

  const handleOnScroll = event => {
    if (event.nativeEvent.contentOffset.y < -25) {
      setIsPreviewVisible(false);
      modalRef.current.close();
    }
  };

  if (!profileUpdated) {
    return (
      <View style={{...styles.expandedCenterView}}>
        <ActivityIndicator style={colors.primary} />
      </View>
    );
  }
  return (
    <View style={{...styles.rootView, backgroundColor: 'white'}}>
      {/* Profile Preview Screen */}
      <Modal
        style={{margin: 0}}
        swipeToClose={true}
        swipeArea={verticalScale(25)} // The height in pixels of the swipeable area, window height by default
        swipeThreshold={50} // The threshold to reach in pixels to close the modal
        isOpen={isPreviewVisible}
        ref={modalRef}
        onClosed={() => {
          setIsPreviewVisible(false);
        }}
        backdropOpacity={0}
        isVisible={isPreviewVisible}>
        <UserProfileScreen
          scrollViewRef={scrollViewRef}
          onScroll={handleOnScroll}
        />
      </Modal>

      <CustomSafeAreaView style={styles.rootView}>
        <ScrollView scrollEnabled={!isDraggingPhotoGrid} style={{flexGrow: 1}}>
          {/* Header */}
          <CustomHeader>
            <TouchableOpacity
              onPress={() => {
                save();
                props.navigation.goBack();
              }}>
              <Icon
                style={{marginHorizontal: scale(10)}}
                name={'arrow-left'}
                size={scale(30)}
              />
            </TouchableOpacity>
            {/* <AppText style={styles.titleText}>Edit profile</AppText> */}
            <View />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  onPress={() => {
                    setIsPreviewVisible(true);
                  }}>
                  <AppText
                    style={{...styles.usernameText, color: colors.primary}}>
                    Preview
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>
          </CustomHeader>

          <EditUserPhotoGrid
            ref={photoGridRef}
            onDragStart={() => setIsDraggingPhotoGrid(true)}
            onDragEnd={() => setIsDraggingPhotoGrid(false)}
          />
          <View style={{padding: scale(10)}}>
            <NameText>About</NameText>
          </View>
          <TouchableWithoutFeedback
            onPress={() => {
              aboutRef.current.focus();
            }}>
            <View
              style={{
                height: scale(100),
                backgroundColor: '#cccccc',
                marginHorizontal: scale(10),
                borderRadius: scale(20),
                padding: scale(10),
                marginBottom: verticalScale(50),
              }}>
              <TextInput
                placeholder="Type in something interesting!"
                ref={aboutRef}
                style={{fontSize: scale(15), color: 'white'}}
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
            renderItem={({item}) => (
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
            )}
          />
        </ScrollView>
      </CustomSafeAreaView>
    </View>
  );
};
export default EditProfileScreen;
