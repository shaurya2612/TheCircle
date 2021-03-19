import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  TouchableNativeFeedback,
  ScrollView,
  Text,
} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import {scale, verticalScale} from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import {useDispatch} from 'react-redux';
import AppText from '../../components/AppText';
import CustomHeader from '../../components/CustomHeader';
import CustomSafeAreaView from '../../components/CustomSafeAreaView';
import FormButton from '../../components/FormButton';
import OptionView from '../../components/OptionView';
import SelectionButton from '../../components/SelectionButton';
import StackHeader from '../../components/StackHeader';
import {logoutUser} from '../../store/actions/user';
import styles from '../../styles';
import ModalCardView from '../../components/ModalCardView';
import {privacyPolicy, termsOfUse} from '../../constants/official';

const SettingsScreen = props => {
  const data = [
    {
      title: 'FAQs',
      onPress: () => {
        props.navigation.navigate('FAQsScreen');
      },
    },
    {
      title: 'Terms of Use',
      onPress: () => {
        setIsTermsOfUseVisible(true);
      },
    },
    {
      title: 'Privacy Policy',
      onPress: () => {
        setIsPrivacyPolicyVisible(true);
      },
    },
  ];

  const [isTermsOfUseVisible, setIsTermsOfUseVisible] = useState(false);
  const [isPrivacyPolicyVisible, setIsPrivacyPolicyVisible] = useState(false);
  const dispatch = useDispatch();

  return (
    <View style={{...styles.rootView, backgroundColor: 'white'}}>
      <CustomSafeAreaView style={{flex: 1}}>
        {/* Modal */}
        <ReactNativeModal
          useNativeDriver={true}
          isVisible={isTermsOfUseVisible || isPrivacyPolicyVisible}>
          <View style={styles.centerView}>
            <ModalCardView>
              <View style={{height: scale(20), flexDirection: 'row-reverse'}}>
                <Icon
                  name={'x'}
                  onPress={() => {
                    setIsTermsOfUseVisible(false);
                    setIsPrivacyPolicyVisible(false);
                  }}
                  size={scale(20)}
                />
              </View>
              <FlatList
                data={isTermsOfUseVisible ? termsOfUse : privacyPolicy}
                contentContainerStyle={{overflow: 'scroll'}}
                keyExtractor={(item, index) => {
                  return index.toString();
                }}
                renderItem={({item}) => {
                  return (
                    <View style={{marginVertical: scale(10)}}>
                      {item.heading ? (
                        <Text style={{fontSize: scale(20)}}>
                          {item.heading}
                        </Text>
                      ) : null}
                      <View>{item.text}</View>
                    </View>
                  );
                }}></FlatList>
            </ModalCardView>
          </View>
        </ReactNativeModal>

        <CustomHeader>
          <TouchableOpacity
            onPress={() => {
              props.navigation.goBack();
            }}>
            <Icon
              style={{marginHorizontal: scale(10)}}
              name={'arrow-left'}
              size={scale(30)}
            />
          </TouchableOpacity>
          <AppText style={styles.titleText}>Settings</AppText>
          <View style={{width: scale(50)}} />
        </CustomHeader>

        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
          }}>
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <OptionView
                title={item.title}
                style={{
                  backgroundColor: 'white',
                  marginVertical: verticalScale(5),
                  ...styles.elevation_small,
                }}
                fontStyle={item.fontStyle || {}}
                onPress={item.onPress}
              />
            )}
          />
          {/* <View style={{height:"50%", backgroundColor:"red"}}/> */}
          <OptionView
            title={'Log out'}
            style={{
              backgroundColor: 'white',
              marginVertical: verticalScale(5),
              ...styles.centerView,
              ...styles.elevation_small,
            }}
            fontStyle={{color: 'red'}}
            onPress={() => {
              dispatch(logoutUser());
            }}
          />
          <OptionView
            title={'Delete Account'}
            style={{
              backgroundColor: 'red',
              marginVertical: verticalScale(5),
              ...styles.centerView,
            }}
            fontStyle={{color: 'white'}}
            onPress={() => {
              dispatch(logoutUser());
            }}
          />
          {/* <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
            <FormButton onPress={() => {}} title="Log Out" />
            <FormButton style={{backgroundColor: '#ff3217'}} title="Delete" />
          </View> */}
        </View>
      </CustomSafeAreaView>
    </View>
  );
};

export default SettingsScreen;
