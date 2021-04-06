import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  TouchableNativeFeedback,
  ScrollView,
  Text,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import {useDispatch} from 'react-redux';
import AppText from '../../components/AppText';
import CustomHeader from '../../components/CustomHeader';
import CustomSafeAreaView from '../../components/CustomSafeAreaView';
import FormButton from '../../components/FormButton';
import OptionView from '../../components/OptionView';
import SelectionButton from '../../components/SelectionButton';
import StackHeader from '../../components/StackHeader';
import {deleteUser, logoutUser} from '../../store/actions/user';
import styles from '../../styles';
import ModalCardView from '../../components/ModalCardView';
import {privacyPolicy, termsOfUse} from '../../constants/official';
import {useRef} from 'react';
import auth from '@react-native-firebase/auth';
import {setErrorMessage} from '../../store/actions/error';
import colors from '../../constants/colors';

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
  const [
    isVerificationCodeInputVisible,
    setIsVerificationCodeInputVisible,
  ] = useState(false);
  const [verificationCode, setVerificationCode] = useState({
    0: null,
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
  });
  const [confirm, setConfirm] = useState(null);
  const [sendingCode, setSendingCode] = useState(true);
  const textInputRef1 = useRef();
  const textInputRef2 = useRef();
  const textInputRef3 = useRef();
  const textInputRef4 = useRef();
  const textInputRef5 = useRef();
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

        <ReactNativeModal
          useNativeDriver={true}
          onModalHide={() => {
            setVerificationCode({
              0: null,
              1: null,
              2: null,
              3: null,
              4: null,
              5: null,
            });
            setConfirm(null);
          }}
          onModalShow={async () => {
            try {
              setSendingCode(true);
              var confirmFn = await auth().signInWithPhoneNumber(
                auth().currentUser.phoneNumber,
                false,
              );
              setSendingCode(false);
            } catch (err) {
              dispatch(setErrorMessage(err.message));
              setIsVerificationCodeInputVisible(false);
            }
            setConfirm(confirmFn ?? null);
          }}
          isVisible={isVerificationCodeInputVisible}>
          <View style={styles.centerView}>
            <ModalCardView>
              {!sendingCode ? (
                <View style={{height: scale(20), flexDirection: 'row-reverse'}}>
                  <Icon
                    name={'x'}
                    onPress={() => {
                      setIsVerificationCodeInputVisible(false);
                    }}
                    size={scale(20)}
                  />
                </View>
              ) : null}
              {sendingCode ? (
                <View
                  style={{
                    height: verticalScale(300),
                    width: scale(300),
                    ...styles.centerView,
                  }}>
                  <ActivityIndicator color="black" size="large" />
                  <View style={{position: 'absolute', top: '70%'}}>
                    <AppText>
                      Sending a verification code to{' '}
                      {auth().currentUser.phoneNumber}
                    </AppText>
                  </View>
                </View>
              ) : (
                <View
                  style={{
                    width: '90%',
                    ...styles.expandedCenterView,
                  }}>
                  <AppText>
                    Please enter the verification code sent to{' '}
                    {auth().currentUser.phoneNumber}
                  </AppText>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <TextInput
                      style={{
                        ...styles.selectedFormTextInput,
                        borderColor: 'black',
                        fontSize: moderateScale(20, 0.4),
                        color: 'black',
                        width: '10%',
                        textAlign: 'center',
                      }}
                      selectionColor={'black'}
                      keyboardType={'number-pad'}
                      maxLength={1}
                      onChangeText={text => {
                        setVerificationCode({...verificationCode, 0: text});
                        if (text.length === 1) {
                          textInputRef1.current.focus();
                        }
                      }}
                    />
                    <TextInput
                      ref={textInputRef1}
                      style={{
                        ...styles.selectedFormTextInput,
                        borderColor: 'black',
                        fontSize: moderateScale(20, 0.4),
                        color: 'black',
                        width: '10%',
                        textAlign: 'center',
                      }}
                      selectionColor={'black'}
                      keyboardType={'number-pad'}
                      maxLength={1}
                      onChangeText={text => {
                        setVerificationCode({...verificationCode, 1: text});
                        if (text.length === 1) {
                          textInputRef2.current.focus();
                        }
                      }}
                    />
                    <TextInput
                      ref={textInputRef2}
                      style={{
                        ...styles.selectedFormTextInput,
                        borderColor: 'black',
                        fontSize: moderateScale(20, 0.4),
                        color: 'black',
                        width: '10%',
                        textAlign: 'center',
                      }}
                      selectionColor={'black'}
                      keyboardType={'number-pad'}
                      maxLength={1}
                      onChangeText={text => {
                        setVerificationCode({...verificationCode, 2: text});
                        if (text.length === 1) {
                          textInputRef3.current.focus();
                        }
                      }}
                    />
                    <TextInput
                      ref={textInputRef3}
                      style={{
                        ...styles.selectedFormTextInput,
                        borderColor: 'black',
                        fontSize: moderateScale(20, 0.4),
                        color: 'black',
                        width: '10%',
                        textAlign: 'center',
                      }}
                      selectionColor={'black'}
                      keyboardType={'number-pad'}
                      maxLength={1}
                      onChangeText={text => {
                        setVerificationCode({...verificationCode, 3: text});
                        if (text.length === 1) {
                          textInputRef4.current.focus();
                        }
                      }}
                    />
                    <TextInput
                      ref={textInputRef4}
                      style={{
                        ...styles.selectedFormTextInput,
                        borderColor: 'black',
                        fontSize: moderateScale(20, 0.4),
                        color: 'black',
                        width: '10%',
                        textAlign: 'center',
                      }}
                      selectionColor={'black'}
                      keyboardType={'number-pad'}
                      maxLength={1}
                      onChangeText={text => {
                        setVerificationCode({...verificationCode, 4: text});
                        if (text.length === 1) {
                          textInputRef5.current.focus();
                        }
                      }}
                    />
                    <TextInput
                      ref={textInputRef5}
                      style={{
                        ...styles.selectedFormTextInput,
                        borderColor: 'black',
                        fontSize: moderateScale(20, 0.4),
                        color: 'black',
                        width: '10%',
                        textAlign: 'center',
                      }}
                      selectionColor={'black'}
                      keyboardType={'number-pad'}
                      maxLength={1}
                      onChangeText={text => {
                        setVerificationCode({...verificationCode, 5: text});
                      }}
                    />
                  </View>
                  <FormButton
                    title="Verify and delete"
                    style={{position: 'absolute', top: '90%'}}
                    disabled={
                      Object.values(verificationCode).join('').length < 6
                    }
                    onPress={async () => {
                      try {
                        await confirm.confirm(
                          Object.values(verificationCode).join(''),
                        );
                        dispatch(deleteUser());
                      } catch (err) {
                        dispatch(setErrorMessage(err.message));
                      }
                    }}
                  />
                </View>
              )}
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
              setIsVerificationCodeInputVisible(true);
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
