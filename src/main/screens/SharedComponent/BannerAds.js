import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View as V,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  Linking
} from 'react-native';
import Carousel, { ParallaxImage, Pagination } from 'react-native-snap-carousel';
import { styles as s } from 'react-native-style-tachyons';
import _ from 'lodash';
import { Image } from 'react-native-elements';
import LANG from '@lang/lang';

const ITEM_WIDTH = Dimensions.get('window').width;
const ITEM_HEIGHT = Dimensions.get('window').height * 0.2;

class BannerAds extends Component {
  constructor(props) {
		super(props)
	}
  _renderItem = ({item, index}) => {
    return(
        <TouchableWithoutFeedback
          onPress={ () => {
            switch (item.type) {
              case 'event':
                this.props.navigation.navigate('Event', { eventID: item.id })
                break;
              case 'course':
                this.props.navigation.navigate('Course', { courseID: item.id });
                break;
              case 'link':
                Linking.canOpenURL(item.link)
                .then((supported) => {
                  if (!supported) {
                    console.log("Can't handle url: " + item.link);
                  } else {
                    return Linking.openURL(item.link);
                  }
                })
                .catch((err) => console.error('An error occurred', err));
                break;
              default:
                return
            }
          }
        }
        >
          <V style={[s.flx_i]}>
            <Image
              source={{ uri: item.image}}
              style={{width: ITEM_WIDTH, height: ITEM_HEIGHT, resizeMode: 'cover'}}
            />
          </V>
        </TouchableWithoutFeedback>
    )
  }
  render() {
    const { ads } = this.props;
    return (
          <V style={[s.flx_i, {height: (ads.length > 0) ? ITEM_HEIGHT : 0}]}>
            <Carousel
              ref={(c) => { this._carousel = c; }}
              data={ads}
              renderItem={this._renderItem}
              sliderWidth={ITEM_WIDTH}
              itemWidth={ITEM_WIDTH}
              loop={true}
              autoplay={true}
              enableMomentum={false}
              lockScrollWhileSnapping={true}
              autoplayDelay={2000}
              autoplayInterval={5000}
              activeAnimationType={'decay'}
              inactiveSlideScale={1}
            />
          </V>
    )
  }
}

export default BannerAds = connect(
	(state, props) => ({
		ads: state.app.ads,
	}),
	(dispatch, props) => ({
	}),
)(BannerAds)
