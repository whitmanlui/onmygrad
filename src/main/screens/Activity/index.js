import React, { Component } from 'react';
import { View as V, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { Button, Text as T } from '@screens/SharedComponent/OnMyGradComponent'
import { connect } from 'react-redux';
import { styles as s } from 'react-native-style-tachyons';
import { actions as eventActions } from '@reducer/eventReducer';
import { actions as deadlineActions } from '@reducer/deadlineReducer';

import BannerAds from '../SharedComponent/BannerAds'
import Story from './Story';
import EventList from './EventList';
class ActivityScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Activity',
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      firstIndex: [0]
    }
  }

  componentDidMount() {
    this.props.reqAllEvent(
      () => {
        this.setState({
          loading: false
        })
      }
    );
    this.props.reqAllDeadline(
      () => {
        const alldates =  this.props.allDeadline.map((x) => { return (x.application_deadline) });
        const distinctdate =  [...new Set(alldates)];
        // console.log(distinctdate)
        const firstIndex = distinctdate.map(x => alldates.indexOf(x));
        this.setState({
          firstIndex: firstIndex
        })
      }
    );
  }

  render() {
    const { allEvent, allDeadline, token } = this.props;
    const { loading, firstIndex } = this.state;

    return (
      <V>
        <ScrollView style={[s.pv1]}> 
          <Story
            unPressedBorderColor="#e95950"
            pressedBorderColor="#ebebeb"
            navigation={this.props.navigation}
            lang={this.props.lang}
            stories={allDeadline}
            firstIndex={firstIndex}
            token={token}
          />
          <BannerAds {...this.props}/>
          <V style={[s.ph3,{backgroundColor: '#f6f6f6'}]}>
            { loading
              ? <V style={[s.flx_i, s.jcc, s.aifc, s.mt5]}>
                  <ActivityIndicator size="large" color="#ffd926" />
                </V>
              :  <EventList
                    navigation={this.props.navigation}
                    lang={this.props.lang}
                    event={allEvent}
                />
            }
          </V>
        </ScrollView>
      </V>
    );
  }
}

export default ActivityScreen = connect(
  (state, props) => ({
    lang: state.app.lang,
    allEvent: state.event.allEvent,
    allDeadline: state.deadline.allDeadline,
    token: state.auth.token,
  }),
  (dispatch, props) => ({
    reqAllEvent: (cb) => dispatch(eventActions.reqAllEvent(cb)),
    reqAllDeadline: (cb) => dispatch(deadlineActions.reqAllDeadline(cb))
  })
)(ActivityScreen);
