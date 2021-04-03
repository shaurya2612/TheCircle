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
import LinearGradient from 'react-native-linear-gradient';
import colors from '../constants/colors';
import StartMatchingButton from '../components/StartMatchingButton';

const LoginScreen = props => {
  return (
    <LinearGradient
      colors={[colors.primary, colors.accent]}
      style={styles.rootView}>
      <SafeAreaView style={styles.rootView}>
        <Animatable.View
          style={styles.expandedCenterView}
          animation={'slideInUp'}>
          <View style={{justifyContent: 'center'}}>
            <AppText style={{...styles.titleText, color: 'white'}}>
              The Circle
            </AppText>
          </View>
          <View style={{height: '20%'}} />
          <StartMatchingButton
            onPress={() => {
              props.navigation.navigate('PhoneAuthScreen');
            }}
            title={'Sign in via phone'}
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
