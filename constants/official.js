import React from 'react';
import {Text, View} from 'react-native';
import {scale} from 'react-native-size-matters';

export const faqs = [
  {
    question:
      'I clicked on the start matching button but didn’t match with anyone. Why is that?',
    answer:
      'Circle works in the way that it connects you with your friends friends. So check if you’ve added your friends. Sometimes the case maybe if you have a small pool that your potential matches are talking to someone and aren’t available. In that case you might be in the waiting list till someone is free. You can increase your circle in that case. Add more friends. This is a rare case though.',
  },
  {
    question: 'How do I increase my dating pool?',
    answer: 'Just add more of your friends',
  },
  {
    question:
      'I liked the person I am talking to. How should I get to know   their identity?',
    answer:
      'If you like the person you are talking to and want to know them further press the 3 dots on the top and click on the like button. If both of you have liked each other your identities will be revealed. Your chat will be moved to the matches section (heart button).',
  },
  {
    question:
      'What happens if one person presses the like button and the other doesn’t?',
    answer:
      'People move at different paces and may take time to decide whether they like someone. If one of you presses the like button your chat will continue in the same manner as before till the time the other person presses the like button as well. In case one person doesn’t press the like button and presses the skip button you both will connect with new people without your identities being revealed.',
  },
  {
    question: 'Can I talk to my friends on the app?',
    answer:
      'No, you won’t be able to talk to your friends on the app as they will strictly act as matchmakers',
  },
  {
    question: 'Can I match with my friends on the app?',
    answer:
      'No, you won’t match with your friends on the app as they act as your matchmakers. So our advice, if you like someone, don’t add them as your friend! You will just end up friend zoning yourself',
  },
];

export const termsOfUse = [
  {
    heading: 'Terms of Use',
    text: (
      <Text>
        These terms of use apply to your use of the Circle mobile application
        (iOS application / Android application - hereafter the "App"), provided
        by __________ (hereafter "we" or "us" or "our" or "Circle"). Please go
        through them carefully. If you object to anything in the terms of use or
        our privacy policy, please do not use the app.
      </Text>
    ),
  },
  {
    heading: 'Acceptance of Terms of Use Agreement',
    text: (
      <Text>
        We reserve the right, at our discretion, to make changes to the terms of
        use and privacy policy at any time. We may do this for a variety of
        reasons including to reflect changes in new features, changes in
        business practices or requirements of the law. The most updated version
        is available on our app with the date of last revision. Please check the
        terms of use and privacy policy periodically for changes as all
        modifications are effective upon publication. Continued use of the
        Circle app after revision indicates the user's acceptance of the terms
        of use. We will notify Circle users when modifications are made to the
        terms of use and/or privacy policy via our App.
      </Text>
    ),
  },
  {
    heading: 'Eligibility Criteria',
    text: (
      <View>
        <View>
          <Text style={{flexWrap:"wrap", flex: 1}}>
            Circle is a social platform with the purpose to connect people who
            have mutual friends. By creating an account on Circle you hereby
            warrant the following:
          </Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text>{'\u2022'}</Text>
          <Text style={{flex: 1, paddingLeft: 5}}>
            you are atleast 18 years of age
          </Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text>{'\u2022'}</Text>
          <Text style={{flex: 1, paddingLeft: 5}}>
            you can form a binding contract with Circle
          </Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text>{'\u2022'}</Text>
          <Text style={{flex: 1, paddingLeft: 5}}>
            you are not barred from using the Service under the United States
            laws or any other jurisdiction worldwide
          </Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text>{'\u2022'}</Text>
          <Text style={{flex: 1, paddingLeft: 5}}>
            you do not have any unspent convictions, or are subject to any court
            order, relating to assault, violence, sexual misconduct or
            harassment
          </Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text>{'\u2022'}</Text>
          <Text style={{flex: 1, paddingLeft: 5}}>
            you will not use our App if you have been removed from Circle
          </Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text>{'\u2022'}</Text>
          <Text style={{flex: 1, paddingLeft: 5}}>
            you do not appear on the U.S. Treasury Department's list of
            Specially Designated Nationals or face any other similar prohibition
          </Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text>{'\u2022'}</Text>
          <Text style={{flex: 1, paddingLeft: 5}}>
            you will comply with this agreement and all applicable local, state,
            national and international laws, rules and regulations
          </Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text>{'\u2022'}</Text>
          <Text style={{flex: 1, paddingLeft: 5}}>
            we are entitled to remove your accounts with Circle permanently if
            any of the above conditions are not met
          </Text>
        </View>
      </View>
    ),
  },
];
