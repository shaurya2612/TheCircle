import React from 'react';
import {Linking, Text, TouchableWithoutFeedback, View} from 'react-native';
import {scale} from 'react-native-size-matters';

export const faqs = [
  {
    question:
      'I clicked on the start matching button but didn’t match with anyone. Why is that?',
    answer:
      'Circle works in the way that it connects you with your friend\'s friends. Sometimes the case maybe if you have a small pool that your potential matches are talking to someone and aren’t available. In that case you might be in the waiting list till someone is free. You can increase your friends in that case so you have a larger dating pool to search from.',
  },
  {
    question: 'How do I increase my dating pool?',
    answer: 'Just add more of your friends',
  },
  {
    question:
      'I liked the person I am talking to. How should I get to know their identity?',
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
      'No, you won’t be able to talk to your friends on the app as they will strictly act as matchmakers.',
  },
  {
    question: 'Can I match with my friends on the app?',
    answer:
      'No, you won’t match with your friends on the app as they act as your matchmakers. So our advice, if you like someone, don’t add them as your friend! You will just end up friend zoning yourself.',
  },
];

export const Bullet = props => {
  return (
    <View style={{flexDirection: 'row'}}>
      <Text>{'\u2022'}</Text>
      <Text style={{flex: 1, paddingLeft: 5}}>{props.children}</Text>
    </View>
  );
};

