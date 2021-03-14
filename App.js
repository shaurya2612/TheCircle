import React, {Fragment, useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider, useSelector} from 'react-redux';
import {applyMiddleware, createStore} from 'redux';
import allReducers from './store/reducers';
import thunk from 'redux-thunk';
import {NavigationContainer} from '@react-navigation/native';
import {ActivityIndicator, StatusBar, View} from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import Icon from 'react-native-vector-icons/Feather';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
Icon.loadFont();
FontAwesome5Icon.getStyledIconSet('brand').loadFont();
FontAwesome5Icon.getStyledIconSet('light').loadFont();
FontAwesome5Icon.getStyledIconSet('regular').loadFont();
FontAwesome5Icon.getStyledIconSet('solid').loadFont();

export const store = createStore(allReducers, applyMiddleware(thunk));

export default function App() {
  
  return (
    <Fragment>
      <StatusBar barStyle={'default'} />
      <SafeAreaProvider>
        <Provider store={store}>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </Provider>
      </SafeAreaProvider>
    </Fragment>
  );
}
