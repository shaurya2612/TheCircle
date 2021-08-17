import React, {useCallback, memo, useRef, useState} from 'react';
import {
  FlatList,
  View,
  Dimensions,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import colors from '../../constants/colors';
import styles from '../../styles';
import Icon from 'react-native-vector-icons/Feather';
import {scale} from 'react-native-size-matters';

const {width: windowWidth, height: windowHeight} = Dimensions.get('window');

const localStyles = StyleSheet.create({
  slide: {
    height: windowHeight,
    width: windowWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideImage: {aspectRatio: 9 / 16, width: '100%', height: undefined},
  slideTitle: {fontSize: 24},
  slideSubtitle: {fontSize: 18},

  pagination: {
    position: 'absolute',
    bottom: 8,
    width: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  paginationDotActive: {backgroundColor: 'white'},
  paginationDotInactive: {backgroundColor: 'gray'},

  carousel: {flex: 1},

  icon: {
    marginHorizontal: scale(2),
    position: 'absolute',
    zIndex: 1,
    right: '2%',
    top: '1%',
    alignSelf: 'center',
    shadowOpacity: 2,
    textShadowRadius: 10,
    textShadowOffset: {width: 0, height: 3},
  },
});

const data = [
  {image: require('../../assets/how-it-works/1.png')},
  {image: require('../../assets/how-it-works/2.png')},
  {image: require('../../assets/how-it-works/3.png')},
  {image: require('../../assets/how-it-works/4.png')},
  {image: require('../../assets/how-it-works/5.png')},
  {image: require('../../assets/how-it-works/6.png')},
  {image: require('../../assets/how-it-works/7.png')},
];

const Slide = memo(function Slide({item, index}) {
  return (
    <View style={localStyles.slide}>
      {/* <One width={'100%'} height={'100%'} /> */}
      <Image source={item.image} style={localStyles.slideImage} />
      <Text style={localStyles.slideTitle}>{item.title}</Text>
      <Text style={localStyles.slideSubtitle}>{item.subtitle}</Text>
    </View>
  );
});

function Pagination({index}) {
  return (
    <View style={localStyles.pagination} pointerEvents="none">
      {data.map((_, i) => {
        return (
          <View
            key={i}
            style={[
              localStyles.paginationDot,
              index === i
                ? localStyles.paginationDotActive
                : localStyles.paginationDotInactive,
            ]}
          />
        );
      })}
    </View>
  );
}

export default function HowItWorksScreen({onPressX}) {
  const [index, setIndex] = useState(0);
  const indexRef = useRef(index);
  indexRef.current = index;
  const onScroll = useCallback(event => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);

    const distance = Math.abs(roundIndex - index);

    // Prevent one pixel triggering setIndex in the middle
    // of the transition. With this we have to scroll a bit
    // more to trigger the index change.
    const isNoMansLand = 0.4 < distance;

    if (roundIndex !== indexRef.current && !isNoMansLand) {
      setIndex(roundIndex);
    }
  }, []);

  const flatListOptimizationProps = {
    initialNumToRender: 0,
    maxToRenderPerBatch: 1,
    removeClippedSubviews: true,
    scrollEventThrottle: 16,
    windowSize: 2,
    keyExtractor: useCallback((s, idx) => String(idx), []),
    getItemLayout: useCallback(
      (_, index) => ({
        index,
        length: windowWidth,
        offset: index * windowWidth,
      }),
      [],
    ),
  };

  const renderItem = useCallback(function renderItem({item, index}) {
    return <Slide item={item} index={index} />;
  }, []);

  return (
    <View style={[styles.rootView, {backgroundColor: colors.primary}]}>
      <Icon
        name="x"
        color={'white'}
        style={localStyles.icon}
        size={scale(25)}
        onPress={onPressX}
      />
      <FlatList
        data={data}
        style={localStyles.carousel}
        renderItem={renderItem}
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={onScroll}
        {...flatListOptimizationProps}
      />
      <Pagination index={index}></Pagination>
    </View>
  );
}
