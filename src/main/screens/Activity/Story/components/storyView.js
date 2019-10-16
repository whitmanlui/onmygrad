import React, { Component, Fragment } from "react";
import { View, StyleSheet, Platform, Dimensions } from "react-native";
import Modal from "react-native-modalbox";
import { styles as s } from 'react-native-style-tachyons';
import { Button, Text as T, LinearBtn } from '@screens/SharedComponent/OnMyGradComponent'

// Components
import StoryList from './storyListView';
import Stories from "./storiesView";

class Story extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      orderedStories: null,
      selectedStory: null
    };
  }

  _handleStoryItemPress = (item, index) => {
    const { stories, token } = this.props;
    if (token.token) {
      this.setState({ selectedStory: item });

      const _stories = Array.from(stories);
  
      const rest = _stories.splice(index);
      const first = _stories;
  
      const orderedStories = rest.concat(first);
  
      this.setState({ orderedStories });
      this.setState({ isModalOpen: true });
    } else {
      this.props.navigation.navigate('Login')
    }
  };

  _closeModal = () => {
    this.setState({isModalOpen: false})
  }

  render() {
    const {
      stories,
      unPressedBorderColor,
      pressedBorderColor,
      firstIndex
    } = this.props;
    const { isModalOpen, orderedStories, selectedStory } = this.state;

    return (
      <Fragment>
        <View style={[styles.storyListContainer, s.ph3, s.pv1]}>
          <StoryList
            handleStoryItemPress={this._handleStoryItemPress}
            stories={stories}
            unPressedBorderColor={unPressedBorderColor}
            pressedBorderColor={pressedBorderColor}
            firstIndex={firstIndex}
          />
        </View>
        <Modal
          style={styles.modal}
          isOpen={isModalOpen}
          onClosed={() => this.setState({ isModalOpen: false })}
          position="center"
          swipeToClose
          swipeThreshold={10}
          swipeArea={350}
          backButtonClose
          coverScreen={true}
          animationDuration={200}
        >
          <Stories
            selectedStory={selectedStory}
            stories={orderedStories}
            navigation={this.props.navigation}
            lang={this.props.lang}
            closeModal={this._closeModal}
          />
        </Modal>
      </Fragment>
    );
  }
}

export default Story;

const styles = StyleSheet.create({
  storyListContainer: {
    marginTop: 5,
  },
  modal: {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    flex: 1
  }
});
