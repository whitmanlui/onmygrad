import React, { Component } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
// Components
import StoryDayItem from './storyDayItemView';

class StoryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollPosition: 0
    };
  }

  _handleScroll = event => {
    this.setState({ scrollPosition: event.nativeEvent.contentOffset.x });
    // console.log(this.state.scrollPosition);
  };

  render() {
    const {
      stories,
      handleStoryItemPress,
      unPressedBorderColor,
      pressedBorderColor,
      firstIndex
    } = this.props;

    const { scrollPosition } = this.state;
    return (
      <View styles={[styles.container]}>
        <FlatList
          // onScroll={this._handleScroll}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          data={stories}
          horizontal
          maxToRenderPerBatch={8}
          initialNumToRender={8}
          windowSize={11}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item, index }) => (
            <StoryDayItem
              handleStoryItemPress={() =>
                handleStoryItemPress && handleStoryItemPress(item, index)
              }
              // head={(firstIndex.indexOf(index) !== -1)}
              firstIndex={firstIndex}
              checkindex={index}
              unPressedBorderColor={unPressedBorderColor}
              pressedBorderColor={pressedBorderColor}
              scrollPosition={scrollPosition}
              item={item}
            />
          )}
        />
      </View>
    );
  }
}

export default StoryList;

const styles = StyleSheet.create({
  container: {
    //flex: 1
  }
});

