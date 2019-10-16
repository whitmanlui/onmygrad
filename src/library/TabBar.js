import React, { Component } from 'react'
import { View as V, Text as T, StyleSheet } from 'react-native'
import { connect } from 'react-redux';
import LANG from '@lang/lang'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Entypo from 'react-native-vector-icons/Entypo'

class TabBarCom extends Component {

  render() {
    const { index, lang, color } = this.props
    switch(index){
        case 0:
            return ( <V style={ style.container }><FontAwesome name='lightbulb-o' size={22} color={color} />
                <T style={{color: this.props.color, fontSize: 12}}>{LANG[lang].question}</T></V>)
        case 1:
            return ( <V style={ style.container }><Entypo name='infinity' size={22} color={color} />
                <T style={{color: this.props.color, fontSize: 12}}>{LANG[lang].society}</T></V>)
        case 2:
            return ( <V style={ style.container }><FontAwesome name='flag-o' size={22} color={color} />
                <T style={{color: this.props.color, fontSize: 12}}>{LANG[lang].opportunity}</T></V>)
        case 3:
            return ( <V style={ style.container }><FontAwesome name='user' size={22} color={color} />
                <T style={{color: this.props.color, fontSize: 12}}>{LANG[lang].me}</T></V>)
    }   
  }

}

const style = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
        justifyContent: 'center'
	},
})

export default TabBar = connect(
    (state, props) => ({
      lang: state.app.lang,
    }),
    (dispatch, props) => ({
    }),
  )(TabBarCom)
  