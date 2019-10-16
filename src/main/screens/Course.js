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
  ImageBackground,
  Alert
} from 'react-native';
import { styles as s } from 'react-native-style-tachyons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import Modal from "react-native-modalbox";
import HTML from 'react-native-render-html';
import moment from 'moment';
import momentHK from 'moment/src/locale/zh-hk' ;
import _ from 'lodash';
import { Card, Icon, Avatar, Rating, Image } from 'react-native-elements';
import { Button, Text as T } from '@screens/SharedComponent/OnMyGradComponent'
import { MoreBtn, BackBtn } from '@screens/SharedComponent/IconBtn';
import LottieView from 'lottie-react-native';
import { actions as courseActions } from '@reducer/courseReducer'
import LANG from '@lang/lang';

const HEADER_MAX_HEIGHT = 400;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 60 : 73;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
const WINDOW_HEIGHT = Dimensions.get('window').height;

const Divider = () => {
  return (
    <V style={[styles.divider]}></V>
  )
}

const RatingBlk = (props) => {
  const { rating, rating_dis, rating_count, comment_list } = props.singleCourse;
  const { lang } = props;
  const ratingPercentage = _.map(rating_dis, (i) => { return (i/rating_count * 100).toFixed(2).toString().concat('%')} );
  renderRatingStars = (index) => {
    const staritems = [];
    for (let i = 0; i < (5-index); i++) { 
      staritems.push(<T>&#9733;</T>);
    }
    return staritems;
  }

  return (
    <V style={[s.pv2]}>
      <V style={[s.flx_i, s.flx_row]}>
        <V style={[s.flx_i, s.jcc]}>
          <T style={[{fontSize: 60, lineHeight: 65, color: '#4c4b50'}]}>{rating}</T>
        </V>
        <V style={[{flex: 1}]}>
          {_.map(ratingPercentage, (i, index) => {
            return <V style={[s.flx, s.flx_row, s.aic]} key={index}>
              <V style={[s.flx, s.flx_row, s.jcfe, s.ph2, {width: 40}]}>
                {this.renderRatingStars(index)}
              </V>
              <V style={[{flex: 1, backgroundColor: '#e5e5ea'}]}>
                <V style={[{height: 3, width: i, backgroundColor: '#8e8e93'}]}></V>
              </V>
            </V>
          })
          }
        </V>
      </V>
      <V style={[s.flx_i, s.aife]}>
        <T>{comment_list.length ? `${comment_list.length} ${LANG[lang].participated_comments}` : `-`}</T>
      </V>
    </V>
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

const CommentBlk = (props) => {
  const { user, rating, date, comment, created_time } = props;
  const formated_time = moment.unix(created_time).utcOffset(8).format("MMM Do YY")
  return (
    <V style={[s.mv2, s.pv1, {borderBottomWidth: 1, borderBottomColor: '#f1f1f1'}]}>
      <V style={[s.pv2]}>
        <T ellipsizeMode={'tail'}
          numberOfLines={2}>
          {comment}
        </T>
      </V>
      <V style={[s.flx_i, s.flx_row, s.aifs]}>
        <Avatar
          size={15}
          source={{ uri: user ? user.thumbnail : ''}}
          title={user.thumbnail ? '' : user.name}
          rounded
        />
        <V>
          <V style={[s.ml1]}><T>{user.name}</T></V>
        </V>
        <V style={[s.absolute, s.right_0]}><T>{formated_time}</T></V>
      </V>
      
    </V>
  )
}

class CourseScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerLeft: <BackBtn navigation={navigation} />,
		title: `${navigation.state.params.title}`,
		headerStyle: { borderBottomWidth: 0, elevation: 0, shadowOpacity: 0 }
	})
  /* static navigationOptions = ({ navigation }) => ({
    // title: `${navigation.state.params.event.title}`,
  }); */

  constructor(props) {
    super(props);
    console.log('eventdetail', props);

    this.state = {
      loading: true,
      isOpen: false,
      isDisabled: false,
      swipeToClose: true,
      scrollY: new Animated.Value(0),
      heart: require('../../../android/app/src/lottie_assets/like_heart.json'),
      like: false,
      like_speed: 0,
    };
  }

  componentDidMount(){
    const courseID = this.props.navigation.getParam('courseID', 'NO-ID');
    if (courseID !== 'NO-ID') {
      this.props.feedAll(courseID, () => {
        this.setState({
          loading: false,
          like: this.props.singleCourse.liked
        })
      })
    } else {
      this.props.navigation.goBack();
    }
  }

  renderTagList = () => {
    return _.map(this.props.singleCourse.tags, (v, i) => {
      return <Taglist tag={v} key={i} />;
    });
  }

  renderRecommendCourseblk = () => {
    return _.map(this.props.recommendation, (v, i) => {
      return <RecommendCourseblk {...v} {...i} navigation={this.props.navigation} lang={this.props.lang} key={i} />;
    });
  };

  renderCommentBlk = () => {
    return _.map(this.props.singleCourse.comment_list, (v,i) => {
      return <CommentBlk {...v} {...i} navigation={this.props.navigation} lang={this.props.lang} key={i} />;
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

  _GoPurchase = (id, title) => {
    this.props.reqPurchaseCourse((result) => {
      if (result) {
        this.setState({swipeToClose: !this.state.swipeToClose});
        this.props.navigation.navigate('Chapter', { courseID: id, title: title});
        this.refs.modal1.close()
      } else {
        Alert.alert(
          `${LANG[this.props.lang].sth_went_wrong}`,
          `${result}`
        )
        this.setState({swipeToClose: !this.state.swipeToClose});
        this.refs.modal1.close()
      }
    })
  }

  render() {
    const { loading, heart, like, like_speed } = this.state;
    const { lang, token } = this.props;
    const { event } = this.props.navigation.state.params;
    const {
      id,
      thumbnail,
      name,
      icon,
      image,
      company,
      title,
      content,
      location,
      start,
      end,
      index,
      description,
      view_count,
      rating,
      rating_dis,
      ratings_count,
      est_duration,
      purchased,
      comment_list,
      tag_list,
    } = this.props.singleCourse;

    // const headerTranslate = this.state.scrollY.interpolate({
    //   inputRange: [0, HEADER_SCROLL_DISTANCE],
    //   outputRange: [0, -HEADER_SCROLL_DISTANCE],
    //   extrapolate: 'clamp',
    // });

    // const imageOpacity = this.state.scrollY.interpolate({
    //   inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    //   outputRange: [1, 1, 0],
    //   extrapolate: 'clamp',
    // });
    // const imageTranslate = this.state.scrollY.interpolate({
    //   inputRange: [0, HEADER_SCROLL_DISTANCE],
    //   outputRange: [0, 100],
    //   extrapolate: 'clamp',
    // });
    // const titleTranslate = this.state.scrollY.interpolate({
    //   inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    //   outputRange: [0, 0, -20],
    //   extrapolate: 'clamp',
    // });

    return (
      <V style={[s.flx_i]}>
        <Modal
          style={[{justifyContent: 'center', alignItems: 'center', height:200}]}
          ref={"modal1"}
          swipeToClose={this.state.swipeToClose}
          backdrop={true}
          backdropOpacity={0.8}
          position={"bottom"}
          onClosingState={this.onClosingState}
          animationDuration={500}
        >
          <V style={[s.flx_i, s.pv3]}>
            <V style={[s.aifc]}>
              <T style={[styles.bold]}>{LANG[lang].confirm_start_learning}</T>
            </V>
            <V style={[]}>
              <V style={[s.pt3]}>
                <T style={[{fontSize: 16, lineHeight: 20}]}>{LANG[lang].free_learning_while_test}</T>
                <V style={[{zIndex: -1, marginTop: -12, height: 12, borderRadius: 16, backgroundColor: "#ffd926"}]}></V>
              </V>
            </V>
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
                onPress={() => this._GoPurchase(id, name)}
                title={LANG[lang].confirm_start_learning}
              />
            </V>
          </V>     
        </Modal>
        { loading
          ? <V style={[s.flx_i, s.jcc, s.aifc]}>
              <ActivityIndicator size="large" color="#ffd926" />
            </V>
          : (<>
            <ScrollView
              style={[styles.scrollContainer, s.flx_i, {marginBottom: 60}]}>
              <V style={[styles.header]}>
                <ImageBackground
                  style={[styles.backgroundImage]}
                  source={{uri: thumbnail}}
                >
                  <LinearGradient  colors={['rgba(73, 73, 73,0.0)', 'rgba(22, 22, 22, 0.73)']} style={[styles.linearGradient]}></LinearGradient>
                </ImageBackground>
              </V>
              <V style={[s.flx_i, styles.bar, s.ph3]}>
                <V style={[s.flx_i, s.pt2]}>
                  <V style={[styles.titlecontainer]}><T style={[styles.eventtitle]} >{name}</T></V>
                  <V style={[s.flx_row, s.mt1]}>
                    {_.map(tag_list, (v, i) => {
                      return <V key={`key${i}`} style={[{ backgroundColor: '#f1f1f1' }, s.br5, s.ph2, s.mr1]}><T>{v}</T></V>
                    })}
					        </V>
                </V>

                <V style={[s.flx_i, s.flx_row, s.aifs, s.mt3, s.jcc]}>
                  <V style={[s.flx_i, s.flx_row]}>
                      <Icon
                        name="user-circle-o"
                        color="#ffffff"
                        type="font-awesome"
                        size={14}
                        containerStyle={[s.mr1, s.jcc]}
                      />
                        <T style={[{color: '#ffffff'}]}>{
                            view_count
                            ? `${view_count} ${LANG[lang].view_count}`
                            : `- ${LANG[lang].view_count}`
                        }</T>
                    <Icon
                      name="clock-o"
                      color="#ffffff"
                      type="font-awesome"
                      size={15}
                      containerStyle={[s.ml3, s.mr1, s.jcc]}
                    />
                    { est_duration &&
                        <T style={[{color: '#ffffff'}]}>{this.toDisplayDuration(est_duration)}</T>
                    }
                  </V>
                  <V style={[s.flx_row, s.jsfe, s.jcc, s.aic, {flex:2, marginTop: -15, marginRight: -20}]}>
                    <V style={[s.aife, {flex: 4, marginRight: -15}]}>
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
                <Divider />
                <V><T type='title' style={[s.b]}>{LANG[lang].course_description}</T></V>
                <V style={[s.flx_i]}>
                  <HTML
                    html={description}
                    imagesMaxWidth={Dimensions.get('window').width}
                  />
                </V>
                { comment_list && (<V>
                    <V>
                      <Divider />
                      <V style={[s.flx_i]}>
                        <V style={[s.flx_i, s.aifs]}><T>{LANG[lang].course_comments}</T></V>
                        <V style={[s.flx_i, s.aife]}>
                          <T>{comment_list ? `${comment_list.length} ${LANG[lang].participated_comments}` : `-`}</T>
                        </V>
                      </V>
                      {/* <RatingBlk {...this.props}/> */}
                    </V>
                    <V style={[s.mt2]}>
                      {this.renderCommentBlk()}
                    </V>
                  </V>)
                }
            </V>

            </ScrollView>
          
            <V style={[s.absolute, s.bottom_0, s.ph4, s.pb4, s.pt2, {width: '100%', backgroundColor: '#ffffff'}]}>
              { _.isEmpty(token)
                ? <Button
                    type='OnMyGrad'
                    title={`${LANG[lang].start_learn}`}
                    buttonStyle={[styles.gositebutton]}
                    titleStyle={[styles.infotitle]}
                    onPress={() => {
                      this.props.navigation.navigate('Login')
                    }}
                  />
                : purchased
                  ? <Button
                      type='OnMyGrad'
                      title={`${LANG[lang].continue_learn}`}
                      buttonStyle={[styles.gositebutton]}
                      titleStyle={[styles.infotitle]}
                      onPress={() => {
                        this.props.navigation.navigate('Chapter', { courseID: id, title: name })
                      }}
                    />
                  : <Button
                      type='OnMyGrad'
                      title={`${LANG[lang].start_learn}`}
                      buttonStyle={[styles.gositebutton]}
                      titleStyle={[styles.infotitle]}
                      onPress={() => {
                        this.refs.modal1.open()
                      }}
                    />
              }
            </V>
          </>)
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
    marginBottom:4
  },
  header: {
    overflow: 'hidden',
    backgroundColor: '#ffd926',
    height: HEADER_MAX_HEIGHT,
  },
  bar: {
    backgroundColor: 'transparent',
    marginTop: Platform.OS === 'ios' ? 28 : 38,
    alignItems: 'flex-start',
    justifyContent: 'center',
    position: 'absolute',
    top: HEADER_MAX_HEIGHT - 200,
    right: 0,
    left: 0,
  },
  titleinfo: {
    marginLeft: 10
  },
  titlecontainer: {
  },
  eventtitle: {
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: 1.65,
    color: '#ffffff',
    fontFamily: Platform.OS == 'ios' ? `Noto Sans TC Bold` : `NotoSansTC-Bold`,
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
  iconcontainer: {
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
    width: 236,
    height: 39,
    borderRadius: 19.5,
    backgroundColor: '#ffd926'
  },
  linearGradient: {
    flex: 1,
  },
});

export default (Course = connect(
  (state, props) => ({
    lang: state.app.lang,
    singleCourse: state.course.singleCourse,
    recommendation: state.course.recommendation,
    token: state.auth.token,
  }),
  (dispatch, props) => ({
    feedAll: (courseID, cb) => {
      dispatch(courseActions.reqSingleCourse(courseID, cb));
      // dispatch(courseActions.reqRecommendation())
    },
    reqLike: (cb) => dispatch(courseActions.reqLike(cb)),
    reqUnlike: (cb) => dispatch(courseActions.reqUnlike(cb)),
    reqPurchaseCourse: (cb) => dispatch(courseActions.reqPurchaseCourse(cb)),
  })
)(CourseScreen));
