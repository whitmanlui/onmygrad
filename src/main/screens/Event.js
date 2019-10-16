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
  ActivityIndicator,
  Linking,
  ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import HTML from 'react-native-render-html';
import { styles as s } from 'react-native-style-tachyons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { BackBtn } from '@screens/SharedComponent/IconBtn'
import _ from 'lodash';
import moment from 'moment';
import momentHK from 'moment/src/locale/zh-hk' ;
import { Card, Icon, Avatar, Image } from 'react-native-elements';
import { Button, Text as T, LinearBtn } from '@screens/SharedComponent/OnMyGradComponent'
import LottieView from 'lottie-react-native';
import { actions as eventActions } from '@reducer/eventReducer'

const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 50 : 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
const WINDOW_HEIGHT = Dimensions.get('window').height;
const WINDOW_WIDTH = Dimensions.get('window').width;

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
    // <V style={[{ backgroundColor: '#f1f1f1', marginTop: 3, paddingTop: 3, paddingBottom: 3}, s.br5, s.ph2, s.mr1]}>
    //   <T>{tag}</T>
    // </V>
  )
}

const RecommendEventblk = (props) => {
  return (
    <Card 
      containerStyle={[styles.eventcard]}
      wrapperStyle={[s.pa2]}
      >
        <V>
          <T style={[styles.infotitle]}>{props.title}</T>
          <T style={[styles.infocontent]}>{props.company}</T>
        </V>
    </Card>
  )
}


