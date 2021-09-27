import React, {Fragment, useEffect} from 'react';
import {Text, TextInput} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider, useSelector} from 'react-redux';
import {applyMiddleware, createStore} from 'redux';
import allReducers from './store/reducers';
import thunk from 'redux-thunk';
import {NavigationContainer} from '@react-navigation/native';
import {ActivityIndicator, Platform, StatusBar, View} from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import Icon from 'react-native-vector-icons/Feather';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
// import admob, {MaxAdContentRating} from '@react-native-firebase/admob';
import functions from '@react-native-firebase/functions';
import RNBootSplash from 'react-native-bootsplash';

Icon.loadFont();
FontAwesome5Icon.getStyledIconSet('brand').loadFont();
FontAwesome5Icon.getStyledIconSet('light').loadFont();
FontAwesome5Icon.getStyledIconSet('regular').loadFont();
FontAwesome5Icon.getStyledIconSet('solid').loadFont();

Text.defaultProps = {
  ...(Text.defaultProps || {}),
  allowFontScaling: false,
  includeFontPadding: false,
};
TextInput.defaultProps = {
  ...(TextInput.defaultProps || {}),
  allowFontScaling: false,
};
export const store = createStore(allReducers, applyMiddleware(thunk));

export default function App() {
  useEffect(() => {
    // admob()
    //   .setRequestConfiguration({
    //     // Update all future requests suitable for parental guidance
    //     maxAdContentRating: MaxAdContentRating.PG,
    //     // Indicates that you want your content treated as child-directed for purposes of COPPA.
    //     tagForChildDirectedTreatment: true,
    //     // Indicates that you want the ad request to be handled in a
    //     // manner suitable for users under the age of consent.
    //     tagForUnderAgeOfConsent: true,
    //   })
    //   .then(() => {
    //     // Request config successfully set!
    //   });
  }, []);

  return (
    <Fragment>
      <StatusBar
        barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'}
      />
      <SafeAreaProvider>
        <Provider store={store}>
          <NavigationContainer onReady={() => RNBootSplash.hide()}>
            <AppNavigator />
          </NavigationContainer>
        </Provider>
      </SafeAreaProvider>
    </Fragment>
  );
}