export const termsOfUse = [
  {
    heading: 'Terms of Use',
    text: (
      <Text>
        These terms of use apply to your use of the Circle mobile application
        (iOS application / Android application - hereafter the "App"), provided
        by Cherry Pi Pvt Ltd (hereafter "we" or "us" or "our" or "Circle"). Please go
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
          <Text style={{flexWrap: 'wrap', flex: 1}}>
            Circle is a social platform with the purpose to connect people who
            have mutual friends. By creating an account on Circle you hereby
            warrant the following:
          </Text>
        </View>
        <Bullet>you are atleast 18 years of age</Bullet>
        <Bullet>you can form a binding contract with Circle</Bullet>
        <Bullet>
          you are not barred from using the Service under the United States laws
          or any other jurisdiction worldwide
        </Bullet>
        <Bullet>
          you do not have any unspent convictions, or are subject to any court
          order, relating to assault, violence, sexual misconduct or harassment
        </Bullet>
        <Bullet>
          you will not use our App if you have been removed from Circle
        </Bullet>
        <Bullet>
          you do not appear on the U.S. Treasury Department's list of Specially
          Designated Nationals or face any other similar prohibition
        </Bullet>
        <Bullet>
          you will comply with this agreement and all applicable local, state,
          national and international laws, rules and regulations
        </Bullet>
        <Bullet>
          we are entitled to remove your accounts with Circle permanently if any
          of the above conditions are not met
        </Bullet>
      </View>
    ),
  },
  {
    heading: 'Community Guidelines',
    text: (
      <View>
        <Bullet>
          You will not post, or transmit to other users, any defamatory,
          inaccurate, abusive, obscene, profane, offensive, sexually oriented,
          threatening, harassing, racially offensive, or illegal material, or
          any material that infringes or violates another party's rights.
        </Bullet>
        <Bullet>
          You will not use a robot, spider, site search/retrieval application,
          or other manual or automatic device or process to retrieve, index,
          data mine, or in any way reproduce, reverse engineer or bypass the
          navigational structure or presentation of the service or its contents.
        </Bullet>
        <Bullet>
          You will not use the Circle app for soliciting your own business
          activities or for commercial purposes.
        </Bullet>
        <Bullet>
          You will not provide inaccurate, misleading or false information to
          Circle or to any other user.
        </Bullet>
        <Bullet>You will not publish links to other websites</Bullet>
        <Bullet>
          You are not permitted to share details of Circle login with another
          person.
        </Bullet>
        <Bullet>
          Your safety and personal integrity is important to us. Your (chat)
          messages are strictly confidential
        </Bullet>
        <Bullet>
          You will not upload viruses or other malicious code or compromise the
          security of the services offered by Circle in any way.
        </Bullet>
        <Bullet>
          You will not post content that is vulgar, defamatory, controversial,
          violative of copyrights and trademark rights, violative of any law
          that the publishing of such content may be subject to
        </Bullet>
        <Bullet>
          You will use in a lawful, responsible and respectful manner, any
          information provided by another Circle user.
        </Bullet>
        <Bullet> You will not use the service to disrupt public order.</Bullet>
        <Bullet>
          You will not infringe upon the normal running of Circle or its
          infrastructure in any way.
        </Bullet>
        <Bullet>
          You will immediately cease contacting any user who asks you to stop
          contacting them.
        </Bullet>
        <Bullet>
          You will not post, copy, modify, disclose or distribute via our App
          any confidential information; or any other material which is subject
          to our or a third party's (intellectual property) rights, without
          first obtaining our or the relevant third party's prior written
          consent.
        </Bullet>
        <Bullet>
          You agree to compensate us for any claim or damages (including any
          legal fees in relation to such claim or damages) demanded by a third
          party in respect of any matter relating to or arising from any breach
          or suspected breach by you of these terms of use or the rights of a
          third party. We reserve the right to issue warnings, suspend access to
          Your Account or terminate Your Account, if we reasonably consider that
          you are in breach of these terms of use.
        </Bullet>
      </View>
    ),
  },
  {
    heading: 'Creating Your Account',
    text: (
      <View>
        <Bullet>
          If you want to use the App, you first need to register. In order to
          register, you need to authenticate yourself using your phone number.
          After registering, you can create a personal account ("Your Account").
          When creating Your Account, we will need your pictures. You are
          further invited to provide us with more information about yourself.{' '}
        </Bullet>
        <Bullet>
          The registration and creation of Your Account qualifies you as a user.
          Users can be suspended by us if we receive several complaints from
          other users.
        </Bullet>
        <Bullet>
          Circle does not accept any responsibility for the login credentials
          used to sign in to the service. You accept sole responsibility for all
          activities that occur under those credentials.
        </Bullet>
        <Bullet>
          By registering for Circle, you grant us permission to send you SMS
          notifications about your profile related activities.
        </Bullet>
      </View>
    ),
  },
  {
    heading: 'License',
    text: (
      <Text>
        The rights granted by Circle to the user are restricted to private and
        personal use. As a user of Circle, you grant Circle a free-of-charge,
        non-exclusive, international and permanent license for the use,
        reproduction, representation, modification and translation of any basic
        intellectual property-related component (text, emojis, photos, videos
        etc.) that it may provide through the App for the non-exclusive purpose
        of communicating with other users on Circle. Circle can use such content
        in any format on the App, ads, other shielded areas accessible by other
        users and for other internal purposes. Circle reserves the right at any
        time to modify or discontinue, temporarily or permanently, the service
        (or any part thereof) with or without notice. You agree that Circle
        shall not be liable to you or to any third party for any modification,
        suspension or discontinuance of the service.
      </Text>
    ),
  },
  {
    heading: 'Safety of Members',
    text: (
      <Text>
        The company currently does not conduct any criminal and/or other formal
        background checks of all its users and also does not attempt to verify
        the statements of its users. You are solely responsible for taking all
        appropriate safety precautions in connection with the use of the app and
        contacting other users. You accept that there are risks interacting
        online or offline with other users, including dating and meeting other
        users. We do not guarantee or verify the accuracy of information
        provided to you by other users. Circle makes every effort to keep the
        information made available on the app accurate and up to date, but we do
        not guarantee that the information is accurate, complete or current. No
        rights can be derived from it. Any reliance on the provided information
        is at your own risk. We do not warrant that the app will be available
        uninterrupted and in a fully operating condition. All content and
        services on the app are provided on an "as is" and "as available" basis.
        Any decisions or actions taken by you on the basis of the information
        provided on or via the app are at your sole discretion and risk. Circle
        shall not collect data from minors. Should a Member lie about his/her
        date of birth, and particularly if he/she fraudulently claims to be over
        18 years of age, the parents of the minor in question should inform
        Circle of this by sending an e-mail thecircledating@gmail.com requesting
        the data to be deleted. Circle commits to deleting all data on the minor
        in question as soon as possible.
      </Text>
    ),
  },
  {
    heading: 'Deletion of Account',
    text: (
      <View>
        <Text>
          A user of Circle may decide at any time and without notice to delete
          their account. If this user wishes to use Circle again, they will be
          required to register once again. If a user deletes their account:
        </Text>
        <Bullet>
          Their profile will be removed from the list of profiles on Circle
        </Bullet>
        <Bullet>The user cannot reactivate their deleted profile</Bullet>
        <Text>
          Circle reserves the right to terminate your membership, to suspend a
          profile or to disable access with respect to a breach of any of the
          terms with or without notice.
        </Text>
      </View>
    ),
  },
  {
    heading: 'Limitation of Liability and Disputes',
    text: (
      <View>
        <Bullet>
          You are solely responsible for your interactions with other Circle
          users. Circle reserves the right to, but is not obliged to, monitor
          the resolution of any disputes arising between Circle users. We are
          not obliged to become involved in any domestic or private disputes
          between users and do not provide any arbitration or settlement
          service. Circle also reserves the right to take action, as deemed
          appropriate against errant users.
        </Bullet>
        <Bullet>
          In no event shall Circle, its affiliates, employees, agents, licensors
          or partners be liable for any damages whatsoever, whether direct,
          indirect, general, special, compensatory, consequential, and/or
          incidental, arising out of or relating to the conduct of you or anyone
          else in connection with the use of the service, including without
          limitation, bodily injury, emotional distress, loss of use, loss of
          data, loss caused by a computer or electronic virus, loss of income or
          profit, loss of or damage to property, wasted management or office
          time, breach of contract or claims of third parties or other losses of
          any kind or character, even if Circle has been advised of the
          possibility of such damages or losses, arising out of or in connection
          with the use of Circle and/or any other damages resulting from
          communications or meetings with other users of this service or persons
          you meet through this service.
        </Bullet>
        <Bullet>
          We will provide Circle service to you with reasonable skill and care.
          We do not make any warranties or representations (neither express nor
          implied) with respect to the App or the associated services.
        </Bullet>
        <Bullet>
          You hereby expressly agree not to hold Circle liable for any
          instruction, advice, or services delivered through our app. Circle
          expressly disclaims any liability whatsoever for any damage, suits,
          claims, and/or controversies that arise or relate in any way to our
          website or app.
        </Bullet>
        <Bullet>
          You expressly understand and agree that Circle will not be liable for
          direct, indirect, incidental, special, consequential, or exemplary
          damages, including, but not limited to, damages for loss of profits,
          goodwill, use, data or other intangible losses, resulting from: a) the
          use or inability to use the app; b) the cost of procurement of
          substitute goods and services resulting from any goods, data,
          information or services obtained or messages received or transactions
          entered into through, from, or as a result of the app; c) unauthorized
          access to or alteration of your transmissions or data; d) statements
          or conduct of any user or third party on the app; e) your reliance on
          content data made available by us; or f) any other matter relating to
          the app.
        </Bullet>
        <Bullet>
          Nothing in these terms of use shall exclude or limit our liability for
          our fraudulent misrepresentation or for death or personal injury
          resulting from our negligence or the negligence of our employees or
          agents.
        </Bullet>
      </View>
    ),
  },
  {
    heading: 'Indemnity',
    text: (
      <Text>
        To the full extent permitted under Indian laws, you agree to defend,
        indemnify and hold harmless Circle, it's officers, directors and
        employees from and against all liabilities, demands, claims, damages,
        complaints, losses, costs, and expenses, including attorney's fees, due
        to, arising out of, or relating in any way to your access to or use of
        the services, your content, or your breach of this agreement.
      </Text>
    ),
  },
  {
    heading: 'Disclaimers',
    text: (
      <Text>
        Circle does not represent or warrant that (a) any matches or profiles
        presented will be compatible and/or guarantee success in finding a
        partner, or that (b) the service will be uninterrupted, secure or error
        free, (c) any defects or errors in the service will be corrected, (d)
        that any content or information you obtain on or through the service
        will be accurate, or (e) any suggestions or feedback will be
        incorporated. Circle takes no responsibility for any content that you or
        another user or third party posts, sends or receives through the
        service. Any material downloaded or otherwise obtained through the use
        of the service is accessed at your own discretion and risk. Circle
        disclaims and takes no responsibility for any conduct of you or any
        other user, on or off the service.
      </Text>
    ),
  },
  {
    heading: 'Advertising and External Links',
    text: (
      <Text>
        The service may provide, or third parties may provide, links to other
        world wide web sites or resources. Because Circle has no control over
        such sites and resources, you acknowledge and agree that Circle is not
        responsible for the availability of such external sites or resources, is
        not responsible or liable for any content, advertising, products or
        other materials on or available from such sites or resources. You
        further acknowledge and agree that Circle shall not be responsible or
        liable, directly or indirectly, for any damage or loss caused or alleged
        to be caused by or in connection with the use of, or reliance upon, any
        such content, goods or services available on or through any such site or
        resource. Please go through the terms of use and privacy policies of
        such sites carefully as you would be bound by those during such
        interactions.
      </Text>
    ),
  },
  {
    heading: 'Copyright Infringement claims',
    text: (
      <View>
        <Text>
          If you believe that your work has been copied and posted on the
          Service in a way that constitutes copyright infringement, contact us
          at thecircledating@gmail.com and provide us with the following
          details-
        </Text>
        <Bullet>
          An electronic or physical signature of the person authorized to act on
          behalf of the owner of the copyright interest
        </Bullet>
        <Bullet>
          A description of the copyrighted work that you claim has been
          infringed
        </Bullet>
        <Bullet>
          A description of where the material that you claim is infringing is
          located on the app
        </Bullet>
        <Bullet>
          Your full name, address, telephone number, and email address
        </Bullet>
        <Bullet>
          A written statement by you that you have a good faith belief that the
          disputed use is not authorized by the copyright owner, its agent, or
          the law
        </Bullet>
        <Bullet>
          A statement by you, made under penalty of perjury, that the above
          information in your notice is accurate and that you are the copyright
          owner or authorized to act on the copyright owner's behalf
        </Bullet>
      </View>
    ),
  },
  {
    heading: 'Miscellaneous',
    text: (
      <View>
        <Bullet>
          Circle or Cherry Pi Pvt Ltd can be acquired for a part or in whole by another
          company. This will be done without (written) notice.
        </Bullet>
        <Bullet>
          If you breach these terms of use and we take no action against you, we
          will still be entitled to use our rights and remedies in any other
          situation where you breach these terms of use.
        </Bullet>
        <Bullet>
          If any part of these terms of use is disallowed or found to be void by
          any court or regulator, the other provisions shall continue to apply.
          We will adjust these terms of use as necessary, in which case the
          invalid terms will be replaced by valid terms that differ the least
          from the concerned invalid terms.
        </Bullet>
        <Bullet>
          These terms of use are not intended to give rights to anyone except
          you and us.
        </Bullet>
        <Bullet>
          We reserve the right, at our discretion, to make changes to the terms
          of use and privacy policy at any time. The most updated version is
          available on our app. Please check the terms of use and privacy policy
          periodically for changes as all modifications are effective upon
          publication. Continued use of the Circle app after revision indicates
          the user's acceptance of the terms of use.
        </Bullet>
      </View>
    ),
  },
];

