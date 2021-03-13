import React, { useEffect } from "react";
import { useState } from "react";
import {
  Dimensions,
  ImageBackground,
  View,
  StyleSheet,
  TouchableHighlight,
  ActivityIndicator,
} from "react-native";
import { AutoDragSortableView, DragSortableView } from "react-native-drag-sort";
import {
  moderateScale,
  moderateVerticalScale,
  verticalScale,
} from "react-native-size-matters";
import Icon from "react-native-vector-icons/Feather";
// import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { setSignupFormData } from "../store/actions/signupForm";
import colors from "../constants/colors";
import { forwardRef } from "react";
import { useImperativeHandle } from "react";
import { uploadUserPhotos } from "../firebase/utils";
import { setUserState, updateUserPhotos } from "../store/actions/user";

const { height, width } = Dimensions.get("window");
const parentWidth = width;
const childrenWidth = width / 3 - 2 * moderateScale(7, 0.4);
const childrenHeight = height / 6;
const marginChildrenTop = moderateVerticalScale(7, 0.4);
const marginChildrenBottom = moderateVerticalScale(7, 0.4);
const marginChildrenLeft = moderateScale(7, 0.4);
const marginChildrenRight = moderateScale(7, 0.4);

export const EditUserPhotoGrid = forwardRef(
  ({ onDragStart, onDragEnd }, ref) => {
    const userState = useSelector((state) => state.user);
    const { userPhotosUpdated, userPhotos } = userState;
    const [data, setData] = useState(
      userPhotosUpdated ? userPhotos : [null, null, null, null, null, null]
    );
    const dispatch = useDispatch();
    const [isDeleteMode, setIsDeleteMode] = useState(false);

    useEffect(() => {
      setData(
        userPhotosUpdated ? userPhotos : [null, null, null, null, null, null]
      );
    }, [userPhotosUpdated]);

    useEffect(() => {
      if (data.filter((item) => item !== null).length <= 1)
        setIsDeleteMode(false);
    }, [data]);

    useImperativeHandle(ref, () => ({
      savePhotos() {
        // checking if photos have changed or not
        let changed = false;
        for (var i = 0; i < 6; i++) {
          if (data[i] !== userPhotos[i]) {
            changed = true;
            break;
          }
        }
        if (!changed) return;
        dispatch(updateUserPhotos(data));
      },
    }));

    const pickImage = async () => {
      // let result = await ImagePicker.launchImageLibraryAsync({
      //   mediaTypes: ImagePicker.MediaTypeOptions.All,
      //   allowsEditing: false,
      //   quality: 1,
      // });
      // if (!result.cancelled) {
      //   return result.uri;
      // } else {
      //   return null;
      // }
      //TODO
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
              source={{ uri: item }}
            >
              {isDeleteMode ? (
                <TouchableHighlight
                  onPress={() => {
                    const newData = [...data];
                    newData.splice(index, 1);
                    newData.push(null);
                    setData(newData);
                  }}
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "black",
                    padding: moderateVerticalScale(10, 0.4),
                    borderRadius: moderateVerticalScale(20, 0.4),
                    position: "absolute",
                    right: verticalScale(-5),
                    top: verticalScale(-5),
                  }}
                >
                  <Icon
                    color={"white"}
                    name={"x"}
                    size={moderateVerticalScale(15, 0.4)}
                  />
                </TouchableHighlight>
              ) : null}
            </ImageBackground>
          ) : (
            <View
              style={{ ...localStyles.item_children, ...localStyles.add_icon }}
            >
              {userPhotosUpdated ? (
                <Icon name="plus" size={moderateScale(30, 0.4)} color="black" />
              ) : (
                <ActivityIndicator size="small" color={colors.primary} />
              )}
            </View>
          )}
        </View>
      );
    };

    return (
      <View>
        <AutoDragSortableView
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
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
          onDataChange={(data) => {
            setData(data);
          }}
          onClickItem={async (data, item, index) => {
            if (!userPhotosUpdated) return;
            if (item) {
              if (data.filter((i) => i !== null).length !== 1)
                setIsDeleteMode(!isDeleteMode);
            } else {
              const newImage = await pickImage();
              if (newImage) {
                for (var i = 0; i < 6; i++) {
                  if (data[i] === null) {
                    data[i] = newImage;
                    break;
                  }
                }
                setData(data);
              }
            }
          }}
          fixedItems={calculateFixedArray()}
        />
      </View>
    );
  }
);

const localStyles = StyleSheet.create({
  item: {
    width: childrenWidth,
    height: childrenHeight,
    backgroundColor: "red",
    borderRadius: moderateScale(4, 0.4),
  },
  item_children: {
    width: childrenWidth,
    height: childrenHeight,
    backgroundColor: "#f0ffff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: moderateScale(4, 0.4),
  },
  item_icon: {
    width: childrenWidth - 4 - 8,
    height: childrenHeight - 4 - 8,
    resizeMode: "contain",
    position: "absolute",
  },
  item_delete_icon: {
    width: 14,
    height: 14,
    position: "absolute",
    right: 1,
    top: 1,
  },
  add_icon: {
    //   position:"absolute"
  },
});

export default EditUserPhotoGrid;
