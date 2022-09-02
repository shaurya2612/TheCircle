import React from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import AppText from '../../components/AppText';
import CustomHeader from '../../components/CustomHeader';
import CustomSafeAreaView from '../../components/CustomSafeAreaView';
import {faqs} from '../../constants/official';
import styles from '../../styles';

const FAQsScreen = props => {
  const renderItem = ({item, index}) => (
    <View
      style={{
        minHeight: scale(200),
        minWidth: '50%',
        borderRadius: scale(20),
        backgroundColor: 'white',
        margin: scale(10),
        overflow: 'hidden',
        ...styles.elevation_medium,
      }}>
      {/* Question  */}
      <View
        style={{
          backgroundColor: 'black',
          paddingVertical: scale(20),
          paddingHorizontal: scale(10),
        }}>
        <View>
          <AppText
            style={{
              fontSize: scale(18),
              color: 'white',
            }}>
            {item.question}
          </AppText>
        </View>
      </View>

      {/* Answer */}
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          paddingHorizontal: scale(10),
          paddingVertical: scale(20),
        }}>
        <AppText
          style={{
            fontSize: scale(15),
            color: 'black',
            textAlign: 'justify',
            lineHeight: verticalScale(20),
            // fontWeight: "bold",
          }}>
          {item.answer}
        </AppText>
      </View>
    </View>
  );

  return (
    <CustomSafeAreaView style={{...styles.rootView, backgroundColor: 'white'}}>
      <CustomHeader style={{height: verticalScale(40)}}>
        <TouchableOpacity
          onPress={() => {
            props.navigation.goBack();
          }}
          style={{
            width: scale(40),
            justifyContent: 'center',
            height: '100%',
            alignItems: 'center',
          }}>
          <Icon color={'black'} name={'arrow-left'} size={scale(20)} />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            paddingHorizontal: scale(10),
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'black',
          }}>
          <AppText
            style={{
              fontSize: scale(18),
              color: 'black',
            }}>
            {'FAQs'}
          </AppText>
        </View>

        <View
          style={{
            width: scale(40),
            flexDirection: 'row',
            justifyContent: 'center',
            height: '100%',
            alignItems: 'center',
          }}
        />
      </CustomHeader>

      <FlatList
        data={faqs}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </CustomSafeAreaView>
  );
};

export default FAQsScreen;