export const privacyPolicy = [
  {
    heading: 'Privacy Policy',
    text: (
      <Text>
        Cherry Pi Pvt Ltd built the Circle app as an Ad Supported app. This SERVICE is
        provided by Cherry Pi Pvt Ltd at no cost and is intended for use as is. This
        page is used to inform visitors regarding our policies with the
        collection, use, and disclosure of Personal Information if anyone
        decided to use our Service. If you choose to use our Service, then you
        agree to the collection and use of information in relation to this
        policy. The Personal Information that we collect is used for providing
        and improving the Service. We will not use or share your information
        with anyone except as described in this Privacy Policy. The terms used
        in this Privacy Policy have the same meanings as in our Terms and
        Conditions, which is accessible at Circle unless otherwise defined in
        this Privacy Policy.
      </Text>
    ),
  },

  {
    heading: 'Information Collection and Use',
    text: (
      <View>
        <Text>
          For a better experience, while using our Service, we may require you
          to provide us with certain personally identifiable information,
          including but not limited to phone number, age, pictures, education,
          gender. The information that we request will be retained by us and
          used as described in this privacy policy. The app does use third party
          services that may collect information used to identify you. Link to
          privacy policy of third party service providers used by the app
        </Text>
        <TouchableWithoutFeedback
          onPress={() => {
            Linking.openURL('https://policies.google.com/privacy');
          }}>
          <Bullet>Google Play Services</Bullet>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => {
            Linking.openURL(
              'https://support.google.com/admob/answer/6128543?hl=en',
            );
          }}>
          <Bullet>AdMob</Bullet>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => {
            Linking.openURL('https://firebase.google.com/policies/analytics');
          }}>
          <Bullet>Google Analytics for Firebase</Bullet>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => {
            Linking.openURL('https://firebase.google.com/support/privacy/');
          }}>
          <Bullet>Firebase Crashlytics</Bullet>
        </TouchableWithoutFeedback>
      </View>
    ),
  },
  {
    heading: 'Log Data',
    text: (
      <Text>
        We want to inform you that whenever you use our Service, in a case of an
        error in the app we collect data and information (through third party
        products) on your phone called Log Data. This Log Data may include
        information such as your device Internet Protocol (“IP”) address, device
        name, operating system version, the configuration of the app when
        utilizing our Service, the time and date of your use of the Service, and
        other statistics.
      </Text>
    ),
  },
  {
    heading: 'Cookies',
    text: (
      <Text>
        Cookies are files with a small amount of data that are commonly used as
        anonymous unique identifiers. These are sent to your browser from the
        websites that you visit and are stored on your device's internal memory.
        This Service does not use these “cookies” explicitly. However, the app
        may use third party code and libraries that use “cookies” to collect
        information and improve their services. You have the option to either
        accept or refuse these cookies and know when a cookie is being sent to
        your device. If you choose to refuse our cookies, you may not be able to
        use some portions of this Service.
      </Text>
    ),
  },
  {
    heading: 'Service Providers',
    text: (
      <View>
        <Text>
          We may employ third-party companies and individuals due to the
          following reasons:
        </Text>
        <Bullet>To facilitate our Service;</Bullet>
        <Bullet>To provide the Service on our behalf;</Bullet>
        <Bullet>To perform Service-related services; or</Bullet>
        <Bullet>To assist us in analyzing how our Service is used.</Bullet>
        <Text>
          We want to inform users of this Service that these third parties have
          access to your Personal Information. The reason is to perform the
          tasks assigned to them on our behalf. However, they are obligated not
          to disclose or use the information for any other purpose.
        </Text>
      </View>
    ),
  },
  {
    heading: 'Security',
    text: (
      <Text>
        We value your trust in providing us your Personal Information, thus we
        are striving to use commercially acceptable means of protecting it. But
        remember that no method of transmission over the internet, or method of
        electronic storage is 100% secure and reliable, and we cannot guarantee
        its absolute security.
      </Text>
    ),
  },
  {
    heading: 'Links to Other Sites',
    text: (
      <Text>
        This Service may contain links to other sites. If you click on a
        third-party link, you will be directed to that site. Note that these
        external sites are not operated by us. Therefore, we strongly advise you
        to review the Privacy Policy of these websites. We have no control over
        and assume no responsibility for the content, privacy policies, or
        practices of any third-party sites or services.
      </Text>
    ),
  },
  {
    heading: 'Children’s Privacy',
    text: (
      <Text>
        These Services do not address anyone under the age of 13. We do not
        knowingly collect personally identifiable information from children
        under 13 years of age. In the case we discover that a child under 13 has
        provided us with personal information, we immediately delete this from
        our servers. If you are a parent or guardian and you are aware that your
        child has provided us with personal information, please contact us so
        that we will be able to do necessary actions.
      </Text>
    ),
  },
  {
    heading: 'Changes to This Privacy Policy',
    text: (
      <Text>
        We may update our Privacy Policy from time to time. Thus, you are
        advised to review this page periodically for any changes. We will notify
        you of any changes by posting the new Privacy Policy on this page. This
        policy is effective as of 2021-03-16
      </Text>
    ),
  },
  {
    heading: 'Contact Us',
    text: (
      <Text>
        If you have any questions or suggestions about our Privacy Policy, do
        not hesitate to contact us at thecircledating@gmail.com.
      </Text>
    ),
  },
];