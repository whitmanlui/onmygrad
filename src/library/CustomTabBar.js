import React, { Component } from 'react'
import { View as V, Text as T, StyleSheet, TouchableWithoutFeedback, SafeAreaView } from 'react-native'
import { connect } from 'react-redux';
import LANG from '@lang/lang'
import { styles as s } from 'react-native-style-tachyons'
import { CustomIcon } from '@screens/SharedComponent/CustomIcon';

class CustomTabBarCom extends Component {

  render() {
    const { navigation, activeTintColor, lang, token } = this.props
    const { routes, index } = navigation.state

    return <SafeAreaView><V style={[{ height: 55 }, s.flx_row]}>
      <TouchableWithoutFeedback onPress={()=>navigation.navigate(routes[0].routeName)}>
        <V style={[s.flx_i, s.jcc, s.aic]}>
          <CustomIcon name="tabbar1-w" style={[{fontSize: 26,color: index==0?activeTintColor:'#808080'}]} ></CustomIcon>
          <T style={{ color: index==0?activeTintColor:'#808080', fontSize: 12 }}>{LANG[lang].question}</T>
        </V>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={()=>navigation.navigate(routes[1].routeName)}>
        <V style={[s.flx_i, s.jcc, s.aic]}>
          <CustomIcon name="tabbar2-w" style={[{fontSize: 26,color: index==1?activeTintColor:'#808080'}]} ></CustomIcon>
          <T style={{ color: index==1?activeTintColor:'#808080', fontSize: 12 }}>{LANG[lang].society}</T>
        </V>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={()=>token.token?navigation.navigate('WriteAnswer', {actionType: 'question'}):navigation.navigate('Login')}>
        <V style={[s.flx_i, s.jcc, s.aic]}>
          <CustomIcon name="ask-add" style={[{fontSize: 36, color: activeTintColor}]} ></CustomIcon>
        </V>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={()=>navigation.navigate(routes[2].routeName)}>
        <V style={[s.flx_i, s.jcc, s.aic]}>
          <CustomIcon name="tabbar4-w" style={[{fontSize: 26,color: index==2?activeTintColor:'#808080'}]} ></CustomIcon>
          <T style={{ color: index==2?activeTintColor:'#808080', fontSize: 12 }}>{LANG[lang].opportunity}</T>
        </V>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={()=>token.token?navigation.navigate(routes[3].routeName):navigation.navigate('Login')}>
        <V style={[s.flx_i, s.jcc, s.aic]}>
          <CustomIcon name="tabbar5-w" style={[{fontSize: 26,color: index==3?activeTintColor:'#808080'}]} ></CustomIcon>
          <T style={{ color: index==3?activeTintColor:'#808080', fontSize: 12 }}>{LANG[lang].me}</T>
        </V>
      </TouchableWithoutFeedback>
    </V></SafeAreaView>
  }

}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
})

export default CustomTabBar = connect(
  (state, props) => ({
    lang: state.app.lang,
    token: state.auth.token
  }),
  (dispatch, props) => ({
  }),
)(CustomTabBarCom)
