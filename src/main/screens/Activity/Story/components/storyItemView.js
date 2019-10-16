// @flow
import React, { Fragment, PureComponent } from "react";
import { View as V, SafeAreaView, Image, StyleSheet, Platform, Dimensions, TouchableWithoutFeedback } from "react-native";
import { Button, Text as T } from '@screens/SharedComponent/OnMyGradComponent'
import { styles as s } from 'react-native-style-tachyons';
import { TouchableOpacity } from "react-native-gesture-handler";
import moment from 'moment';
import momentHK from 'moment/src/locale/zh-hk' ;

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

export default class StoryItem extends PureComponent {

  render() {
    const {
      story: { thumbnail, name, id, company, logo, eventid, cover_image, application_deadline },
      ready,
      selectedStory,
      handleSelectedStoryOnLoaded,
    } = this.props;
    const formated_time = moment.unix(application_deadline).utcOffset(8).format("MMM-DD-YY")
    console.log(this.props)
    return (
      <V style={[s.flx_i]}>
        <V style={[s.flx_i]}>
          <Image
            onLoad={() =>
              selectedStory &&
              selectedStory.id === id &&
              handleSelectedStoryOnLoaded()
            }
            style={styles.image}
            source={{ uri: cover_image }}
          />
          <V style={[s.ph2, s.jcc, s.aifc, {marginLeft: 'auto', marginRight: 'auto', top: 90, height: 30}]}> 
            <T type="title" style={[styles.date, {flexWrap: 'wrap'}]}>
              {formated_time}
            </T>
          </V>
          <V style={[s.mh2, {paddingLeft: 10, paddingRight: 10, marginLeft: 'auto', marginRight: 'auto',top: 120, height: 100}]}> 
            <T type="title" style={[styles.program, {flexWrap: 'wrap'}]}>
              {name}
            </T>
          </V>
        </V>
      </V>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: 'cover',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width: null,
    height: Dimensions.get("window").height,
  },
  date: {
    fontSize: 18,
    lineHeight: 20,
    color: '#323643'
  },
  program: {
    fontFamily: Platform.OS == 'ios' ? `Noto Sans TC Bold` : `NotoSansTC-Bold`,
    fontSize: 22,
    lineHeight: 24,
    color: '#323643'
  }
});
