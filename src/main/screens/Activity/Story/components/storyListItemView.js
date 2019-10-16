import React, { Component } from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';

// Constants
class StoryListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPressed: false,
    };
  }

  // Component Life Cycles

  // Component Functions
  _handleItemPress = item => {
    const { handleStoryItemPress } = this.props;
    if (handleStoryItemPress) handleStoryItemPress(item);
    this.setState({ isPressed: true });
  };

  render() {
    const { item, unPressedBorderColor, pressedBorderColor } = this.props;
    const { isPressed } = this.state;

    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => this._handleItemPress(item)}
          style={[
            styles.avatarWrapper,
            !isPressed
              ? {
                  borderColor: unPressedBorderColor
                    ? unPressedBorderColor
                    : '#ffd926',
                }
              : {
                  borderColor: pressedBorderColor
                    ? pressedBorderColor
                    : '#ebebeb',
                },
          ]}
        >
          <Image
            style={styles.avatar}
            source={{uri: item.company.thumbnail}}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

export default StoryListItem;

const styles = StyleSheet.create({
  container: {
    marginVertical: 1,
  },
  unPressedAvatar: {
    borderColor: '#FFD926',
  },
  pressedAvatar: {
    borderColor: '#ebebeb',
  },
  avatarWrapper: {
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#FFD926',
    margin: 8,
    borderRadius: 57 / 2,
    height: 57,
    width: 57,
  },
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 50 / 2,
    borderColor: 'white',
    borderWidth: 1,
  },
  itemText: {
    textAlign: 'center',
    fontSize: 9,
  },
});
