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
  FlatList
} from 'react-native';
import { styles as s } from 'react-native-style-tachyons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';
import { Card, Icon, Avatar, Image } from 'react-native-elements';
import { Button, Text as T } from '@screens/SharedComponent/OnMyGradComponent'
import { MoreBtn } from '@screens/SharedComponent/IconBtn';
import { actions as meActions } from '@reducer/meReducer'
import { CustomIcon } from '@screens/SharedComponent/CustomIcon';
import LANG from '@lang/lang';

const HistoryBlk = (props) => {
  const { type, title, name } = props;
  const TypeIconBlk = () => {
    switch (type) {
      case 'question':
        return (<Icon style={[s.tr]} color='#919191' name={'md-help'} type={'ionicon'} />);
      case 'answer':
        return (<Icon style={[s.tr]} color='#919191' name={'md-chatboxes'} type={'ionicon'} />);
      case 'course':
        return (<Icon style={[s.tr]} color='#919191' name={'md-fitness'} type={'ionicon'} />);
      case 'event':
        return (<Icon style={[s.tr]} color='#919191' name={'md-calendar'} type={'ionicon'} />);
      case 'deadline':
        return (<Icon style={[s.tr]} color='#919191' name={'md-ice-cream'} type={'ionicon'} />);
      case 'action':
        return (<Icon style={[s.tr]} color='#919191' name={'md-planet'} type={'ionicon'} />);
      default:
        return null;
    }
  }
  
  return (<TouchableWithoutFeedback onPress={ () => {
    switch (type) {
      case 'question':
        return (props.navigation.navigate("QNA", { question: props }));
      case 'course':
        return (props.navigation.navigate("Course", { courseID: props.id }));
      case 'event':
        return (props.navigation.navigate('Event', { eventID: props.id }));
      default:
        return null;
    }    
  }}>
    <V style={[s.flx_i, s.flx_row, s.pa1]}>
          <V style={[{borderBottomWidth: 1, borderBottomColor: '#f3f3f3'}, s.flx_i, s.flx_row, s.pb1]}>
            <V style={[s.flx_i, s.flx_row]}>
              <V style={[s.pv2, {width: '15%'}]}>
                <TypeIconBlk/>
              </V>
              <V style={[s.flx_i, s.jcc, {width: '85%'}]}>
                  {title && <V>
                    <T ellipsizeMode='tail' numberOfLines={1} style={[styles.text]} style={[s.b, s.jcc]}>{title}</T>
                  </V>}
                  {name && <V>
                    <T ellipsizeMode='tail' numberOfLines={1} style={[styles.text]} style={[s.b, s.jcc]}>{name}</T>
                  </V>}
              </V>
            </V>
          </V>
        </V>
        </TouchableWithoutFeedback>)
}

const ActivityHistoryBlk = (props) => {
  const {lang} = props
  const {liked} = props.event
  return (
    <ScrollView style={[s.pa3, {backgroundColor: '#ffffff'}]}>
      <V style={[s.mb5]}>
        <V style={[s.flx_i, s.flx_row]}>
          <CustomIcon name="event-icon2" style={[s.mr2, { fontSize: 26, color: '#F5A623' }]} ></CustomIcon>
          <T type={'title'}>{`${LANG[lang].liked_event} (${liked.length})`}</T>
        </V>
        { (liked != 0)
          ?  <V>{props.renderHistoryList(liked, 'event')}</V>
          :  <V style={[s.ma2]}><T>{LANG[lang].find_your_like}</T></V>
        }
      </V>
    </ScrollView>
  )
}

