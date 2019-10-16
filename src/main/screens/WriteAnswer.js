import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View as V, StyleSheet, SafeAreaView, Image, FlatList, TouchableOpacity} from 'react-native';
import { Text as T, Button } from '@screens/SharedComponent/OnMyGradComponent'
import { styles as s } from 'react-native-style-tachyons'
import _ from 'lodash'
import { CloseBtn } from '@screens/SharedComponent/IconBtn'
import LANG from '@lang/lang'
import FloatingInput from '@screens/SharedComponent/FloatingInput'
import { CheckBox } from 'react-native-elements'
import { WebView } from 'react-native-webview';

import {actions as authActions} from '@reducer/authReducer'

class WriteAnswerScreen extends Component {

    static navigationOptions = ({ navigation }) => ({
      headerLeft: <CloseBtn navigation={navigation} />,
      title: `${navigation.state.params.actionType == 'question' ? '寫問題' : '寫答案'}`,
      headerStyle: { borderBottomWidth: 0, elevation: 0, shadowOpacity: 0 }
    })
    constructor(props){
      super(props)
    }

    render() {
      const {lang, token} = this.props
      const { actionType, question_id, title, cb } = this.props.navigation.state.params
      return (<SafeAreaView style={[s.flx_i]}>
    	  <WebView
          style={[s.flx_i]}
          source={{
            uri: `https://onmygrad.com/app-webview/qna-editor.html?id=${token.id}&token=${token.token}&type=${actionType}`,
          }}
          onError={(e)=>console.log(e)}
          scalesPageToFit={true}
          overScrollMode={"never"}
          scrollEnabled={true}
          useWebKit={false}
          onMessage={(e)=>{
            const message = JSON.parse(e.nativeEvent.data)
            this.props.navigation.navigate('Preview', {message, actionType, question_id, title, cb});
          }}
        />
      </SafeAreaView> 
      );
    }
}

const styles = StyleSheet.create({
})

export default WriteAnswer = connect(
    (state, props) => ({
			lang: state.app.lang,
			token: state.auth.token
    }),
    (dispatch, props) => ({
    }),
)(WriteAnswerScreen)

