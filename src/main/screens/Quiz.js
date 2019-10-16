import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View as V,
  Platform,
  TouchableWithoutFeedback,
  StyleSheet,
  Animated,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Modal from 'react-native-modalbox';
import { styles as s } from 'react-native-style-tachyons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';
import { Card, Icon, Avatar, Image, Header } from 'react-native-elements';
import { Button, Text as T } from '@screens/SharedComponent/OnMyGradComponent'
import HTML from "react-native-render-html"
import { CloseBtn, MoreBtn  } from '@screens/SharedComponent/IconBtn'
import ImageViewer from 'react-native-image-zoom-viewer';
import LANG from '@lang/lang';
import { actions as quizActions } from '@reducer/quizReducer';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get("window").height;

const Divider = () => {
  return (
    <V style={[styles.divider]}></V>
  )
}

const Taglist = (props) => {
  const {
    tag
  } = props;

  return (
    <V style={[styles.tag, s.br5, s.ba]}>
      <T style={[styles.tagtext]}>{tag}</T>
    </V>
  )
}

const QuizStart = (props) => {
  const { lang } = props;
  return (
    <V>
      <Button
        type={'OnMyGrad'}
        title={LANG[lang].start}
        onPress={() => {this.setState({start: false})}}
      />
    </V>
  )
}

const QuizFinished = (props) => {
}

class LookPhotoModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      animating: true,
    };
    console.log(props);
  }

  renderLoad() {
    return (
      <V style={{ marginTop: (WINDOW_HEIGHT / 2) - 20 }}>
        <ActivityIndicator animating={this.state.animating} size={"large"} />
      </V>
    )
  }

  render() {    
    let ImageObjArray = [];
    let Obj = {};
    Obj.url = this.props.imageDataUrl;
    ImageObjArray.push(Obj);
    
    return (
      <V style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}>
        <Modal
          animationType={"slide"}
          backdrop={true}
          backdropOpacity={0}
          isOpen={this.props.isOpen}
          backButtonClose={true}
          coverScreen={true}
          swipeToClose
        >
          <ImageViewer
            imageUrls={ImageObjArray} // 照片路径
            enableImageZoom={true} // 是否开启手势缩放
            index={this.props.curentImage} // 初始显示第几张
            // failImageSource={} // 加载失败图片
            loadingRender={() => this.renderLoad()}
            enableSwipeDown={false}
            onClick={() => this.props.toggle()}
          />
        </Modal>
      </V>
    );
  }

}


class QuizScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: null
    // title: `${navigation.state.params.event.title}`,
  });

  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      loading: false,
      start: false,
      step: 0,
      completed: false,
      user_answer: {},
      submitted: false,
      photoModalShow: false,
      is_correct: false,
      errormsg: false,
      selected: false,
      correct_answer: '',
      // state storing the index of the question 
    };
  }

  componentDidMount() {
    this.props.reqQuizStart( (msg) => {
      this.setState({
        serromesg: msg,
        step: this.props.quizStep
      })
      console.log(this.state)
    }
    )
  }

  keyExtractor = (item, index) => item.id;

  goNext(index) {
    this.setState((prev) => {
      return {
        completed: index === this.props.quizList.length-1 ? true : false,
        submitted: false,
        step: this.props.quizStep
      }
    });
    // check questions, return correct answer
    // dispatch ACTIONS
    // update state
  }

  selectAnswer(id, answer, type) {
    console.log(id, answer, type);
    console.log(this.state);
    this.setState({ selected: true});
    let temp_answer = '';
    if (type === "Boolean") {
      if (answer === 'a') {
        temp_answer = 'T'
        console.log('aaa')
      } 
      if (answer ==='c') {
        temp_answer = 'F'
        console.log('ccc')
      } 
      if (answer === 'e') {
        temp_answer = 'N'
        console.log('eee')
      }
    } else {
      temp_answer = answer;
    }
    console.log(`temp ${temp_answer}`)
    this.setState((prev) => ({
      user_answer: {
        ...prev.user_answer,
        [id]: temp_answer
      }
    }))
  }

  checkAnswer(qid, answer) {
    const {lang} = this.props;
    this.setState({loading: true})
    this.props.reqQuizAnswer(qid, answer, (msg, is_correct, correct_answer) => {
      let temp_answer = '';
      if (msg === 'nice') {
        if (correct_answer === 't') {
          temp_answer = 'a'
        } else if (correct_answer === 'f') {
          temp_answer = 'a'
        } else if (correct_answer === 'n') {
          temp_answer = 'a'
        } else {
          temp_answer = correct_answer
        }
        this.setState((prev) => ({
          correct_answer: temp_answer,
          is_correct: is_correct,
          submitted: true,
          loading: false,
          selected: false,
        }))
      } else {
        Alert.alert(
          LANG[lang].sth_went_wrong,
          msg,
        [
          {text: 'OK', onPress: () => this.props.navigation.goBack()},
        ],
        {cancelable: false},
        )
      }
    })
  }

  togglePhotoModal(){
    this.setState( (prev) => ({photoModalShow: !prev.photoModalShow}));
  }

  finishQuiz(){
    this.props.reqQuizComplete(() => {
      Alert.alert(
        'Alert Title',
        'My Alert Msg',
      [
        {text: 'OK', onPress: () => this.props.navigation.goBack()},
      ],
      {cancelable: false},
      );
    })
  }

  render() {
    const { lang } = this.props;
    const { quizList, quizRule, quizSetID, quizStep } = this.props;
    const {
      step,
      completed,
      start,
      user_answer,
      submitted,
      photoModalShow,
      is_correct,
      loading,
      errormsg,
      selected,
      correct_answer,
    } = this.state;
    const bol_dic = {
      'a': 'T',
      'c': 'F',
      'e': 'N'
    }
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'space-between',
          backgroundColor: '#f1f1f1'
        }}
      >
        {start
          ? (quizList.length > 0 &&
              completed === false &&
                quizList.length > step)
              ? (
                <SafeAreaView>
                  <V style={[s.ma2,{backgroundColor: '#ffffff'}]}>
                    <V style={[s.flx_i, s.aife]}>
                      <Button
                        title={`${LANG[lang].give_up}`}
                        onPress={ ()=> Alert.alert(
                          LANG[lang].ask_sure_delete,
                          LANG[lang].giveup_cannot_recover,
                          [
                            {text: LANG[lang].confirm_giveup, onPress: () => this.props.navigation.goBack()},
                            {
                              text: LANG[lang].cancel,
                              onPress: () => console.log('Cancel Pressed'),
                              style: 'cancel',
                            },
                          ],
                          {cancelable: false}
                          )}
                      />
                    </V>
                    <V style={[s.ph3, s.mv3, ]}>
                      { (quizList[step].type === 1 )
                        ? <T type={'title'}>{LANG[lang].numerical_reasoning_question}</T>
                        : (quizList[step].type === 2 )
                          ? <T type={'title'}>{LANG[lang].verbal_reasoning_question}</T>
                          : (quizList[step].type === 3 ) &&
                            <T type={'title'}>{LANG[lang].logical_reasoning_question}</T>
                      }
                    </V>
                    <V style={[s.flx_i, s.mv3, s.aic]}>
                      { (quizList[step].attachment !== null)
                        && (
                          <>
                            <TouchableOpacity
                              style={[{zIndex: 1}]}
                              onPress={() => this.togglePhotoModal()}
                            >
                              <Image
                                style={{width: WINDOW_WIDTH-40, height: 200, resizeMode: "contain"}}
                                source={{uri: quizList[step].attachment}}
                              />
                            </TouchableOpacity>
                            <LookPhotoModal
                              imageDataUrl={quizList[step].attachment}
                              isOpen={photoModalShow}
                              toggle={() => this.togglePhotoModal()}
                            />
                          </>
                        )
                      }
                      <V style={[s.ph3]}><T style={[s.b]}>{quizList[step].question}</T></V>
                    </V>
                    <V style={[s.flx_i, s.flx_row, s.mv3, s.ph3, {flexWrap: 'wrap', alignItems: 'center'}]}>
                      {_.map( quizList[step].option, (v, i) =>{
                          return (<V 
                            style={[{width:'33%', backgroundColor: (submitted && (correct_answer == i || correct_answer.toUpperCase() == bol_dic[i])) ? '#7bd51f' : 'transparent' }]}
                            key={v.id}
                            >
                            <TouchableOpacity
                              activeOpacity={0.8}
                              disabled={submitted}
                              onPress={() => this.selectAnswer(quizList[step].id, i, v.type)}
                            >
                              <V style={[s.aic, s.mv2]}>
                                { (v.type === "text")
                                  && <T style={[{color: user_answer[quizList[step].id] == i ? 'red' : '#808080'}]}>{v.value}</T>}
                                { (v.type === "Boolean")
                                  && <T style={[{color: user_answer[quizList[step].id] == bol_dic[i] ? 'red' : '#808080'}]}>{v.value.toString().toUpperCase()}</T>
                                }
                                { (v.type === "image") &&
                                  <Image
                                    containerStyle={[s.pv1, {borderWidth: user_answer[quizList[step].id] == i ? 2 : 0}]}
                                    source={{uri: v.image}}
                                    style={[{width: 60, height: 60}]}
                                  />
                                }
                              </V>
                            </TouchableOpacity>
                          </V>)
                        })
                      }
                    </V>
                  </V>
                  <V style={[s.pv3, s.mb3, s.ph4]}>
                    { !submitted ?
                      <Button
                        type={'OnMyGrad'}
                        title={'submit'}
                        disabled={!selected}
                        containerStyle={[{backgroundColor: '#ffd926'}]}
                        onPress={() => this.checkAnswer(quizList[step].id, this.state.user_answer[quizList[step].id])}
                      />
                      :<Button
                        type={'OnMyGrad'}
                        title={'Next'}
                        containerStyle={[{backgroundColor: '#7bd51f'}]}
                        onPress={() => this.goNext(quizStep)}
                      />
                    }
                  </V>
                </SafeAreaView>
              )
              : (<SafeAreaView style={[s.flx_i, s.aic, s.jcc]}>
                <V><T type={`title`}>{`${LANG[lang].you_have_completed_test}`}</T></V>
                <Button
                  type={'OnMyGrad'}
                  title={LANG[lang].back}
                  containerStyle={{width: '60%'}}
                  onPress={() => this.props.navigation.goBack()}
                />
                </SafeAreaView>

              )
          : (<SafeAreaView style={[s.ph3]}>
              <V style={[s.flx_i, s.mh2, s.mv3, {height: 350}]}>
                <HTML
                  html={LANG[lang].app_test_rule}
                  imagesMaxWidth={Dimensions.get('window').width}
                />
              </V>
            { quizList.length > 0
              ? <V style={[s.flx_i, s.aic]}>
                  <Button
                    type={'OnMyGrad'}
                    title={LANG[lang].start}
                    containerStyle={{width: '60%'}}
                    onPress={() => {this.setState({start: true})}}
                  />
                </V>
              // goBack and alert and return the message, ie have tried
              : (<V style={[s.flx_i, s.aic]}>
                  <Button
                    type={'OnMyGrad'}
                    title={LANG[lang].back}
                    containerStyle={{width: '60%'}}
                    onPress={() => this.props.navigation.goBack()}
                  />
                    <V><T>{errormsg}</T></V>
                  </V>
                )
            }
            </SafeAreaView>)
        }
        {/* { completed &&
          <SafeAreaView style={[s.ph3]}>
            <Button
              type={'OnMyGrad'}
              title={'DONE'}
              onPress={ () => this.finishQuiz()}
              // submit the result back here
            />
          </SafeAreaView>
        } */}
      </ScrollView>
    );
  }
}
// s.jcc, s.aic, s.ba, s.ma1, {width: 70, height: 70}, s.br2
const styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default (Quiz = connect(
  (state, props) => ({
    lang: state.app.lang,
    quizList: state.quiz.quizList,
    quizAnswer: state.quiz.quizAnswer,
    quizRule: state.quiz.quizRule,
    quizStep: state.quiz.quizStep
  }),
  (dispatch, props) => ({
    reqQuizStart: (cb) => dispatch(quizActions.reqQuizStart(cb)),
    reqQuizAnswer: (qid, answer, cb) => dispatch(quizActions.reqQuizAnswer(qid, answer, cb)),
    reqQuizComplete: (cb) => dispatch(quizActions.reqQuizComplete(cb))
  })
)(QuizScreen));
