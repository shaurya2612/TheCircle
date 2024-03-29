import React, {useEffect} from 'react';
import {useState} from 'react';
import {
  Dimensions,
  ImageBackground,
  View,
  StyleSheet,
  TouchableHighlight,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import {AutoDragSortableView, DragSortableView} from 'react-native-drag-sort';
import {launchImageLibrary} from 'react-native-image-picker';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
  verticalScale,
} from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import {useDispatch, useSelector} from 'react-redux';
import {setErrorMessage} from '../store/actions/error';
import {setSignupFormData} from '../store/actions/signupForm';
import styles from '../styles';

const {height, width} = Dimensions.get('window');
const parentWidth = width;
const childrenWidth = width / 3 - 2 * scale(7) - 0.001;
const childrenHeight = height / 5;
const marginChildrenTop = verticalScale(7);
const marginChildrenBottom = verticalScale(7);
const marginChildrenLeft = scale(7);
const marginChildrenRight = scale(7);

export const SignupUserPhotoGrid = () => {
  const signUpFormData = useSelector(state => state.signupForm);
  const data = signUpFormData.userPhotos;
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const dispatch = useDispatch();

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
          <View
            style={{
              ...localStyles.item_children,
              ...localStyles.add_icon,
              ...styles.elevation_medium,
            }}>
            <Icon name="plus" size={scale(30)} color="black" />
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
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              launchImageLibrary(
                {mediaType: 'photo', quality: 0.8},
                response => {
                  if (response.errorMessage) {
                    dispatch(setErrorMessage({message: response.errorMessage}));
                    return;
                  }
                  if (response.didCancel) return;
                  const newImage = response.uri;
                  if (newImage) {
                    if (response.fileSize / 1048576 > 10) {
                      dispatch(
                        setErrorMessage({
                          message: 'Max file size for upload is 10 MB',
                        }),
                      );
                      return;
                    }
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
                },
              );
            }
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
    backgroundColor: '#ffffff',
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
