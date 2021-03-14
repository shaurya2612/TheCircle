import React, {useEffect} from 'react';
import {useState} from 'react';
import {
  Dimensions,
  ImageBackground,
  View,
  StyleSheet,
  TouchableHighlight,
} from 'react-native';
import {AutoDragSortableView, DragSortableView} from 'react-native-drag-sort';
import {launchImageLibrary} from 'react-native-image-picker';
import {
  moderateScale,
  moderateVerticalScale,
  verticalScale,
} from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
// import * as ImagePicker from "expo-image-picker";
import {useDispatch, useSelector} from 'react-redux';
import {setSignupFormData} from '../store/actions/signupForm';

const {height, width} = Dimensions.get('window');
const parentWidth = width;
const childrenWidth = width / 3 - 2 * moderateScale(7, 0.4);
const childrenHeight = height / 6;
const marginChildrenTop = moderateVerticalScale(7, 0.4);
const marginChildrenBottom = moderateVerticalScale(7, 0.4);
const marginChildrenLeft = moderateScale(7, 0.4);
const marginChildrenRight = moderateScale(7, 0.4);

export const SignupUserPhotoGrid = () => {
  const signUpFormData = useSelector(state => state.signupForm);
  const data = signUpFormData.userPhotos;
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const dispatch = useDispatch();

  const pickImage = () => {
    let imageUri = null;
    launchImageLibrary({mediaType: 'photo', quality: 1}, response => {
      if (!response.didCancel) imageUri = response.uri;
      console.log('1', imageUri);
    });
    console.log('2', imageUri);
    return imageUri;
  };

  const calculateFixedArray = () => {
    var arr = [];
    var i = 5;
    while (data[i] === null) {
      arr.unshift(i);
      i--;
    }
    return arr;
  };

  const renderItem = (item, index) => {
    return (
      <View style={localStyles.item}>
        {item ? (
          <ImageBackground
            style={localStyles.item_children}
            source={{uri: item}}>
            {isDeleteMode ? (
              <TouchableHighlight
                onPress={() => {
                  const newData = [...data];
                  newData.splice(index, 1);
                  newData.push(null);
                  dispatch(
                    setSignupFormData({
                      ...signUpFormData,
                      userPhotos: newData,
                    }),
                  );
                }}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'black',
                  padding: moderateVerticalScale(10, 0.4),
                  borderRadius: moderateVerticalScale(20, 0.4),
                  position: 'absolute',
                  right: verticalScale(-5),
                  top: verticalScale(-5),
                }}>
                <Icon
                  color={'white'}
                  name={'x'}
                  size={moderateVerticalScale(15, 0.4)}
                />
              </TouchableHighlight>
            ) : null}
          </ImageBackground>
        ) : (
          <View style={{...localStyles.item_children, ...localStyles.add_icon}}>
            <Icon name="plus" size={moderateScale(30, 0.4)} color="black" />
          </View>
        )}
      </View>
    );
  };

  return (
    <View>
      <AutoDragSortableView
        dataSource={data}
        parentWidth={parentWidth}
        childrenWidth={childrenWidth}
        childrenHeight={childrenHeight}
        marginChildrenTop={marginChildrenTop}
        marginChildrenBottom={marginChildrenBottom}
        marginChildrenLeft={marginChildrenLeft}
        marginChildrenRight={marginChildrenRight}
        renderItem={(item, index) => renderItem(item, index)}
        keyExtractor={(item, index) => index}
        onDataChange={data => {
          dispatch(
            setSignupFormData({
              ...signUpFormData,
              userPhotos: data,
            }),
          );
        }}
        onClickItem={async (data, item, index) => {
          if (item) setIsDeleteMode(!isDeleteMode);
          else {
            launchImageLibrary({mediaType: 'photo', quality: 1}, response => {
              if (response.didCancel) return;
              const newImage = response.uri;
              // console.log('new Image', newImage);
              if (newImage) {
                for (var i = 0; i < 6; i++) {
                  if (data[i] === null) {
                    data[i] = newImage;
                    break;
                  }
                }
                dispatch(
                  setSignupFormData({
                    ...signUpFormData,
                    userPhotos: data,
                  }),
                );
              }
            });
          }
        }}
        fixedItems={calculateFixedArray()}
      />
    </View>
  );
};

const localStyles = StyleSheet.create({
  item: {
    width: childrenWidth,
    height: childrenHeight,
    backgroundColor: 'red',
    borderRadius: moderateScale(4, 0.4),
  },
  item_children: {
    width: childrenWidth,
    height: childrenHeight,
    backgroundColor: '#f0ffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(4, 0.4),
  },
  item_icon: {
    width: childrenWidth - 4 - 8,
    height: childrenHeight - 4 - 8,
    resizeMode: 'contain',
    position: 'absolute',
  },
  item_delete_icon: {
    width: 14,
    height: 14,
    position: 'absolute',
    right: 1,
    top: 1,
  },
  add_icon: {
    //   position:"absolute"
  },
});

export default SignupUserPhotoGrid;
