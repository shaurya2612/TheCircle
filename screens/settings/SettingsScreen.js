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
import DeviceInfo from 'react-native-device-info';
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
import NameText from '../../components/NameText';

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

  const renderPolicyItem = ({item}) => {
    return (
      <View style={{marginVertical: scale(10)}}>
        {item.heading ? (
          <Text style={{fontSize: scale(20)}}>{item.heading}</Text>
        ) : null}
        <View>{item.text}</View>
      </View>
    );
  };

  const renderItem = ({item}) => (
    <OptionView
      title={item.title}
      style={{
        backgroundColor: 'white',
        marginVertical: verticalScale(5),
        // borderBottomWidth: scale(0.1)
      }}
      fontStyle={item.fontStyle || {}}
      onPress={item.onPress}
    />
  );

  // Handle confirm code button press
  async function confirmCode() {
    if (!confirm) {
      dispatch(
        setErrorMessage({message: 'An error has occured. Please try again'}),
      );
      return;
    }
    try {
      const credential = auth.PhoneAuthProvider.credential(
        confirm.verificationId,
        Object.values(verificationCode).join(''),
      );
      await auth().currentUser.reauthenticateWithCredential(credential);
      dispatch(deleteUser());
    } catch (error) {
      if (error.code === 'auth/invalid-verification-code') {
        dispatch(setErrorMessage('Invalid Code.'));
      } else {
        dispatch(setErrorMessage(error));
      }
    }
  }

  return (
    <View style={styles.rootView}>
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
                renderItem={renderPolicyItem}
              />
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

              var confirmFn = await auth().verifyPhoneNumber(
                auth().currentUser.phoneNumber,
              );
              setSendingCode(false);
              // confirmFn.on('state_changed', phoneAuthSnapshot => {
              //   if (phoneAuthSnapshot.error) {
              //     dispatch(
              //       setErrorMessage(
              //         'Error sending code for verification.\n Please try again later',
              //       ),
              //     );
              //     return;
              //   }
              //   if (phoneAuthSnapshot.state === 'sent') {
              //     setSendingCode(false);
              //   }
              //   // if (phoneAuthSnapshot.state === 'verified') {
              //   //   dispatch(deleteUser());
              //   // }
              // });
            } catch (err) {
              dispatch(setErrorMessage(err));
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
                        color: 'black',
                        width: '10%',
                        textAlign: 'center',
                      }}
                      selectionColor={'#cccccc'}
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
                        color: 'black',
                        width: '10%',
                        textAlign: 'center',
                      }}
                      selectionColor={'#cccccc'}
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
                        color: 'black',
                        width: '10%',
                        textAlign: 'center',
                      }}
                      selectionColor={'#cccccc'}
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
                        color: 'black',
                        width: '10%',
                        textAlign: 'center',
                      }}
                      selectionColor={'#cccccc'}
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
                        color: 'black',
                        width: '10%',
                        textAlign: 'center',
                      }}
                      selectionColor={'#cccccc'}
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
                        color: 'black',
                        width: '10%',
                        textAlign: 'center',
                      }}
                      selectionColor={'#cccccc'}
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
                      await confirmCode();
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
            <Icon name={'arrow-left'} size={scale(20)} />
          </TouchableOpacity>
          <AppText style={{fontSize: scale(18)}}>{'Settings'}</AppText>
          <View style={{width: scale(20)}} />
        </CustomHeader>

        <View
          style={{
            flex: 1,
            // justifyContent: 'space-between',
          }}>
          <View style={{marginVertical: verticalScale(5)}}>
            <NameText>General</NameText>
          </View>
          <View
            style={{
              backgroundColor: 'white',
              padding: scale(5),
              borderRadius: scale(10),
            }}>
            <FlatList
              data={data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
            />
          </View>
          <View
            style={{
              marginVertical: scale(20),
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
            }}>
            <FormButton
              onPress={() => {
                dispatch(logoutUser());
              }}
              style={{
                // backgroundColor: '#3490dc',
                marginVertical: verticalScale(5),
              }}
              // textColor="white"
              textSize={styles.nameText.fontSize}
              title="Log Out"
            />
            <FormButton
              onPress={() => {
                if (auth().currentUser.phoneNumber !== null)
                  setIsVerificationCodeInputVisible(true);
                else dispatch(deleteUser());
              }}
              style={{backgroundColor: '#ff3217'}}
              textColor="white"
              textSize={styles.nameText.fontSize}
              title="Delete Account"
            />
          </View>
        </View>
        <View
          style={{
            alignSelf: 'flex-end',
            width: '100%',
            marginVertical: verticalScale(5),
          }}>
          <AppText
            style={{
              fontSize: scale(30),
              color: '#cccccc',
              textAlign: 'center',
              fontFamily: 'Quicksand-Bold',
            }}>
            {'Circle'}
          </AppText>
          <AppText
            style={{
              fontSize: scale(10),
              color: '#cccccc',
              textAlign: 'center',
              fontFamily: 'Quicksand-Bold',
            }}>
            {'v' + DeviceInfo.getVersion()}
          </AppText>
        </View>
      </CustomSafeAreaView>
    </View>
  );
};

export default SettingsScreen;
