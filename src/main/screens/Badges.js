import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View as V,
  Platform,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { styles as s } from 'react-native-style-tachyons';
import _ from 'lodash';
import { Card, Icon, Avatar, Image } from 'react-native-elements';
import { Button, Text as T, LinearBtn } from '@screens/SharedComponent/OnMyGradComponent'
import badges from '@screens/SharedComponent/badges';

const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 50 : 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

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

class BadgesScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    // title: `${navigation.state.params.event.title}`,
  });

  constructor(props) {
    super(props);
  }

  componentDidMount(){
    const eventID = this.props.navigation.getParam('eventID', 'NO-ID'); 
    if (eventID !== 'NO-ID') {
      this.props.feedAll(eventID, () => {
        this.setState({loading: false})
      })
    }
  }

  render() {
    const { lang } = this.props;

    return (
      <ScrollView>
        <V style={[s.flx_i]}>
          <V style={[s.flx_i, s.pa3]}><T type={'title'} style={[s.b]}>{`${LANG[lang].my_badge}`}</T></V>
          <V style={[s.flx_i, s.flx_row, s.ph2]}>
            <V style={[s.flx_i, s.ph2, s.pv3, s.aic]}>
              <Avatar rounded size="large"
                source={badges["exp"]["lv0"]}
                containerStyle={[s.mb3]}
              />
              <V><T>{` [依家] / [下一Lv要求] `}</T></V>
              <V><T>{`${LANG[lang].medal_experience_point}`}</T></V>
              <V><T>{`${LANG[lang].medal_experience_point_des}`}</T></V>
            </V>

            <V style={[s.flx_i, s.ph2, s.pv3, s.aic]}>
              <Avatar rounded size="large"
                source={badges["likeGive"]["lv0"]}
                containerStyle={[s.mb3]}
              />
              <V><T>{` [依家] / [下一Lv要求] `}</T></V>
              <V><T>{`${LANG[lang].medal_positive_energy}`}</T></V>
              <V><T>{`${LANG[lang].medal_positive_energy_des}`}</T></V>
            </V>

          </V>
          <V style={[s.flx_i, s.flx_row, s.ph2]}>
            <V style={[s.flx_i, s.ph2, s.pv3, s.aic]}>
              <Avatar rounded size="large"
                source={badges["follower"]["lv0"]}
                containerStyle={[s.mb3]}
              />
              <V><T>{` [依家] / [下一Lv要求] `}</T></V>
              <V><T>{`${LANG[lang].medal_being_followed}`}</T></V>
              <V><T>{`${LANG[lang].medal_being_followed_des}`}</T></V>
            </V>

            <V style={[s.flx_i, s.ph2, s.pv3, s.aic]}>
              <Avatar rounded size="large"
                source={badges["mutual"]["lv0"]}
                containerStyle={[s.mb3]}
              />
              <V><T>{` [依家] / [下一Lv要求] `}</T></V>
              <V><T>{`${LANG[lang].medal_mutual_follow}`}</T></V>
              <V><T>{`${LANG[lang].medal_mutual_follow_des}`}</T></V>
            </V>

          </V>
          <V style={[s.flx_i, s.flx_row, s.ph2]}>
            <V style={[s.flx_i, s.ph2, s.pv3, s.aic]}>
              <Avatar rounded size="large"
                source={badges["likeReceive"]["lv0"]}
                containerStyle={[s.mb3]}
              />
              <V><T>{` [依家] / [下一Lv要求] `}</T></V>
              <V><T>{`${LANG[lang].medal_net_like}`}</T></V>
              <V><T>{`${LANG[lang].medal_net_like_des}`}</T></V>
            </V>

            <V style={[s.flx_i, s.ph2, s.pv3, s.aic]}>
              <Avatar rounded size="large"
                source={badges["favourite"]["lv0"]}
                containerStyle={[s.mb3]}
              />
              <V><T>{` [依家] / [下一Lv要求] `}</T></V>
              <V><T>{`${LANG[lang].medal_being_favourite}`}</T></V>
              <V><T>{`${LANG[lang].medal_being_favourite_des}`}</T></V>
            </V>

          </V>
          <V style={[s.flx_i, s.flx_row, s.ph2]}>
            <V style={[s.flx_i, s.ph2, s.pv3, s.aic]}>
              <Avatar rounded size="large"
                source={badges["topic"]["lv0"]}
                containerStyle={[s.mb3]}
              />
              <V><T>{` [依家] / [下一Lv要求] `}</T></V>
              <V><T>{`${LANG[lang].medal_topic}`}</T></V>
              <V><T>{`${LANG[lang].medal_topic_des}`}</T></V>
            </V>

            <V style={[s.flx_i, s.ph2, s.pv3, s.aic]}>
              <Avatar rounded size="large"
                source={badges["circle"]["lv0"]}
                containerStyle={[s.mb3]}
              />
              <V><T>{` [依家] / [下一Lv要求] `}</T></V>
              <V><T>{`${LANG[lang].medal_circle_joined}`}</T></V>
              <V><T>{`${LANG[lang].medal_circle_joined_des}`}</T></V>
            </V>

          </V>
          
        </V>
      </ScrollView>
    );
  }
}
// s.jcc, s.aic, s.ba, s.ma1, {width: 70, height: 70}, s.br2
const styles = StyleSheet.create({
});

export default (Badges = connect(
  (state, props) => ({
    lang: state.app.lang,
    singleEvent: state.event.singleEvent,
    recommendation: state.event.recommendation,
  }),
  (dispatch, props) => ({
  })
)(BadgesScreen));