const QuestionHistoryBlk = (props) => {
  const {lang} = props
  const {answered, liked, commented} = props.question
  return (
    <ScrollView style={[s.pa3, {backgroundColor: '#ffffff'}]}>
      <V style={[s.pb2]}>
        <V style={[s.flx_i, s.flx_row]}>
          <CustomIcon name="event-icon1" style={[s.mr2, { fontSize: 26, color: '#4A90E2' }]} ></CustomIcon>
          <T type={'title'}>{`${LANG[lang].liked_question} (${liked.length})`}</T>
        </V>
        { (liked != 0)
          ? <V>{props.renderHistoryList(liked, 'question')}</V>
          :  <V style={[s.ma2]}><T>{LANG[lang].find_your_like}</T></V>
        }
      </V>
      <V style={[s.mb5]}>
        <V style={[s.flx_i, s.flx_row]}>
          <CustomIcon name="event-icon1" style={[s.mr2, { fontSize: 26, color: '#4A90E2' }]} ></CustomIcon>
          <T type={'title'}>{`${LANG[lang].comment_question} (${commented.length})`}</T>
        </V>
        { (commented != 0)
          ? <V>{props.renderHistoryList(commented, 'question')}</V>
          :  <V style={[s.ma2]}><T>{LANG[lang].find_your_like}</T></V>
        }
      </V>
    </ScrollView>
  )
}

const CourseHistoryBlk = (props) => {
  const {lang} = props
  const {purchased, liked} = props.course
  return (
    <ScrollView style={[s.pa3, {backgroundColor: '#fffff'}]}>
      <V style={[s.pb2]}>
        <V style={[s.flx_i, s.flx_row]}>
          <CustomIcon name="event-icon3" style={[s.mr2, { fontSize: 26, color: '#86E99F' }]} ></CustomIcon>
          <T type={'title'}>{`${LANG[lang].liked_course} (${liked.length})`}</T>
        </V>
        { (liked.length !== 0)
          ?  <V>{props.renderHistoryList(liked, 'course')}</V>
          :  <V style={[s.ma2]}><T>{LANG[lang].find_your_like}</T></V>
        }
      </V>
      <V style={[s.mb5]}>
        <V style={[s.flx_i, s.flx_row]}>
          <CustomIcon name="event-icon3" style={[s.mr2, { fontSize: 26, color: '#86E99F' }]} ></CustomIcon>
          <T type={'title'}>{`${LANG[lang].purchased_course} (${purchased.length})`}</T>
        </V>
        { (purchased.length !== 0)
          ? <V>{props.renderHistoryList(purchased, 'course')}</V>
          : <V style={[s.ma2]}><T>{LANG[lang].find_your_like}</T></V>
        }
      </V>
    </ScrollView>
  )
}

class BookmarkScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `我喜愛的`
  });

  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      content: {}
    }
  }

  componentDidMount() {
    this.props.reqSaved((result) => {
      this.setState({
        content: result
      }, () => console.log(this.state))
    })
  }

  renderHistoryList = (histories, type) => {
    return _.map(histories, (v, i) => {
      return <HistoryBlk {...v} type={type} key={i} navigation={this.props.navigation} lang={this.props.lang} />;
    });
  }

  render() {
    const { lang } = this.props;
    return (
        <ScrollView
          horizontal={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          ref={node => (this.scroll = node)}
          scrollEnabled={true}
          scrollEventThrottle={16}
        >
        {this.state.content.hasOwnProperty('event') ? <V style={[{ width: Dimensions.get('window').width }, s.flx_i]}>
          <ActivityHistoryBlk renderHistoryList={this.renderHistoryList} event={this.state.content.event} lang={lang} navigation={this.props.navigation}/>
          </V>
          : <></>
        }
        {this.state.content.hasOwnProperty('question') ? <V style={[{ width: Dimensions.get('window').width }, s.flx_i]}>
          <QuestionHistoryBlk renderHistoryList={this.renderHistoryList} question={this.state.content.question} lang={lang} navigation={this.props.navigation}/>
          </V>
          : <></>
        }
        {this.state.content.hasOwnProperty('course') ? <V style={[{ width: Dimensions.get('window').width }, s.flx_i]}>
          <CourseHistoryBlk renderHistoryList={this.renderHistoryList} course={this.state.content.course} lang={lang} navigation={this.props.navigation}/>
        </V>
          : <></>
        }
        </ScrollView>
    );
  }
}
// s.jcc, s.aic, s.ba, s.ma1, {width: 70, height: 70}, s.br2
const styles = StyleSheet.create({

});

export default (Bookmark = connect(
  (state, props) => ({
    lang: state.app.lang,
  }),
  (dispatch, props) => ({
    reqSaved: (cb) => { dispatch(meActions.reqSaved(cb))}
  })
)(BookmarkScreen));
