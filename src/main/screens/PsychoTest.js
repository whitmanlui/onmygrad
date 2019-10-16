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
import { CustomIcon } from '@screens/SharedComponent/CustomIcon';

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


class PsychoTestScreen extends Component {
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
      is_correct: false,
      errormsg: false,
      selected: false,
      // state storing the index of the question 
    };
  }

  componentDidMount() {
    this.props.reqPsyList()
    // this.props.reqQuizStart( (msg) => {
    //   this.setState({
    //     serromesg: msg,
    //     step: this.props.quizStep
    //   })
    //   console.log(this.state)
    // }
    // )
  }

  keyExtractor = (item, index) => item.id;

  _goNext = () => {
    if (this.state.step < this.props.psyList.length-1) {
      this.setState((prev) => ({
        step: prev.step + 1
      }))
      console.log(`NEXT: ${this.state.step} ${Object.keys(this.state.user_answer).length} ${this.props.psyList.length}`)
    } else {
      if (Object.keys(this.state.user_answer).length !== this.props.psyList.length ) {
        Alert.alert(
          LANG[this.props.lang].sth_went_wrong,
          LANG[this.props.lang].not_yet_finish,
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          {cancelable: false},
        );
      } else {
        Alert.alert(
          LANG[this.props.lang].ask_sure_submit,
          LANG[this.props.lang].think_carefully,
          [
            {text: LANG[this.props.lang].confirm_submit, onPress: () => this.props.reqPsyFinish(this.state.user_answer, () => {
              console.log('success');
              this.setState({
                completed: true
              })
            })},
            {
              text: LANG[this.props.lang].cancel,
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
          ],
          {cancelable: false}
        );
      }
    }
  }

  _goBack = () => {
    if (this.state.step >= 1) {
      this.setState((prev) => ({
        step: prev.step - 1
      }))
    } else {
      return
    }
  }

  selectAnswer(id, answer) {
    this.setState({ selected: true});
    temp_answer = answer;
    this.setState((prev) => ({
      user_answer: {
        ...prev.user_answer,
        [id]: temp_answer
      }
    }), () => {
      setTimeout(
        () => this._goNext(),
        500
      )
    }
    )
    console.log(this.state.user_answer)
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
    const { psyList } = this.props;
    const {
      step,
      completed,
      start,
      user_answer,
      submitted,
      is_correct,
      loading,
      errormsg,
    } = this.state;
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'space-between',
          backgroundColor: '#f1f1f1'
        }}
      >
        {start
          ? (psyList.length > 0 &&
                !completed)
              ? (
                <SafeAreaView>
                  <V style={[s.ma2,{backgroundColor: '#ffffff'}]}>
                    <V style={[{backgroundColor: '#7bd51f', height: 5, width: (this.state.step/psyList.length * 100).toString()+'%'}]}/>
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
                    <V style={[s.flx_i, s.flx_row, s.mt5, s.mb3]}>
                      <TouchableOpacity style={[s.jcc, s.aife, {width: 50, height: 50}]} onPress={this._goBack}>
                        <CustomIcon name="ask-go-back" style={[{fontSize: 30, color: '#7bd51f'}]} ></CustomIcon>
                      </TouchableOpacity>
                      <V style={[s.flx_i, s.mv3, s.aic, {height: 150}]}>
                        <V style={[s.ph3]}><T style={[styles.psyq]}>{psyList[step].question}</T></V>
                      </V>
                      <TouchableOpacity style={[s.jcc, s.aifs,{width: 50, height: 50}]} onPress={this._goNext}>
                        <CustomIcon name="ask-fornt" style={[{fontSize: 30, color: '#7bd51f'}]} ></CustomIcon>
                      </TouchableOpacity>
                    </V>
                    
                    <V style={[s.flx_i, s.mv3, s.ph3, {flexWrap: 'wrap', alignItems: 'center'}]}>
                      
                      {_.map( psyList[step].option, (v, i) =>{
                          return (<V 
                            style={[s.flx_i, {width: '100%', backgroundColor: (user_answer[psyList[step].id] == v.value) ? '#7bd51f' : 'transparent' }]}
                            key={v.id}
                            >
                            <TouchableOpacity
                              activeOpacity={0.8}
                              disabled={submitted}
                              onPress={() => this.selectAnswer(psyList[step].id, v.value)}
                            >
                              <V style={[s.aic, s.mv2]}>
                                <T>{`${v.name}`}</T>
                              </V>
                            </TouchableOpacity>
                          </V>)
                        })
                      }
                    </V>
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
              <V style={[s.flx_i, s.mh2, s.mt3, {height: 350}]}>
                <HTML
                  html={LANG[lang].psy_test_rule}
                  imagesMaxWidth={Dimensions.get('window').width}
                />
              </V>
            { psyList.length > 0
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
  psyq: {
    fontFamily: Platform.OS == 'ios' ? `Noto Sans TC Bold` : `NotoSansTC-Bold`,
		fontSize: 15,
		lineHeight: 18,
		color: '#323643'
  }
});

export default (psychoTest = connect(
  (state, props) => ({
    lang: state.app.lang,
    psyList: state.quiz.psyList,
  }),
  (dispatch, props) => ({
    reqPsyList: (cb) => dispatch(quizActions.reqPsyList(cb)),
    reqPsyFinish: (psyAnswer, cb) => dispatch(quizActions.reqPsyFinish(psyAnswer, cb))
  })
)(PsychoTestScreen));
