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
  Linking
} from 'react-native';
import { styles as s } from 'react-native-style-tachyons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';
import { Card, Icon, Avatar, Image, Header } from 'react-native-elements';
import { Button, Text as T } from '@screens/SharedComponent/OnMyGradComponent'
import { CloseBtn } from '@screens/SharedComponent/IconBtn'
import { MoreBtn } from '@screens/SharedComponent/IconBtn';
import HTML from 'react-native-render-html';
import VideoPlayer from 'react-native-video-controls';
import LANG from '@lang/lang';
import { actions as courseActions } from '@reducer/courseReducer';

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


const VideoMaterial = (props) => {
  const { content, name } = props.content;
  return (
    <VideoPlayer
      source={{uri: content}}   // Can be a URL or a localfile.
      ref={(ref) => {
        this.player = ref
      }}
      style={[s.pv4]}
      onEnd={this.onEnd}                      // Callback when playback finishes
      onError={this.videoError}           // Callback when video cannot be loaded
      videoStyle={[styles.backgroundVideo]}
      toggleResizeModeOnFullscreen={false}
      fullscreen={true}
      resizeMode="contain" // cover iphone X overstretched 
      fullscreenOrientation="portrait"
      seekColor={'#FFD926'}
      controls={false}
      disableFullscreen={true}
      disableVolume={true}
      onBack={()=>props.navigation.goBack()}
      onEnd={()=>props.navigation.goBack()} // should play next video
    />
  )
}

const ArticleMaterial = (props) => {
  const { name, content } = props.content;
  
  return (
    <V>
      <Header
        containerStyle={{ height: 80}}
        backgroundColor='#ffffff'
        centerComponent={{ text: name, style: { color: '#FFD926' } }}
        leftComponent={<CloseBtn navigation={props.navigation} />}
      />
      <ScrollView>
        <V style={[s.pa2, {marginBottom: 80}]}>
          <HTML
            html={content}
            imagesMaxWidth={Dimensions.get('window').width - 20}
            onLinkPress={(event, href)=>{
              Linking.openURL(href)
            }}
          />
        </V>
      </ScrollView>
    </V>
  )
}

const SlideMaterial = (props) => {
  const { name, content } = props.content;
  const temp_iframe = `<iframe src="http://www.slideshare.net/slideshow/embed_code/key/oHACjRw8kOBRqr" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px;" allowfullscreen=""></iframe>
  `
  const CONTENT_WINDOW_WIDTH = Dimensions.get('window').width - 10
  const CONTENT_WINDOW_HEIGHT = Dimensions.get('window').height - 80

  return (
    <V style={[{backgroundColor: 'black'}]}>
      <Header
        containerStyle={{ height: 80}}
        backgroundColor='#000000'
        centerComponent={{ text: name, style: { color: '#ffd926' } }}
        leftComponent={<CloseBtn navigation={props.navigation} />}
      />
      <V style={[s.jcc, s.pa2, {flex: 0, backgroundColor: '#000000', height: CONTENT_WINDOW_HEIGHT}]}>
        <HTML
          html={temp_iframe}
          // imagesMaxWidth={Dimensions.get('window').width}
          staticContentMaxWidth={CONTENT_WINDOW_WIDTH}
          containerStyle={[{height: 400, width: CONTENT_WINDOW_WIDTH, backgroundColor: 'black'}]}
          //debug={true}
          scalesPageToFit={(Platform.OS === 'ios') ? false : true}
        />
      </V>
    </V>
  )
}

class LearnContentScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    // title: `${navigation.state.params.event.title}`,
    header: null
  });

  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      loading: true
    };
  }

  componentDidMount(){
    const chapterID = this.props.navigation.getParam('chapterID', 'NO-ID');
    if (chapterID !== 'NO-ID') {
      this.props.reqContent(chapterID, () => {
        this.setState({
          loading: false
        })
      })
    } else {
      this.props.navigation.goBack();
    }
  }

  renderType(type) {
    switch (type) {
      case 1:
        return <ArticleMaterial {...this.props} navigation={this.props.navigation} lang={this.props.lang}/>;
      case 2:
        return <VideoMaterial {...this.props} navigation={this.props.navigation} lang={this.props.lang}/>;
      case 3:
        return <SlideMaterial {...this.props} navigation={this.props.navigation} lang={this.props.lang}/>;
      default:
        return <SafeAreaView><T>Error! Empty Content</T></SafeAreaView>
    } 
  }

  render() {
    const { lang } = this.props;
    const { type } = this.props.content;
    const { loading } = this.state;
    
    return (
      <V style={[s.flx_i]}>
        {loading
          ? <V style={[s.flx_i, s.jcc, s.aifc]}>
              <ActivityIndicator size="large" color="#ffd926" />
            </V>
          : this.renderType(type)}
      </V>
    );
  }
}
// s.jcc, s.aic, s.ba, s.ma1, {width: 70, height: 70}, s.br2
const styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default (LearnContent = connect(
  (state, props) => ({
    lang: state.app.lang,
    content: state.course.content
  }),
  (dispatch, props) => ({
    reqContent:(chapterID, cb) => dispatch(courseActions.reqContent(chapterID, cb))
  })
)(LearnContentScreen));
