import React from 'react';
import {ActivityIndicator, Linking, View} from 'react-native';
import {scale} from 'react-native-size-matters';
import AppText from '../components/AppText';
import FormButton from '../components/FormButton';
import colors from '../constants/colors';
import styles from '../styles';

export const NeedsUpdateScreen = ({latestVersion, url}) => {
  return (
    <View style={{...styles.expandedCenterView, backgroundColor: 'white'}}>
      <AppText style={{...styles.titleText, textAlign: 'center'}}>
        Your app needs to be updated in order to continue.
      </AppText>
      <FormButton
        style={{backgroundColor: colors.primary, margin: scale(30)}}
        textColor="white"
        title="Update app"
        onPress={async () => {
          await Linking.openURL(url);
        }}
      />
      <AppText style={{...styles.nameText, textAlign: 'center'}}>
        Latest version: {latestVersion}
      </AppText>
    </View>
  );
};

export default NeedsUpdateScreen;
