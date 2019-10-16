import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View as V, StyleSheet, SafeAreaView, Image, FlatList, TouchableOpacity, ScrollView, Platform, ActivityIndicator, Linking } from 'react-native';
import { Text as T, Button, LinearBtn } from '@screens/SharedComponent/OnMyGradComponent'
import { styles as s } from 'react-native-style-tachyons'
import _ from 'lodash'
import { CloseBtn } from '@screens/SharedComponent/IconBtn'
import LANG from '@lang/lang'
import FloatingInput from '@screens/SharedComponent/FloatingInput'
import { CheckBox } from 'react-native-elements'

import { actions as authActions } from '@reducer/authReducer'

class LoginScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    headerLeft: <CloseBtn navigation={navigation} />,
    headerStyle: { borderBottomWidth: 0, elevation: 0, shadowOpacity: 0 }
  })
  constructor(props) {
    super(props)
    this.state = { email: "", password: "", error: false, autoLogin: false, loading: false}
  }

  render() {
    const { lang } = this.props
    return (<SafeAreaView style={[s.flx_i, s.jcc, s.aic, s.mh4]}>
      <V style={[s.absolute, s.flx_row, {top: 15, width: '100%', alignItems: 'center',justifyContent: 'center'}]}>
        <V style={[s.jcfe, {flex: 2}]}>
          <T type='title' style={[styles.title]}>{LANG[lang].login}</T>
        </V>
        <V style={[s.flx_i, s.jcfe]}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('SignupChat')}>
            <T style={[styles.register, {letterSpacing: 1}]}>{LANG[lang].register_ac}</T>
          </TouchableOpacity>
        </V>
      </V>
        <V style={[{ width: '100%' }, s.mb5, s.aic, s.jcc]}>
          <Image
            resizeMode={'contain'}
            style={{ height: 150, width: 150 }}
            source={require('../../res/assets/logo.png')} />
        </V>
        <V style={[{ width: '100%' }, s.mb2]}>
          <FloatingInput
            style={[]}
            label={LANG[lang].email}
            value={this.state.email}
            onChangeText={(email) => this.setState({ email })}
          />
        </V>
        <V style={[{ width: '100%' }, s.mv2]}>
          <FloatingInput
            secureTextEntry
            label={LANG[lang].password}
            value={this.state.password}
            onChangeText={(password) => this.setState({ password })}
          />
        </V>
        <V style={[{ width: '100%' }]}>
          {this.state.error?<T style={[{color:'red'}]}>{'帳戶或密碼錯誤'}</T>:<T>{''}</T>}
        </V>
        <V style={[{ width: '100%' }]}>
          <CheckBox
            containerStyle={[{ padding: 0, marginLeft: 0, borderWidth: 0, backgroundColor: 'transparent' }]}
            title={LANG[lang].keep_signin}
            checkedIcon='dot-circle-o'
            uncheckedIcon='circle-o'
            checkedColor={'#ffd926'}
            checked={this.state.autoLogin}
            onPress={() => this.setState({ autoLogin: !this.state.autoLogin })}
          />
        </V>
        <V style={[{ width: '100%' }, s.mt4, s.aic]}>
          <LinearBtn title={LANG[lang].sign_in}
            containerStyle={[{ width: '80%' }, s.mb2]}
            onPress={() => {
              this.setState({loading:true})
              this.props.login(this.state.email, this.state.password, this.state.autoLogin, (result, appIntro) => {
                if (result){
                  this.setState({loading: false})
                  this.props.navigation.goBack()
                  if(!appIntro){
                    this.props.navigation.navigate('SignupImage')
                  }
                }
                else
                  this.setState({
                    error: true,
                    loading: false
                  })
              }
            )}
            }
          />
        </V>

        <V style={[{ width: '100%' }, s.jcc, s.aic]}>
          <TouchableOpacity onPress={() => {
            Linking.canOpenURL('https://onmygrad.com/app-webview/forget-password.html').then(supported => {
              if (supported) 
                Linking.openURL('https://onmygrad.com/app-webview/forget-password.html');
            });
            }
          }>
            <T>{LANG[lang].forget_password}</T>
          </TouchableOpacity>
        </V>
        { this.state.loading && <V style={[s.absolute, s.jcc, s.aifc,{backgroundColor: 'rgba(102, 102, 102, 0.8)', width: 100, height: 100, margin: 'auto', top: 240, borderRadius: 4}]}>
              <ActivityIndicator size="large" color="#ffd926" />
            </V>
        }
    </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  title: { fontSize: 24, lineHeight: 28, letterSpacing: 5, fontFamily: Platform.OS == 'ios' ? `Noto Sans TC Bold` : `NotoSansTC-Bold`},
  register: { color: '#808080', fontSize: 16, lineHeight: 18, letterSpacing: 5, textAlign: 'right'},
  searchInput: { borderBottomWidth: 1, borderBottomColor: '#ececec', padding: 15, fontSize: 16, color: '#000000' },
  result: { borderBottomWidth: 1, borderBottomColor: '#ececec', marginLeft: 15, marginRight: 15, paddingTop: 15, paddingBottom: 15 }
})

export default Login = connect(
  (state, props) => ({
    lang: state.app.lang,
  }),
  (dispatch, props) => ({
    login: (email, password, autoLogin, cb) => dispatch(authActions.reqLogin(email, password, autoLogin, cb))
  }),
)(LoginScreen)

