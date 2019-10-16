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
        return (props.navigation.navigate("Course", { courseID: props.id, title: props.name }));
      case 'event':
        return (props.navigation.navigate('Event', { eventID: props.id, title: props.name }));
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

class HistoryScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: '歷史',
  });

  constructor(props) {
    super(props);
    this.state = {
      history: {}
    }
  }

  componentDidMount() {
    this.props.reqHistory((result)=> {
      this.setState({
        history: result
      })
    })
  }

  renderHistoryList = (histories, type) => {
    return _.map(histories, (v, i) => {
      return <HistoryBlk {...v} type={type} key={i} navigation={this.props.navigation} lang={this.props.lang} />;
    });
  }

  render() {
    const { lang } = this.props;
    const { history } = this.state;
    return (<ScrollView style={[styles.scrollContainer, s.flx_i]}>
          <V style={[s.pa2]}>
            { history.course && <V><V style={[s.flx_i]}>
                <T type={'title'} style={[styles.title, s.mv2]}>{`${LANG[lang].learning} (${history.course.length})`}</T>
              </V>
              <V>{this.renderHistoryList(history.course, 'course')}</V>
              </V>
            }
            { history.event && <V><V style={[s.flx_i]}>
                <T type={'title'} style={[styles.title, s.mv2]}>{`${LANG[lang].activity} (${history.event.length})`}</T>
                </V>
                <V>{this.renderHistoryList(history.event, 'event')}</V>
              </V>
            }
            { history.question && <V><V style={[s.flx_i]}>
                <T type={'title'} style={[styles.title, s.mv2]}>{`${LANG[lang].question} (${history.question.length})`}</T>
                </V>
                <V>{this.renderHistoryList(history.question, 'question')}</V>
              </V>
            }
          </V>
        </ScrollView>
      
    );
  }
}
// s.jcc, s.aic, s.ba, s.ma1, {width: 70, height: 70}, s.br2
const styles = StyleSheet.create({

});

export default (History = connect(
  (state, props) => ({
    lang: state.app.lang,
  }),
  (dispatch, props) => ({
    reqHistory: (cb) => dispatch(meActions.reqHistory(cb))
  })
)(HistoryScreen));
