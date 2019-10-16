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
  ActivityIndicator,
  Keyboard,
  Alert
} from 'react-native';
import { styles as s } from 'react-native-style-tachyons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';
import Modal from "react-native-modalbox";
import { Card, Icon, Avatar, Image, Input } from 'react-native-elements';
import { Button, Text as T } from '@screens/SharedComponent/OnMyGradComponent'
import { MoreBtn, BackBtn } from '@screens/SharedComponent/IconBtn';
import LANG from '@lang/lang';
import { actions as courseActions } from '@reducer/courseReducer'
import {NavigationEvents} from 'react-navigation';
import { CustomIcon } from '@screens/SharedComponent/CustomIcon';

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
    <V style={[{ backgroundColor: '#f1f1f1' }, s.br5, s.ph2, s.mr1]}>
      <T>{tag}</T>
    </V>

  )
}

const ChapterBlk = (props) => {
  const { id, name, status, est_duration, lang, completed } = props;
  return (<TouchableOpacity onPress={() => props.readChapter(id)}>
    <V style={[s.flx_i, s.flx_row]}>
        <V style={[styles.avatarWrapper, {borderColor: completed ? '#b8e986' : '#ebebeb'}]}>
          {
            completed
              ? (
                <Icon
                  name="check-all"
                  color="#b8e986"
                  type="material-community"
                  size={25}
                />
              )
              : <T>{LANG[lang].start}</T>
          }
        </V>
          <V style={[s.flx_i, s.pv3, s.bb1, {borderBottomWidth: 1, borderBottomColor: "#eeeeee"}]}>
            <T>{name}</T>
            <V style={[s.flx_i, s.flx_row, s.pb1]}>
              <Icon
                name="clock-o"
                color="#a4a4a4"
                type="font-awesome"
                size={15}
                containerStyle={[s.mr1]}
                iconStyle={[{lineHeight: 16}]}
              />
                <T style={[styles.subinfo]}>{est_duration > 0 ? this.toDisplayDuration(est_duration) : `-`}</T>
            </V>
          </V>
    </V>
    </TouchableOpacity>
  )
}

class ChapterScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerLeft: <BackBtn navigation={navigation} />,
		title: `${navigation.state.params.title}`,
		headerStyle: { borderBottomWidth: 0, elevation: 0, shadowOpacity: 0 }
  });

  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      loading: true,
      isOpen: false,
      isDisabled: false,
      swipeToClose: true,
      comment: ''
    };
  }

  componentDidMount(){
    this.props.reqChapterList(() => {
      this.setState({loading: false})
    });
  }

  renderTagList = () => {
    return _.map(this.props.singleCourse.taglist, (v, i) => {
      return <Taglist tag={v} key={i} />;
    });
  }

  _ReadChapter = (id) => {
    this.props.reqReadChapter(id);
    this.props.navigation.navigate("LearnContent", {chapterID: id})
  }

  renderChapterList = () => {
    return _.map(this.props.chapter.lecture, (v, i) => {
      return <ChapterBlk {...v} readChapter={this._ReadChapter} navigation={this.props.navigation} lang={this.props.lang} toDisplayDuration={this.toDisplayDuration} key={i} />;
    });
  }

  toDisplayDuration = (seconds) => {
    if (seconds <= 60 ) {
      return `~1${LANG[this.props.lang].min}`
    } else {
      if (seconds / 60 >= 60) {
        return `${Math.round(seconds/3600)}${LANG[this.props.lang].hour} ${Math.round(seconds%3600/60)}${LANG[this.props.lang].min}`
      } else {
        return `${Math.round(seconds/60) }${LANG[this.props.lang].min}`
      }
    }
  }

  goComment = (comment) => {
    const {lang} = this.props
    this.props.reqAddComment(comment, (content) => {
      console.log(content)
      if (content.success) {
        Alert.alert(
          LANG[lang].success,
          "",
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          {cancelable: false}
        )
      } else {
        Alert.alert(
          LANG[this.props.lang].sth_went_wrong,
          "",
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          {cancelable: false},
        );
      }
      Keyboard.dismiss();
      this.refs.modal1.close();
    })
  }

  render() {
    const {name, tags, view_count, est_duration, completion, commented} = this.props.singleCourse;
    const { lang, chapter } = this.props;
    const { loading, comment } = this.state;
    const screenWidth = Dimensions.get('window').width
    return (
      <V style={[s.flx_i]}>
        <Modal
          style={[s.pt2, {justifyContent: 'center', alignItems: 'center', height:200}]}
          ref={"modal1"}
          swipeToClose={this.state.swipeToClose}
          backdrop={true}
          backdropOpacity={0.8}
          position={"center"}
          onClosingState={this.onClosingState}
          animationDuration={500}
        >
          <V style={[s.flx_i]}>
            <T>{`What's your comment`}</T>
            <Input
              underlineColorAndroid={'rgba(0,0,0,0)'}
              onChangeText={(v)=>this.setState({comment: v})} 
              containerStyle={[s.ba, s.br1, s.flx_i, s.mv1, {width: screenWidth - 30,borderColor: '#ffd926'}]}
              inputContainerStyle={[{ borderBottomWidth: 0 }]}
              multiline = {true}
              height={50}
              maxLength={50}
            />
            <V style={[s.aife]}><T type="small">{`${comment.length}/50`}</T></V>
          </V>
          <V style={[s.flx_i, s.flx_row, s.jcc, s.aic]}>
            <V>
              <Button 
                onPress={() => {
                  this.refs.modal1.close()
                }}
                title={LANG[lang].cancel}
              />
            </V>
            <V>
              <Button 
                type='OnMyGrad'
                style={[{width: 193, height: 39,borderRadius: 19.5}]}
                onPress={() => this.goComment(comment)}
                title={LANG[lang].confirm_submit}
              />
            </V>
          </V>       
        </Modal>
        <NavigationEvents onWillFocus={() => 
            {this.props.reqChapterList(() => {
              this.setState({loading: false})
            })
          }}
        />
        <V style={[s.ph3, s.pt2 , {height: 150}]}>
          <V style={[s.pv2]}>
            <T type='title' style={[styles.coursetitle]}>{name}</T>
          </V>
          <V style={[s.flx_i, s.flx_row]}>{this.renderTagList()}</V>
          <V style={[s.flx_i, s.flx_row, s.jcfe, s.pa1]}>
            <V style={[s.flx_row, s.aife]}>
              <Icon
                name="user-circle-o"
                color="#a4a4a4"
                type="font-awesome"
                size={14}
                containerStyle={[s.ml2, s.mr1, s.jcc]}
                iconStyle={[{lineHeight: 20}]}
              />
              <T style={[styles.subinfo]}>{view_count > 0 ? `${view_count} ${LANG[lang].view_count}` : `-`}</T>
            </V>
            <V style={[s.flx_row, s.aife]}>
              <Icon
                name="clock-o"
                color="#a4a4a4"
                type="font-awesome"
                size={15}
                containerStyle={[s.ml3, s.mr1]}
                iconStyle={[{lineHeight: 20}]}
              />
                <T style={[styles.subinfo]}>{est_duration > 0 ? this.toDisplayDuration(est_duration) : `-`}</T>
            </V>
          </V>
        </V>
        <ScrollView
          style={[s.flx_i, s.ph3, {marginBottom: 70}]}>
          { loading
            ? <V style={[s.flx_i, s.jcc, s.aifc]}>
                <ActivityIndicator size="large" color="#ffd926" />
              </V>
            : <V>{this.renderChapterList()}</V>
          }
        </ScrollView>
        <V style={[s.absolute, s.bottom_0, s.ph4, s.pb4, s.pt2, {width: '100%', backgroundColor: '#ffffff'}]}>
          { commented
            ? <V style={[s.aic, s.jcc, s.flx_row, s.asc,{backgroundColor: '#ffd926', width:'100%'}]}>
                <V><T style={[s.jcfe, {color: '#ffffff'}]}>{LANG[lang].commented}</T></V>
                <V><CustomIcon name="liked" style={{ fontSize: 26, color: '#ffffff' }} ></CustomIcon></V>
              </V>
            : <Button
                type='OnMyGrad'
                title={(chapter.completion === "100.00") ? LANG[lang].rate_course : LANG[lang].not_complete}
                containerStyle={[{backgroundColor: (chapter.completion === "100.00") ? "#FFD926" : "#f1f1f1"}]}
                disabled={!(chapter.completion === "100.00")}
                onPress={() => {
                  this.refs.modal1.open()
                }}
              />
          }
        </V>
      </V>
    );
  }
}
// s.jcc, s.aic, s.ba, s.ma1, {width: 70, height: 70}, s.br2
const styles = StyleSheet.create({
  bold: {
    fontFamily: Platform.OS == 'ios' ? `Noto Sans TC Bold` : `NotoSansTC-Bold`
  },
  tag: {
    color: '#a4a4a4',
    borderColor: '#a4a4a4',
    margin: 2,
    paddingTop: 3,
    paddingBottom: 3,
    paddingRight: 8,
    paddingLeft: 8,
    height: 22,
    justifyContent: 'center',
  },
  tagtext: {
    fontSize: 10,
    lineHeight: 12,
    color: "#a4a4a4",
    textTransform: "uppercase"
  },
  coursetitle: {
    fontSize: 28,
    fontWeight: "bold",
    lineHeight: 36,
    letterSpacing: 1.65,
  },
  avatarWrapper: {
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#FFD926',
    margin: 8,
    borderRadius: 57 / 2,
    height: 60,
    width: 60,
  },
});

export default (Chapter = connect(
  (state, props) => ({
    lang: state.app.lang,
    singleCourse: state.course.singleCourse,
    chapter: state.course.chapter,
    content: state.course.content
  }),
  (dispatch, props) => ({
    reqChapterList:(cb) => dispatch(courseActions.reqChapterList(cb)),
    reqContent: (lectureID, cb) => dispatch(courseActions.reqContent(lectureID, cb)),
    reqReadChapter: (lectureID) => dispatch(courseActions.reqReadChapter(lectureID)),
    reqAddComment: (comment, cb) => dispatch(courseActions.reqAddComment(comment, cb)),
  })
)(ChapterScreen));
