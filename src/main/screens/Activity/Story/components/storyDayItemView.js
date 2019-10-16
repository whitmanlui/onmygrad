import React, { Component } from 'react';
import { View, Dimensions, FlatList, StyleSheet, Animated } from 'react-native';
import { Button, Text as T } from '@screens/SharedComponent/OnMyGradComponent';
import moment from 'moment';
import momentHK from 'moment/src/locale/zh-hk' ;
// Components
import StoryListItem from './storyListItemView';

// const { width } = Dimensions.get('window');

// remarks
// check if the item is the first in the same date
const Divider = () => {
  return (
    <View style={[styles.divider]}></View>
  )
}

class StoryDayItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageX : 0,
    };
  }

  handleLayoutChange() {
    this.StoryListItem.measure( (x, y, width, height, pagex, pagey) => {
      this.setState({pageX: pagex})
    });
  }

  toDate(timestamp) {
    moment.locale('zh-hk', momentHK );
    const date_timestamp = moment.unix(timestamp).utcOffset(8)
    return (`${date_timestamp.format("MMM-DD")}`)
  }
  
  render() {
    const {
      item,
      index,
      firstIndex,
      scrollPosition,
      checkindex,
      handleStoryItemPress,
      unPressedBorderColor,
      pressedBorderColor,
    } = this.props;
    const {
      pageX
    } = this.state;
    console.log(this.props)
    return (
      <View
        style={styles.container}
        // onLayout={(event) => { this.handleLayoutChange(event)}}
        ref={view => { this.StoryListItem = view; }}
        >
        <View style={styles.datecontainer}>
          {( firstIndex.indexOf(checkindex) !== -1) &&
            (
            <View>
              <T style={styles.datetext}>{this.toDate(item.application_deadline)}</T>
              <Divider />
            </View>
            )
          }
        </View>
        <StoryListItem
          handleStoryItemPress={() =>
            handleStoryItemPress && handleStoryItemPress(item, index)
          }
          unPressedBorderColor={unPressedBorderColor}
          pressedBorderColor={pressedBorderColor}
          item={item}
        />
      </View>
    );
  }
}

export default StoryDayItem;

const styles =  StyleSheet.create({
  container: {
    //flex: 1
  },
  datecontainer: {
    height: 18,
    alignItems: "center"
  },
  divider: {
    width: 35,
    height: 3,
    borderRadius: 10,
    backgroundColor: '#fdd850',
    marginTop:2,
    marginBottom:4,
    alignSelf: "center"
  },
  datetext: {
    fontSize: 12,
  }
});
