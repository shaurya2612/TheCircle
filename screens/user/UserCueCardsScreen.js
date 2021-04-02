import LinearGradient from "react-native-linear-gradient";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  ScrollView,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import ReactNativeModal from "react-native-modal";
import { scale, verticalScale } from "react-native-size-matters";
import Icon from "react-native-vector-icons/Feather";
import { useDispatch, useSelector } from "react-redux";
import AppText from "../../components/AppText";
import CustomHeader from "../../components/CustomHeader";
import CustomSafeAreaView from "../../components/CustomSafeAreaView";
import ModalCardView from "../../components/ModalCardView";
import NameText from "../../components/NameText";
import questions from "../../constants/questions";
import {
  addCueCard,
  fetchUserCueCards,
  removeCueCard,
  updateCueCard,
} from "../../store/actions/user";
import styles from "../../styles";
import colors from "../../constants/colors";

const UserCueCardsScreen = ({ ...props }) => {
  const cueCards = useSelector((state) => state.user.cueCards);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [areQuestionsVisible, setAreQuestionsVisible] = useState(false);
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editedAnswer, setEditedAnswer] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [canAdd, setCanAdd] = useState(false);
  const [canSave, setCanSave] = useState(false);
  const [refreshSwitch, setRefreshSwitch] = useState(false);
  const answerTextInputRef = useRef(null);
  const editedTextInputRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (answer && answer.trim() !== "") {
      setCanAdd(true);
    } else setCanAdd(false);
  }, [answer]);

  useEffect(() => {
    if (editedAnswer && editedAnswer.trim() !== "") {
      setCanSave(true);
    } else setCanSave(false);
  }, [editedAnswer]);

  useEffect(() => {
    dispatch(fetchUserCueCards());
  }, []);

  const availableQuestions = useCallback(() => {
    let alreadyPresentQids = {};
    (cueCards || []).forEach((item) => {
      alreadyPresentQids[item.qid] = true;
    });
    const qids = Object.keys(questions);
    const texts = Object.values(questions);
    let finalQuestions = [];
    qids.forEach((qid, index) => {
      if (!alreadyPresentQids[qid]) {
        finalQuestions.push({ qid: qids[index], text: texts[index] });
      }
    });
    return finalQuestions;
  }, [cueCards]);

  const renderContent = useCallback(() => {
    if (cueCards === null) {
      return (
        <CustomSafeAreaView style={styles.expandedCenterView}>
          <ActivityIndicator size={"large"} color="black" />
        </CustomSafeAreaView>
      );
    }

    if (cueCards.length === 0) {
      return (
        <CustomSafeAreaView style={styles.expandedCenterView}>
          <AppText>No Cards!</AppText>
        </CustomSafeAreaView>
      );
    } else
      return (
        <View style={styles.rootView}>
          <FlatList
            data={cueCards}
            renderItem={({ item, index }) => (
              <View
                style={{
                  minHeight: scale(200),
                  minWidth: "50%",
                  borderRadius: scale(20),
                  backgroundColor: "white",
                  margin: scale(10),
                  overflow: "hidden",
                  ...styles.elevation_medium,
                }}
              >
                {/* Question  */}
                <View
                  style={{
                    backgroundColor: "#6A82FB",
                    paddingVertical: scale(20),
                    paddingHorizontal: scale(10),
                  }}
                >
                  <View>
                    <AppText
                      style={{
                        fontSize: scale(18),
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      {questions[item.qid]}
                    </AppText>
                  </View>
                </View>

                {/* Answer */}
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    paddingHorizontal: scale(10),
                    paddingVertical: scale(20),
                  }}
                >
                  <AppText
                    style={{
                      fontSize: scale(15),
                      color: "black",
                      textAlign: "justify",
                      lineHeight: verticalScale(20),
                      // fontWeight: "bold",
                    }}
                  >
                    {item.ans}
                  </AppText>
                </View>
                <View
                  style={{
                    height: scale(50),
                    flexDirection: "row",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setIsEditing(true);
                      setEditingQuestion({
                        qid: item.qid,
                        text: questions[item.qid],
                        index,
                      });
                      setEditedAnswer(item.ans);
                    }}
                    style={{
                      flex: 1,
                      backgroundColor: "white",
                      ...styles.centerView,
                      ...styles.elevation_medium,
                    }}
                  >
                    <AppText style={{ color: "#0078FF" }}>Edit</AppText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      dispatch(removeCueCard(index, setRefreshSwitch));
                    }}
                    style={{
                      flex: 1,
                      backgroundColor: "white",
                      ...styles.centerView,
                      ...styles.elevation_medium,
                    }}
                  >
                    <AppText style={{ color: "#ff3217" }}>Remove</AppText>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      );
  }, [cueCards]);

  return (
    <CustomSafeAreaView style={styles.rootView}>
      <CustomHeader style={{ backgroundColor:'white' }}>
        <TouchableOpacity
          onPress={() => {
            props.navigation.goBack();
          }}
          style={{
            width: scale(40),
            justifyContent: "center",
            height: "100%",
            alignItems: "center",
          }}
        >
          <Icon color={"black"} name={"arrow-left"} size={scale(20)} />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            paddingHorizontal: scale(10),
            overflow: "hidden",
            justifyContent: "center",
            alignItems: "center",
            color: "black",
          }}
        >
          <AppText
            style={{
              fontSize: scale(18),
              color: "black",
            }}
          >
            {"Your Cue Cards"}
          </AppText>
        </View>
        {cueCards?.length < 6 ? (
          <TouchableOpacity
            onPress={() => {
              setAreQuestionsVisible(true);
            }}
            style={{
              width: scale(40),
              flexDirection: "row",
              justifyContent: "center",
              height: "100%",
              alignItems: "center",
            }}
          >
            <Icon color={"black"} name={"plus"} size={scale(20)} />
          </TouchableOpacity>
        ) : (
          <View
            style={{
              width: scale(40),
              flexDirection: "row",
              justifyContent: "center",
              height: "100%",
              alignItems: "center",
            }}
          />
        )}
      </CustomHeader>
      {/* Editing Modal */}
      <ReactNativeModal
        isVisible={isEditing}
        backdropTransitionInTiming={0}
        backdropTransitionOutTiming={0}
        onModalHide={() => {
          setIsEditing(false);
          setEditingQuestion(null);
          setEditedAnswer(null);
        }}
        onBackdropPress={() => {
          Keyboard.dismiss();
        }}
      >
        <TouchableWithoutFeedback style={styles.expandedCenterView}>
          <View
            style={{
              minHeight: scale(200),
              minWidth: "50%",
              borderRadius: scale(20),
              backgroundColor: "white",
              margin: scale(10),
              overflow: "hidden",
              ...styles.elevation_medium,
            }}
          >
            {/* Question  */}
            <View
              style={{
                backgroundColor: "#6A82FB",
                paddingVertical: scale(20),
                paddingHorizontal: scale(10),
              }}
            >
              <View>
                <AppText
                  style={{
                    fontSize: scale(18),
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  {editingQuestion?.text}
                </AppText>
              </View>
            </View>

            {/* Answer */}
            <TouchableHighlight
              underlayColor={"white"}
              onPress={() => {
                editedTextInputRef.current.focus();
              }}
              style={{
                height: scale(200),
                alignItems: "center",
                paddingHorizontal: scale(10),
                paddingVertical: scale(20),
              }}
            >
              <TextInput
                style={{
                  fontSize: scale(15),
                  color: "black",
                  textAlign: "justify",
                  lineHeight: verticalScale(20),
                  // flex: 1
                }}
                value={editedAnswer}
                onChangeText={(newAns) => {
                  setEditedAnswer(newAns);
                }}
                maxLength={200}
                placeholder={"Your Answer"}
                multiline={true}
                ref={editedTextInputRef}
              />
            </TouchableHighlight>
            <View
              style={{
                height: scale(50),
                flexDirection: "row",
              }}
            >
              <TouchableOpacity
                disabled={!canSave}
                onPress={() => {
                  dispatch(
                    updateCueCard(editingQuestion.index, editedAnswer.trim())
                  );
                  setIsEditing(false);
                }}
                style={{
                  flex: 1,
                  backgroundColor: "white",
                  ...styles.centerView,
                  ...styles.elevation_medium,
                }}
              >
                <AppText style={{ color: "#0078FF" }}>Save</AppText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setIsEditing(false);
                }}
                style={{
                  flex: 1,
                  backgroundColor: "white",
                  ...styles.centerView,
                  ...styles.elevation_medium,
                }}
              >
                <AppText style={{ color: "#ff3217" }}>Cancel</AppText>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ReactNativeModal>

      {/* Questions Modal */}
      <ReactNativeModal
        isVisible={areQuestionsVisible}
        backdropTransitionInTiming={0}
        backdropTransitionOutTiming={0}
      >
        <CustomSafeAreaView
          style={{ ...styles.rootView, marginBottom: scale(100) }}
        >
          <ModalCardView style={{ paddingBottom: 0 }}>
            <View
              style={{
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <View>
                <AppText style={styles.titleText}>{"Pick a question"}</AppText>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setAreQuestionsVisible(false);
                }}
                style={{
                  width: scale(40),
                  height: scale(40),
                  ...styles.centerView,
                }}
              >
                <Icon name={"x"} size={scale(20)} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={availableQuestions()}
              extraData={refreshSwitch}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedQuestion({
                      qid: item.qid,
                      text: item.text,
                      index: index,
                    });
                    setIsAnswerVisible(true);
                  }}
                  style={{
                    padding: scale(10),
                    backgroundColor: "white",
                    borderRadius: scale(10),
                  }}
                >
                  <NameText>{item.text}</NameText>
                </TouchableOpacity>
              )}
            />
          </ModalCardView>

          {/* Answer Modal */}
          <ReactNativeModal
            isVisible={isAnswerVisible}
            backdropTransitionInTiming={0}
            backdropTransitionOutTiming={0}
            onModalWillShow={() => {
              setAnswer(null);
            }}
            onBackdropPress={() => {
              Keyboard.dismiss();
            }}
          >
            <TouchableWithoutFeedback style={styles.expandedCenterView}>
              <View
                style={{
                  minHeight: scale(200),
                  minWidth: "50%",
                  borderRadius: scale(20),
                  backgroundColor: "white",
                  margin: scale(10),
                  overflow: "hidden",
                  ...styles.elevation_medium,
                }}
              >
                {/* Question  */}
                <View
                  style={{
                    backgroundColor: "#6A82FB",
                    paddingVertical: scale(20),
                    paddingHorizontal: scale(10),
                  }}
                >
                  <View>
                    <AppText
                      style={{
                        fontSize: scale(18),
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      {selectedQuestion?.text}
                    </AppText>
                  </View>
                </View>

                {/* Answer */}
                <TouchableHighlight
                  underlayColor={"white"}
                  onPress={() => {
                    answerTextInputRef.current.focus();
                  }}
                  style={{
                    height: scale(200),
                    alignItems: "center",
                    paddingHorizontal: scale(10),
                    paddingVertical: scale(20),
                  }}
                >
                  <TextInput
                    style={{
                      fontSize: scale(15),
                      color: "black",
                      textAlign: "justify",
                      lineHeight: verticalScale(20),
                      // flex: 1
                    }}
                    value={answer}
                    onChangeText={(newAns) => {
                      setAnswer(newAns);
                    }}
                    maxLength={200}
                    placeholder={"Your Answer"}
                    multiline={true}
                    ref={answerTextInputRef}
                  />
                </TouchableHighlight>
                <View
                  style={{
                    height: scale(50),
                    flexDirection: "row",
                  }}
                >
                  <TouchableOpacity
                    disabled={!canAdd}
                    onPress={() => {
                      setIsAnswerVisible(false);
                      setAreQuestionsVisible(false);
                      setCanAdd(true);
                      dispatch(
                        addCueCard({
                          qid: selectedQuestion.qid,
                          ans: answer.trim(),
                        })
                      );
                    }}
                    style={{
                      flex: 1,
                      backgroundColor: "white",
                      ...styles.centerView,
                      ...styles.elevation_medium,
                    }}
                  >
                    <AppText style={{ color: "#0078FF" }}>Add</AppText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setIsAnswerVisible(false);
                    }}
                    style={{
                      flex: 1,
                      backgroundColor: "white",
                      ...styles.centerView,
                      ...styles.elevation_medium,
                    }}
                  >
                    <AppText style={{ color: "#ff3217" }}>Cancel</AppText>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </ReactNativeModal>
        </CustomSafeAreaView>
      </ReactNativeModal>
      {renderContent()}
    </CustomSafeAreaView>
  );
};

export default UserCueCardsScreen;
