import React, { Component } from 'react'
import { View as V, TouchableWithoutFeedback, Animated, StyleSheet } from 'react-native'
import { connect } from 'react-redux';
import { styles as s } from 'react-native-style-tachyons'
import { ButtonGroup } from 'react-native-elements'
import LANG from '@lang/lang'
import _ from 'lodash'
import { SearchBtn, NotificationBtn } from '@screens/SharedComponent/IconBtn'
import { Text as T, Button } from '@screens/SharedComponent/OnMyGradComponent'

class CustomHeader extends Component {
  state = {
    selectedIndex: new Animated.Value(0),
    track: new Animated.Value(0),
    layoutWidth: 40,
    index: 0
  }
  componentDidMount = () => {
    Animated.timing(this.state.selectedIndex, {
      duration: 300,
      toValue: this.state.track,
      useNativeDriver: true,
    }).start();
  };
  render() {
    const { lang, buttons, onPress, pushPage } = this.props
    const { selectedIndex, track, layoutWidth, index } = this.state;
    return <V style={[s.flx_row, s.mh2]}>
      <V style={[s.flx_row, s.aic, s.jcc]} onLayout={(event) => { this.setState({ layoutWidth: event.nativeEvent.layout.width / buttons.length }) }}>
        {
          buttons.map((v, i) => {
            const translateX = Animated.multiply(Animated.subtract(selectedIndex, i), layoutWidth);
            const transform = {
              transform: [{ translateX }],
            };
            return (<TouchableWithoutFeedback key={i} onPress={() => this.setState({ index: i }, () => { track.setValue(i); onPress(i) })}>
              <V style={[s.mh2]}>
                <T style={[s.mb1, index == i ? styles.selected : styles.txt, { position: "relative", zIndex: 1 }]}>{LANG[lang][v]}</T>
                <Animated.View style={[{ position: "absolute", bottom: 0, left: '50%' }, transform]}>
                  <V style={[{ zIndex: 2, position: "relative", bottom: 10, left: '-50%', backgroundColor: '#ffd926', width: 50, borderRadius: 15 }, index == i ? { height: 13 } : { height: 0 }]}></V>
                </Animated.View>
              </V>
            </TouchableWithoutFeedback>)
          })
        }
      </V>
        {pushPage ? <V /> : <V style={[s.flx_i]} />}
        {pushPage ? <V /> : <V style={[s.flx_row]}><SearchBtn {...this.props} /><NotificationBtn {...this.props} /></V>}
    </V>
  }

}

const styles = StyleSheet.create({
  selected: { fontSize: 18, color: "#000000", fontWeight: 'bold', lineHeight: 36 },
  txt: { fontSize: 14, lineHeight: 36 },
})

export default CustomHeaderComponent = connect(
  (state, props) => ({
    lang: state.app.lang,
  }),
)(CustomHeader)
