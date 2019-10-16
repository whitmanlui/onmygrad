import React, { Component } from 'react';
import { StyleSheet, Dimensions, Text, Platform, YellowBox } from 'react-native';
import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga'
import { Provider } from 'react-redux';
import logger from 'redux-logger';
import rootReducer from './src/library/redux/rootReducer';
import MainNavigator from './src/library/MainNavigator';
import rootSagas from '@reducer/rootSagas'
import NativeTachyons from 'react-native-style-tachyons';
import {requestPermission, createNotificationListeners} from '@lib/push/FirebasePushNotification'

const sagaMiddleware = createSagaMiddleware()
const store = __DEV__ ? createStore(rootReducer, applyMiddleware(sagaMiddleware, logger)) : createStore(rootReducer, applyMiddleware(sagaMiddleware))
rootSagas.forEach(s => sagaMiddleware.run(s))
if(!__DEV__) console.log=()=>{}
NativeTachyons.build({
  /* REM parameter is optional, default is 16 */
  rem: Dimensions.get('window').width > 340 ? 18 : 16,
  /* fontRem parameter is optional to allow adjustment in font-scaling. default falls back to rem */
  fontRem: 20
}, StyleSheet);

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

YellowBox.ignoreWarnings([
  'Require cycle:',
]);

export default class App extends Component {
  componentDidMount(){
    requestPermission()
  } 
  render() {
    return (
      <Provider store={store}>
        <MainNavigator />
      </Provider>
    );
  }
}
