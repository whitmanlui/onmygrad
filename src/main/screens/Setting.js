import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View as V, StyleSheet, ScrollView, Switch, TouchableOpacity, Linking } from 'react-native';
import { Text as T, LinearBtn } from '@screens/SharedComponent/OnMyGradComponent'
import { styles as s } from 'react-native-style-tachyons'
import _ from 'lodash'
import { Icon } from 'react-native-elements'
import { actions as authActions } from '@reducer/authReducer'

class SettingScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: "設定",
    headerStyle: { borderBottomWidth: 0, elevation: 0, shadowOpacity: 0 }
  })
  constructor(props) {
    super(props)
    this.state = {switchValue: true}
  }

  render() {
    const { lang, token } = this.props
    return (<V style={[{ backgroundColor: '#f6f6f6' }]}>
        <ScrollView style={[{height: '100%'}]}>
          <V style={[s.flx_row, s.aic, s.jcc, s.pa2, styles.menuBtn]}>
            <V style={[s.flx_i]}><T style={[{ color: '#919191' }]} type='title'>{LANG[lang].push_notification}</T></V>
            <Switch
              style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
              onValueChange = {(value)=>this.setState({switchValue: value})}
              value = {this.state.switchValue}
              onTintColor='#fdda51'
              thumbColor='white'/>
              
          </V>
          <TouchableOpacity onPress={() => this.props.navigation.navigate("ChangePw")}>
            <V style={[s.flx_row, s.aic, s.pa2, styles.menuBtn]}>
              <V style={[s.flx_i]}><T style={[{ color: '#919191' }]} type='title'>{LANG[lang].change_pw}</T></V>
              <Icon style={[s.tr]} color='#919191' name={'ios-arrow-forward'} type={'ionicon'} />
            </V>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log("notification")}>
            <V style={[s.flx_row, s.aic, s.pa2, styles.menuBtn]}>
              <V style={[s.flx_i]}><T style={[{ color: '#919191' }]} type='title'>{LANG[lang].rate_app}</T></V>
              <Icon style={[s.tr]} color='#919191' name={'ios-arrow-forward'} type={'ionicon'} />
            </V>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.navigation.navigate("SubmitFeedback")}>
            <V style={[s.flx_row, s.aic, s.pa2, styles.menuBtn]}>
              <V style={[s.flx_i]}><T style={[{ color: '#919191' }]} type='title'>{LANG[lang].report_problem}</T></V>
              <Icon style={[s.tr]} color='#919191' name={'ios-arrow-forward'} type={'ionicon'} />
            </V>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            Linking.canOpenURL('https://www.ongrad.com/privacy').then(supported => {
              if (supported) 
                Linking.openURL('https://www.ongrad.com/privacy');
            });
          }}>
            <V style={[s.flx_row, s.aic, s.pa2, styles.menuBtn]}>
              <V style={[s.flx_i]}><T style={[{ color: '#919191' }]} type='title'>{LANG[lang].tac}</T></V>
              <Icon style={[s.tr]} color='#919191' name={'ios-arrow-forward'} type={'ionicon'} />
            </V>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {Linking.canOpenURL('https://www.ongrad.com/tnc').then(supported => {
            if (supported) 
              Linking.openURL('https://www.ongrad.com/tnc');
          });}}>
            <V style={[s.flx_row, s.aic, s.pa2, styles.menuBtn]}>
              <V style={[s.flx_i]}><T style={[{ color: '#919191' }]} type='title'>{LANG[lang].contact_us}</T></V>
              <Icon style={[s.tr]} color='#919191' name={'ios-arrow-forward'} type={'ionicon'} />
            </V>
          </TouchableOpacity>
          <V style={[s.aic, s.mv4]}>
            <LinearBtn title={LANG[lang].logout}
              containerStyle={[{ width: '50%' }]}
              onPress={() => {
                this.props.logout()
                this.props.navigation.pop()
                this.props.navigation.state.params.logout()
              }} />
          </V>
        </ScrollView>
      </V>
    );
  }
}

const styles = StyleSheet.create({
  menuBtn: { borderBottomWidth: 1, borderBottomColor: '#f3f3f3' }
})

export default Setting = connect(
  (state, props) => ({
    lang: state.app.lang,
    token: state.auth.token
  }),
  (dispatch, props) => ({
    logout: ()=>dispatch(authActions.reqLogout())
  }),
)(SettingScreen)

