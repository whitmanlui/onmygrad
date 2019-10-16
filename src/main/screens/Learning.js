import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View as V, ScrollView, StyleSheet, TouchableWithoutFeedback, Platform } from 'react-native';
import { Button, Text as T } from '@screens/SharedComponent/OnMyGradComponent'
import { BackBtn } from '@screens/SharedComponent/IconBtn'
import { styles as s } from 'react-native-style-tachyons';
import _ from 'lodash';
import { Card, Icon, Avatar, Image } from 'react-native-elements'
import Svg, {Path, Circle, G} from 'react-native-svg';
import LANG from '@lang/lang';
import { actions as courseActions } from '@reducer/courseReducer'



const MyCourseblk = props => {
  const {
    id,
    thumbnail,
    name,
    complete,
    index,
    lang
  } = props;

  const getCoordinatesForPercent= (percent) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  }

  const startX = getCoordinatesForPercent(0)[0];
  const startY = getCoordinatesForPercent(0)[1];
  const endX = getCoordinatesForPercent(complete)[0];
  const endY = getCoordinatesForPercent(complete)[1];
  
  const largeArcFlag = complete > .5 ? 1 : 0;
  
  const pathData = [
    `M 1 0`,
    `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
    `L 0 0`,
  ].join(' ');

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        props.navigation.navigate('Course', { courseID: id, title: name });
      }}
    >
      <V>
        <Card
          key={index}
          containerStyle={[styles.mycard, s.br3]}
          wrapperStyle={[s.h4, s.relative]}
        >
          <Image
            source={{ uri: thumbnail }}
            containerStyle={[styles.myimagecontainer, s.br3]}
            style={[styles.myimage]}
          />
          {/* <V style={[styles.mycourseinfo, s.absolute, s.ma2]}>
            <V style={[s.flx_i, s.flx_row, s.asfe]}>
              <V style={[s.mr1, s.aic, s.jcc,{ transform: [{ rotate: '-90deg' }]}]}>
                <Svg height="14" width="14" viewBox="-1 -1 2 2">
                { complete === 1 ?
                  <Circle
                    cx="0"
                    cy="0"
                    r="1"
                    fill="#86e99f"
                  />
                  : complete && <G>
                    <Circle
                      cx="0"
                      cy="0"
                      r="1"
                      fill="white"
                    />
                    <Path
                      d={pathData}
                      fill="#86e99f"
                    />
                  </G>}
                </Svg>
              </V>
              <V>
                <T style={[styles.mycomplete]}>{complete > 0 ? `${LANG[lang].complete} ${Math.round(complete * 100)}% ` : `${LANG[lang].not_complete}`}</T>
              </V>
            </V>
          </V> */}
        </Card>
        <V style={[s.mb1, s.mt1, {width: 100}]}>
          <T
            style={[styles.mycoursetitle]}
            ellipsizeMode='tail'
            numberOfLines={1}
          >
            {name}
          </T>
        </V>
      </V>
    </TouchableWithoutFeedback>
  );
};

const HotCourseblk = props => {
  const {
    id,
    thumbnail,
    name,
    description,
    view_count,
    lecture_count,
    time,
    index,
    est_duration,
    level,
    lang
  } = props;

  toDisplayDuration = (seconds) => {
    if (seconds <= 60 ) {
      return `~1${LANG[lang].min}`
    } else {
      if (seconds / 60 >= 60) {
        return `${Math.round(seconds/3600)}${LANG[lang].hour} ${Math.round(seconds%3600/60)}${LANG[lang].min}`
      } else {
        return `${Math.round(seconds/60) }${LANG[lang].min}`
      }
    }
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        props.navigation.navigate('Course', { courseID: id, title: name });
      }}
    >
      <V style={[s.flx_i]}>
      <Card
        key={index}
        containerStyle={[styles.card, s.br3]}
        wrapperStyle={[s.hotcardwrapper, s.flx_row]}
      >
        <Image
          source={{ uri: thumbnail }}
          containerStyle={[styles.imagecontainer, s.br3, s.br__left]}
          style={[styles.image]}
        />
        <V style={[s.flx_i, s.mh2, s.mv2]}>
          <V style={[s.mb1]}>
            <T style={[styles.hot_course_title]} numberOfLines={2} ellipsizeMode={`tail`}>{name}</T>
          </V>
          <V style={[s.mb1]}>
            <T style={[styles.hotcontent, s.mt1]} ellipsizeMode='tail' numberOfLines={2}>
              {description.replace(/(&nbsp;|<([^>]+)>)/ig, "")}
            </T>
          </V>
          <V style={[s.flx_i, s.flx_row, s.aife]}>
            <V><T style={[styles.subinfo]}>{level}</T></V>
            <V style={[s.flx_i, s.flx_row]}>
              <Icon
                name="user-circle-o"
                color="#a4a4a4"
                type="font-awesome"
                size={14}
                containerStyle={[s.mr1, s.jcc]}
              />
              <T style={[styles.subinfo]}>
                {
                  view_count
                  ? `${view_count} ${LANG[lang].view_count}`
                  : `- ${LANG[lang].view_count}`
                }
              </T>
            </V>
            <V style={[s.flx_i, s.flx_row]}>
              <Icon
                name="clock-o"
                color="#a4a4a4"
                type="font-awesome"
                size={15}
                containerStyle={[s.ml3, s.mr1, s.jcc]}
              />
              <T style={[styles.subinfo]}>{this.toDisplayDuration(est_duration)}</T>
            </V>
            {/* <V>
              <Icon
                name='ellipsis-h'
                color='#a4a4a4'
                type='font-awesome'
                size={12}
                containerStyle={[s.mr1]}
              />
            </V> */}
          </V>
        </V>
      </Card>
      </V>
    </TouchableWithoutFeedback>
  );
};

class LearningScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Learning',
  });

  constructor(props){
    super(props)
    console.log(props)
  }

  componentDidMount(){
    this.props.reqAllCourse();
  }

  renderMyCourseblk = () => {
    return _.map(this.props.myCourse, (v, i) => {
      return <MyCourseblk {...v} key={i} navigation={this.props.navigation} lang={this.props.lang}/>;
    });
  }

  renderHotCourseblk = () => {
    return _.map(this.props.hotCourse, (v, i) => {
      return <HotCourseblk {...v} key={i} navigation={this.props.navigation} lang={this.props.lang}/>;
    });
  };

  render() {
    const { lang, token } = this.props;
    return (
        <ScrollView style={[s.ph3, s.pv1, {backgroundColor: '#f6f6f6'}]}>
          { token.token && <V style={[s.flx_i, s.flx_row]}>
            <V style={[s.flx_i]}>
              <T type={'title'} style={[styles.title, s.mv2]}>{`${LANG[lang].my_course} (${this.props.myCourse.length})`}</T>
            </V>
            {/* <V style={[styles.subinfo, s.flx_i, s.aife, s.jcfe, s.mv2]}>
              <TouchableOpacity>
                <V><T>{LANG[lang].show_all}</T></V>
              </TouchableOpacity>
            </V> */}
            </V>
          }
          { token.token && <ScrollView horizontal>
              <V style={[s.flx_row]}>
                {this.renderMyCourseblk()}
              </V>
            </ScrollView>
          }
          <V>
            <T type={'title'} style={[styles.title, s.mv2]}>{`${LANG[lang].hot_course} >`}</T>
          </V>
          <V>
            {this.renderHotCourseblk()}
          </V>
        </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  title: { color: "#000", fontWeight: 'bold' , fontSize: 16},
  subTitle: { color: "#808080", fontSize: 12},
  mycourseinfo: {
    bottom: 0
  },
  mycomplete: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  mycard: {
    marginLeft: 0,
    marginRight: 10,
    marginTop: 5,
    marginBottom: 5,
    padding: 0
  },
  myimagecontainer: {
    width: 110,
    height: 150,
    overflow: 'hidden'
  },
  myimage: {
    height:160,
    width:120,
  },
  mycoursetitle: {
    fontSize: 12,
    fontWeight: "500",
  },
  card: {
    borderColor: "transparent",
    shadowColor: '#ffffff',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    marginLeft: 0,
    marginRight: 0,
    marginTop: 5,
    marginBottom: 5,
    padding: 0
  },
  hotcardwrapper: {
    height: 120,
  },
  hot_course_title: {
    fontFamily: Platform.OS == 'ios' ? `Noto Sans TC Bold` : `NotoSansTC-Bold`,
    fontSize: 14,
    lineHeight: 16,
    color: '#323643'
  },
  hotcontent: {
    fontSize: 12,
		lineHeight: 14,
		color: '#323643'
  },
  imagecontainer: {
    width: 100,
    height: 130,
    overflow: 'hidden'
  },
  image: {
    height:130,
    width:105,
  },
  tag: {
    color: "#a4a4a4",
    borderColor: "#a4a4a4",
    margin: 2,
    paddingTop: 3,
    paddingBottom: 3,
    paddingRight: 8,
    paddingLeft: 8,
  },
  subinfo: {
    color: "#a4a4a4",
  }
});

export default Learning = connect(
  (state, props) => ({
    lang: state.app.lang,
    hotCourse: state.course.hotCourse,
    myCourse: state.course.myCourse,
    token: state.auth.token,
  }),
  (dispatch, props) => ({
    
    reqAllCourse: () => dispatch(courseActions.reqAllCourse())
  }),
)(LearningScreen);
