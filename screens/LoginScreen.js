import React from 'react';
import {Button, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {verticalScale} from 'react-native-size-matters';
import AppText from '../components/AppText';
import FormButton from '../components/FormButton';
import FormTextInput from '../components/FormTextInput';
import SelectionButton from '../components/SelectionButton';
import * as Animatable from 'react-native-animatable';
import styles from '../styles';
import {loginUser} from '../store/actions/user';
import {useState} from 'react';
import {useDispatch} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../constants/colors';
import StartMatchingButton from '../components/StartMatchingButton'

const LoginScreen = props => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  return (
    <LinearGradient
      colors={[colors.primary, colors.accent]}
      style={{...styles.rootView}}>
      <SafeAreaView style={styles.rootView}>
        <Animatable.View
          style={{...styles.expandedCenterView, width: '100%'}}
          animation={'slideInUp'}>
          <View style={styles.titleView}>
            <AppText style={{...styles.titleText, color: 'white'}}>
              Login
            </AppText>
          </View>
          <FormTextInput
            keyboardType={'number-pad'}
            onChangeText={text => {
              setPhoneNumber(text);
            }}
            placeholder="Mobile Number"
          />
          <FormTextInput
            onChangeText={text => {
              setPassword(text);
            }}
            secureTextEntry={true}
            style={{marginBottom: verticalScale(30)}}
            placeholder="Password"
          />
          <StartMatchingButton
            onPress={() => {
              props.navigation.navigate('PhoneAuthScreen')
            }}
            title={'Sign In via Phone'}
          />
          {/* <SelectionButton
            title={'Sign me up !'}
            onPress={() => {
              props.navigation.navigate('PhoneAuthScreen');
            }}
          /> */}
          <View
            style={{position: 'absolute', top: '95%', flexDirection: 'row'}}>
            <Text style={{color: 'white'}}>Take a look at our </Text>
            <Text
              style={{textDecorationLine: 'underline', color: 'white'}}
              onPress={() => {
                props.navigation.navigate('PhoneAuthScreen');
              }}>
              Privacy Policy
            </Text>
          </View>
        </Animatable.View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default LoginScreen;
