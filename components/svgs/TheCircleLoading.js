import React from 'react';
import {View as AnimatableView} from 'react-native-animatable';
import {scale} from 'react-native-size-matters';
import TheCircleLogo from '../../assets/svgs/thecircle_logo_solid.svg';
const TheCircleLoading = ({height, width}) => {
  return (
    <AnimatableView animation={'rotate'} iterationCount={'infinite'} useNativeDriver={true} >
      <TheCircleLogo
        height={height ?? scale(100)}
        width={width ?? scale(100)}
      />
    </AnimatableView>
  );
};

export default TheCircleLoading;
