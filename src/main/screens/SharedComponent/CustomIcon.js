import React from 'react'
import {connect} from 'react-redux'
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
//import icoMoonConfig from '../../../../android/app/src/selection.json';
import icoMoonConfig from '../../../res/assets/selection.json';
const Icon_customize = createIconSetFromIcoMoon(icoMoonConfig);

class Icon extends React.Component {
    render(){
      return <Icon_customize {...this.props }></Icon_customize>
    }
  }


export const CustomIcon = connect(
    (state, props) => ({
    }),
    (dispatch, props) => ({
    }),
  )(Icon)