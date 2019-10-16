import React, { PureComponent } from 'react';
import {
  View as V,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Linking,
} from 'react-native';
import { styles as s } from 'react-native-style-tachyons';
import { Button, Text as T } from '@screens/SharedComponent/OnMyGradComponent';
import { CustomIcon } from '@screens/SharedComponent/CustomIcon';
import StoryItem from './storyItemView';
// import { TouchableWithoutFeedback } from 'react-native-gesture-handler

const { width, height } = Dimensions.get('window');
const perspective = width;
const angle = Math.atan(perspective / (width / 2));
const ratio = Platform.OS === 'ios' ? 2 : 1.2;
const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;
export default class Stories extends PureComponent {
  stories = [];

  state = {
    x: new Animated.Value(0),
    ready: false,
  };

  constructor(props) {
    super(props);
    this.stories = props.stories.map(() => React.createRef());
  }

  async componentDidMount() {
    const { x } = this.state;
    await x.addListener(() =>
      this.stories.forEach((story, index) => {
        const offset = index * width;
        const inputRange = [offset - width, offset + width];
        const translateX = x
          .interpolate({
            inputRange,
            outputRange: [width , -width ],
            extrapolate: 'clamp',
          })
          .__getValue();
        const style = {
          transform: [
            { translateX },
          ],
        };
        story.current.setNativeProps({ style });
      })
    );
  }

  _handleSelectedStoryOnLoaded = () => {
    this.setState({ ready: true });
  };

  _handleScroll = (event) => {
    console.log('side')
    // this.setState({ scrollPosition: event.nativeEvent.contentOffset.x });
  };

  render() {
    const { x, ready } = this.state;
    const { stories, selectedStory, closeModal } = this.props;
    
    return (
      <V style={styles.container}>
        {!ready && (
          <V
            style={{
              flex: 1,
              zIndex: 999,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#ffffff',
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%'
            }}
          >
            <ActivityIndicator size="large" color="#FFD926" />
          </V>
        )}
        {stories
          .map((story, i) => (
            <V
              ref={this.stories[i]}
              key={story.id}
            >
              <StoryItem
                handleSelectedStoryOnLoaded={this._handleSelectedStoryOnLoaded}
                selectedStory={selectedStory}
                navigation={this.props.navigation}
                lang={this.props.lang}
                closeModal={this.props.closeModal}
                ready={ready}
                {...{ story }}
              />
            </V>
          ))
          .reverse()}
        <Animated.ScrollView
          ref={this.scroll}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          snapToInterval={width}
          contentContainerStyle={{ width: width * stories.length }}
          onScroll={Animated.event(
            [{
              nativeEvent: {
                contentOffset: { x },
              },
            }],
            { useNativeDriver: true }
          )}
          decelerationRate={0.99}
          directionalLockEnabled // ios only
          horizontal
        />
          <V style={[s.absolute, {zIndex: 999,top: 45, right: 15, width: 50, height: 50, backgroundColor: 'transparent'}]}>
            <TouchableWithoutFeedback
              onPress={() => {
                closeModal()
              }}
            >
              <V style={[s.jcc, s.aic, s.ml3]}>
                <CustomIcon name="cancel-y" style={[{fontSize: 20,color: styles.btnColor}]} ></CustomIcon>
              </V>
            </TouchableWithoutFeedback>
          </V>
        { ready &&
          <V style={[styles.applyButton]}>
            <Button
              title={`Apply Now`}
              type={'OnMyGrad'}
              style={{width: 80}}
              onPress={() => {
                const index = Math.floor(x._value/ WINDOW_WIDTH)
                const applysite = stories[index].website
                //check if have event id, yes react navigate to event id
                Linking.canOpenURL(applysite).then(supported => {
                  if (supported) 
                    Linking.openURL(applysite);
                });
                
              }}
            />
          </V>
        }
      </V>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black"
  },
  applyButton: {
    zIndex: 99999,
    position: 'absolute',
    top: WINDOW_HEIGHT - 100,
    left: (WINDOW_WIDTH - 80)/2,
    width: 80
  }
});
