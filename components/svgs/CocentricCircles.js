import React from 'react';
import * as Animatable from 'react-native-animatable';
import { scale } from 'react-native-size-matters';
import Svg, { Circle } from 'react-native-svg';

const CocentricCircles = ({
  innerCircleColor,
  outerCircleColor,
  animatableViewProps,
}) => {
  return (
    <Animatable.View {...animatableViewProps}>
      <Svg height={scale(300)} width={scale(300)}>
        <Circle cx={scale(150)} cy={scale(150)} r={scale(150)} fill={outerCircleColor} />
        <Circle
          cx={scale(150)}
          cy={scale(150)}
          r={scale(100)}
          fill={innerCircleColor}
        />
      </Svg>
    </Animatable.View>
  );
};

export default CocentricCircles;