class EventScreen extends Component {
  static navigationOptions = ({ navigation }) => ({		
		headerLeft: <BackBtn navigation={navigation} />,
		title: `${navigation.state.params.title}`,
		headerStyle: { borderBottomWidth: 0, elevation: 0, shadowOpacity: 0 }
	})

  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0),
      loading: true,
      like: false,
      like_speed: 0,
      heart: require('../../../android/app/src/lottie_assets/like_heart.json')
    };
  }

  componentDidMount(){
    const eventID = this.props.navigation.getParam('eventID', 'NO-ID'); 
    if (eventID !== 'NO-ID') {
      this.props.feedAll(eventID, () => {
        this.setState({
          loading: false
        })
      })
    }
  }

  renderTagList = () => {
    return _.map(this.props.singleEvent.tag_list, (v, i) => {
      return <Taglist tag={v} key={i} />;
    });
  }

  renderRecommendEventblk = () => {
    return _.map(this.props.recommendation, (v, i) => {
      return <RecommendEventblk {...v} {...i} key={i} />;
    });
  };

  _PressLike = () => {
    this.animation.play()
    this.setState({
      like_speed: 0.95,
    })
    setTimeout( () => {
      this.setState({like: true})
      },
      1000
    )
    this.props.reqLike( () => {
      console.log('like jor')
    })
  }

  _PressUnlike = () => {
    this.animation.play()
    this.setState({
      like_speed: -0.95,
    })
    setTimeout( () => {
      this.setState({like: false})
      },
      1000
    )
    this.props.reqUnlike( () => {
      console.log('unlike jor')
    })
  }

  _goExternal = (website) => {
    Linking.canOpenURL(website).then(supported => {
      if (supported) 
        Linking.openURL(website);
    });
  }

  ConvertDuration = (starttimestamp, endtimestamp) => {
    moment.locale('zh-hk', momentHK );
    const start_timestamp = moment.unix(starttimestamp).utcOffset(8)
    const end_timestamp = moment.unix(endtimestamp).utcOffset(8)

    if ((start_timestamp.month() === end_timestamp.month()) && (start_timestamp.year() === end_timestamp.year()) && (start_timestamp.date() === end_timestamp.date())) {
      return (`${start_timestamp.format("HH:mm")}-${end_timestamp.format("HH:mm")} ${start_timestamp.format("MMM")} ${start_timestamp.format("Do")}`)
    } else {
      return (`${start_timestamp.format("HH:mm MMM Do")} - ${end_timestamp.format("HH:mm MMM Do")}`)
    }
  };

  FormatDate = (timestamp) => {
    moment.locale('zh-hk', momentHK);
    return moment.unix(timestamp).utcOffset(8).format('HH:mm MMM Do');
  }

  render() {
    const { lang, token } = this.props;
    const {
      id,
      name,
      company,
      icon,
      description,
      rsvp,
      tag_list,
      website,
      location,
      start_time,
      end_time,
      application_deadline,
      thumbnail
    } = this.props.singleEvent;
    const { loading, heart, like_speed, like } = this.state;

    const headerTranslate = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, -HEADER_SCROLL_DISTANCE],
      extrapolate: 'clamp',
    });

    const imageOpacity = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 1, 0],
      extrapolate: 'clamp',
    });
    const imageTranslate = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 100],
      extrapolate: 'clamp',
    });
    const titleTranslate = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 0, -20],
      extrapolate: 'clamp',
    });

    return (
      <V style={[s.flx_i]}>
        { loading
          ?  <V style={[s.flx_i, s.jcc, s.aifc]}>
              <ActivityIndicator size="large" color="#ffd926" />
            </V>
          : <ScrollView
              style={[styles.scrollContainer, s.flx_i, s.pb4]}
              showsVerticalScrollIndicator={false}
            >
            <V style={[styles.header]}>
              <ImageBackground
                style={[styles.backgroundImage]}
                source={{uri: thumbnail ? thumbnail : 'https://ongradstorage1.blob.core.windows.net/testingdata/Group7.png'}}
              >
                <LinearGradient  colors={['rgba(73, 73, 73,0.0)', 'rgba(22, 22, 22, 0.73)']} style={[styles.linearGradient]}></LinearGradient>
              </ImageBackground>
            </V>
            <V style={[s.ph3, styles.bar]}>
              <V style={[s.flx_i]}>
                <V style={[s.flx_i, s.flx_row]}>
                  <V>
                      <Avatar
                        rounded
                        source={{uri: company.thumbnail}}
                        size="large"
                      />
                  </V>
                  <V style={[s.mr3, s.ml1]}>
                    <T style={[styles.eventtitle]} ellipsizeMode={'tail'} numberOfLines={2}>{name}</T>
                    <T style={[styles.eventcompany]}>{company.name}</T>
                    <V style={[s.flx_row, s.pt1, s.pb1, s.flx_wrap]}>
                      {_.map(tag_list, (v, i) => {
                        return <V key={`key${i}`} style={[{ backgroundColor: '#f1f1f1' }, s.br5, s.ph2, s.mr1]}><T>{v}</T></V>
                      })}
                    </V>
                  </V>
                </V>
              </V>
              <V style={[s.flx_i, s.flx_row, s.aifs, s.mt3, s.jcc]}>
                  <V style={[s.flx_i, s.flx_row, s.jcc, s.aic, {marginTop: -15, marginRight: -20}]}>
                    <V style={[s.jcc, s.aife, {flex: 4, marginRight: -15}]}>
                    <T style={[{color: '#ffffff', textAlign: 'center', textAlignVertical: "center"}]}>{like ? `${LANG[lang].added_favourite}` : `${LANG[lang].add_favourite}`}</T>
                    </V>
                    <V style={[s.flx_i, {width: 50,height: 50}]}>
                      <TouchableWithoutFeedback
                        onPress={() => {
                          token.token
                          ? like ? this._PressUnlike() : this._PressLike()
                          : this.props.navigation.navigate('Login')
                        }}
                      >
                        <LottieView
                          ref={ animation => {this.animation = animation}}
                          source={heart}
                          speed={like_speed}
                          loop={false}
                          progress={ like ? 1 : 0}
                        />
                      </TouchableWithoutFeedback>
                    </V>
                  </V>
                </V>
            </V>
            
            <V style={[s.flx_i, s.ph3, s.pv3]}>
              <V style={[s.mb2]}>
                <T type={'title'} style={[s.ml1, styles.bold]}>{name}</T>
              </V>
              <Divider />
              <V style={[s.mb3]}>
                <HTML
                  html={description}
                  imagesMaxWidth={Dimensions.get('window').width}
                />
              </V>
              <Divider />
              { application_deadline && (<V style={[s.flx_i, s.flx_row, s.mb2]}>
                    <V>
                      <Icon
                        name='calendar'
                        color='#a4a4a4'
                        type='font-awesome'
                        size={16}
                        containerStyle={[styles.iconcontainer, s.mr1]}
                      />
                    </V>
                    <V>
                      <T style={[styles.infotitle, s.mb1]}>{LANG[lang].deadline_date}</T>
                      <T style={[styles.infocontent]}>{this.FormatDate(application_deadline)}</T>
                    </V>
                  </V>
                )
              }
              <V style={[s.flx_i, s.flx_row]}>
                <V>
                  <Icon
                    name='calendar'
                    color='#a4a4a4'
                    type='font-awesome'
                    size={16}
                    containerStyle={[styles.iconcontainer, s.mr1]}
                  />
                </V>
                <V>
                  <T style={[styles.infotitle, s.mb1]}>{LANG[lang].event_date}</T>
                  <T style={[styles.infocontent]}>{this.ConvertDuration(start_time, end_time)}</T>
                </V>
              </V>
              <V style={[s.flx_i, s.flx_row, s.mt2]}>
                <V>
                  <Icon
                    name='map-marker'
                    color='#a4a4a4'
                    type='font-awesome'
                    size={16}
                    containerStyle={[styles.iconcontainer, s.mr1]}
                  />
                </V>
                <V>
                  <T style={[styles.infotitle, s.mb1]}>{LANG[lang].location}</T>
                  <T style={[styles.infocontent]}>{location}</T>
                </V>
              </V>
              
              {/* <V style={[s.mt2]}>
                <Divider />
                <V><T style={[styles.infotitle]}>{`${LANG[lang].recommend_to_you} (${this.props.recommendation.length})`}</T></V>
                <ScrollView
                  style={[s.flx_row, s.mv2, s.pb1]}
                  horizontal
                  onScrollBeginDrag={() => {console.log('horizontal scroll start')}}
                  onScrollEndDrag={() => {console.log('horizontal scroll end')}}
                >
                  {this.renderRecommendEventblk()}
                </ScrollView>
              </V> */}
              <V style={[s.aic, s.mt2, s.mb4]}>
                { rsvp.is_enabled
                  ? <LinearBtn
                      title={LANG[lang].apply_now}
                      buttonStyle={[styles.gositebutton]}
                      titleStyle={[styles.infotitle]}
                      onPress={() => console.log('apply internally')}
                    />
                  : <LinearBtn
                      title={LANG[lang].go_to_website}
                      containerStyle={[styles.gositebutton]}
                      titleStyle={[styles.infotitle]}
                      onPress={() => {
                        token.token 
                        ? website
                          ? this._goExternal(website)
                          : this._goExternal('https://www.ongrad.com')
                        : this.props.navigation.navigate('Login')
                      }}
                  />
                }
              </V>
            </V>
          </ScrollView>
        }
      </V>
    );
  }
}
// s.jcc, s.aic, s.ba, s.ma1, {width: 70, height: 70}, s.br2
const styles = StyleSheet.create({
  bold: {
    fontFamily: Platform.OS == 'ios' ? `Noto Sans TC Bold` : `NotoSansTC-Bold`,
  },
  tag: {
    color: 'white',
    borderColor: 'white',
    margin: 2,
    paddingTop: 3,
    paddingBottom: 3,
    paddingRight: 8,
    paddingLeft: 8,
  },
  tagtext: {
    fontSize: 10,
    color: "white",
    textTransform: "uppercase"
  },
  divider: {
    width: 25,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#fdd850',
    marginTop:2,
    marginBottom:8
  },
  header: {
    overflow: 'hidden',
    backgroundColor: '#ffd926',
    height: HEADER_MAX_HEIGHT,
  },
  bar: {
    backgroundColor: 'transparent',
    marginTop: Platform.OS === 'ios' ? 18 : 20,
    width: WINDOW_WIDTH,
    alignItems: 'flex-start',
    justifyContent: 'center',
    position: 'absolute',
    top: Platform.OS === 'ios' ? HEADER_MAX_HEIGHT - 150 : HEADER_MAX_HEIGHT - 160,
    right: 0,
    left: 0,
  },
  eventtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: 'white',
  },
  eventcompany: {
    color: 'white',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: null,
    height: HEADER_MAX_HEIGHT,
    resizeMode: 'cover',
  },
  scrollContainer: {
    flex: 1,
    paddingBottom: 60
  },
  infotitle: {
    fontSize: 14,
    fontWeight: "500",
  },
  infocontent: {
    opacity: 0.9,
    fontSize: 12,
    fontWeight: "300",
    fontStyle: "normal",
    lineHeight: 18,
    letterSpacing: 0,
    color: "#5a6169"
  },
  linearGradient: {
    flex: 1,
  },
  eventcard: {
    borderRadius: 10,
    shadowColor: "rgba(228, 228, 228, 0.5)",
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: 12,
    shadowOpacity: 1,
    marginLeft: 0,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 5,
    paddingTop: 5,
    paddingBottom: 5,
    height: 75,
    width: 150
  },
  gositebutton: {
    width: 300,
    height: 39,
    borderRadius: 19.5,
    backgroundColor: '#ffd926'
  }
});

export default (Event = connect(
  (state, props) => ({
    lang: state.app.lang,
    singleEvent: state.event.singleEvent,
    recommendation: state.event.recommendation,
    token: state.auth.token
  }),
  (dispatch, props) => ({
    feedAll: (eventID, cb) => {
      dispatch(eventActions.reqSingleEvent(eventID, cb));
      dispatch(eventActions.reqRecommendation());
    },
    reqLike: (cb) => dispatch(eventActions.reqLike(cb)),
    reqUnlike: (cb) => dispatch(eventActions.reqUnlike(cb)),
  })
)(EventScreen));
