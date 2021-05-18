import React, {useEffect, useState} from 'react';
import {
  Button,
  FlatList,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {scale, verticalScale} from 'react-native-size-matters';
import AppText from '../../components/AppText';
import * as Animatable from 'react-native-animatable';
import styles from '../../styles';
import LinearGadient from 'react-native-linear-gradient';
import colors from '../../constants/colors';
import StartMatchingButton from '../../components/StartMatchingButton';
import TheCircleLogo from '../../assets/thecircle_logo_solid.svg';
import ReactNativeModal from 'react-native-modal';
import ModalCardView from '../../components/ModalCardView';
import Icon from 'react-native-vector-icons/Feather';
import {privacyPolicy, termsOfUse} from '../../constants/official';
import CustomSafeAreaView from '../../components/CustomSafeAreaView';

const LoginScreen = props => {
  const [
    isPrivacyPolicyModalVisible,
    setIsPrivacyPolicyModalVisible,
  ] = useState(false);

  const [isTermsOfUseModalVisible, setIsTermsOfUseModalVisible] = useState(
    false,
  );

  return (
    <LinearGadient
      colors={[colors.primary, colors.accent]}
      style={styles.rootView}>
      <CustomSafeAreaView style={styles.rootView}>
        <ReactNativeModal
          useNativeDriver={true}
          isVisible={isPrivacyPolicyModalVisible || isTermsOfUseModalVisible}>
          <View style={styles.centerView}>
            <ModalCardView>
              <View style={{height: scale(20), flexDirection: 'row-reverse'}}>
                <Icon
                  name={'x'}
                  onPress={() => {
                    setIsTermsOfUseModalVisible(false);
                    setIsPrivacyPolicyModalVisible(false);
                  }}
                  size={scale(20)}
                />
              </View>
              <FlatList
                data={isPrivacyPolicyModalVisible ? privacyPolicy : termsOfUse}
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

        <Animatable.View
          style={{...styles.centerView, flex: 1, justifyContent: 'flex-end'}}
          animation={'slideInDown'}>
          <TheCircleLogo width={scale(175)} height={scale(175)} fill="#fff" />
          <AppText
            style={{
              ...styles.titleText,
              color: 'white',
              textAlign: 'center',
              fontWeight: 'bold',
            }}>
            The Circle
          </AppText>
        </Animatable.View>
        <Animatable.View
          style={{...styles.centerView, flex: 1.5}}
          animation={'slideInUp'}>
          <View style={{height: '20%'}} />
          <StartMatchingButton
            style={{alignSelf: 'center'}}
            onPress={() => {
              props.navigation.navigate('PhoneAuthScreen');
            }}
            title={'Sign in via phone'}
          />
          <View
            style={{
              position: 'absolute',
              top: '90%',
              flexDirection: 'row',
              flexWrap: 'wrap',
              padding: scale(2),
              ...styles.centerView,
            }}>
            <Text style={{color: 'white'}}>
              {'By signing in you agree to our '}
            </Text>
            <Text
              style={{textDecorationLine: 'underline', color: 'white'}}
              onPress={() => {
                setIsPrivacyPolicyModalVisible(true);
              }}>
              Privacy Policy
            </Text>
            <Text style={{color: 'white'}}>{' and '}</Text>
            <Text
              style={{textDecorationLine: 'underline', color: 'white'}}
              onPress={() => {
                setIsTermsOfUseModalVisible(true);
              }}>
              Terms of Use
            </Text>
          </View>
        </Animatable.View>
      </CustomSafeAreaView>
    </LinearGadient>
  );
};

export default LoginScreen;
