import React, { Component } from 'react'
import { View as V, Text as T, TouchableWithoutFeedback} from 'react-native'
import { connect } from 'react-redux';
import { styles as s } from 'react-native-style-tachyons'
import { Header, ButtonGroup } from 'react-native-elements'

export const LeftComponent = (props) => {
  return <ButtonGroup
        onPress={(selectedIndex) => props.onPress(selectedIndex)}
        selectedIndex={props.selectedIndex}
        buttons={props.buttons}
        Component={TouchableWithoutFeedback}
        innerBorderStyle={{ width: 0 }}
        containerStyle={{ borderWidth: 0, borderRadius: 0, backgroundColor: "transparent", marginLeft: 0 }}
        selectedButtonStyle={[{ borderBottomColor: "#ffd926", borderBottomWidth: 4, backgroundColor: "#ffffff" }]}
        selectedTextStyle={[s.b, { fontSize: 14, color: "#ffd926" }]}
        textStyle={[{ fontSize: 12 }]}
    />
}

/*
leftComponent={<ButtonGroup
          onPress={(selectedIndex)=>this.showPage(selectedIndex)}
          selectedIndex={this.state.page}
          buttons={[LANG[this.props.lang].me, LANG[this.props.lang].hots]}
          Component={TouchableWithoutFeedback}
          innerBorderStyle={{width: 0}}
          containerStyle={{borderWidth:0, borderRadius: 0, backgroundColor: "transparent", marginLeft: 0}}
          selectedButtonStyle={[{borderBottomColor: "#ffd926", borderBottomWidth: 4, backgroundColor: "#ffffff"}]}
          selectedTextStyle={[s.b, {fontSize: 14,  color: "#ffd926"}]}
          textStyle={[{fontSize: 12}]}
        />}*/