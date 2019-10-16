import React, { Component } from 'react'
import { View as V, Text as T, TouchableWithoutFeedback} from 'react-native'
import { connect } from 'react-redux';
import { styles as s } from 'react-native-style-tachyons'
import styles from '@lib/styles'
import { CustomIcon } from '@screens/SharedComponent/CustomIcon';

export const SearchBtn = (props) => {
  return <TouchableWithoutFeedback onPress={()=>props.navigate("Search",{})}>
        <V style={[s.jcc, s.aic]}>
          <CustomIcon name="Search" style={[{fontSize: 20,color: '#000000'}]} ></CustomIcon>
        </V>
      </TouchableWithoutFeedback>
}

export const NotificationBtn = (props) => {
  return <TouchableWithoutFeedback  onPress={()=>props.navigate("NotiCenter")}>
        <V style={[s.jcc, s.aic, s.ml3]}>
          <CustomIcon name="Notification" style={[{fontSize: 20,color: '#000000'}]} ></CustomIcon>
        </V>
      </TouchableWithoutFeedback>
}

export const MoreBtn = (props) => {
  return <TouchableWithoutFeedback  onPress={()=>props.navigate("Hots")}>
        <V style={[s.jcc, s.aic, s.ml3]}>
          <CustomIcon name="more" style={[{fontSize: 20, color: '#000000'}]} ></CustomIcon>
        </V>
      </TouchableWithoutFeedback>
}

export const More2Btn = (props) => {
  return <TouchableWithoutFeedback  onPress={()=>props.onPress()}>
        <V style={[s.jcc, s.aic, s.ml3]}>
          <CustomIcon name="more-2" style={[{fontSize: 20, color: '#000000'}]} ></CustomIcon>
        </V>
      </TouchableWithoutFeedback>
}

export const CloseBtn = (props) => {
  return <TouchableWithoutFeedback  onPress={()=>props.navigation.goBack()}>
        <V style={[s.jcc, s.aic, s.ml3]}>
          <CustomIcon name="cancel-y" style={[{fontSize: 20,color: styles.btnColor}]} ></CustomIcon>
        </V>
      </TouchableWithoutFeedback>
}

export const BackBtn = (props) => {
  return <TouchableWithoutFeedback  onPress={()=>props.navigation.goBack()}>
        <V style={[s.jcc, s.aic, s.ml3]}>
          <CustomIcon name="back" style={[{fontSize: 26,color: styles.btnColor}]} ></CustomIcon>
        </V>
      </TouchableWithoutFeedback>
}

export const FilterBtn = (props) => {
  return <TouchableWithoutFeedback  onPress={()=>props.onPress()}>
        <V style={[s.jcc, s.aic, s.ml3]}>
          <CustomIcon name="Filter" style={[{fontSize: 20, color: '#000000'}]} ></CustomIcon>
        </V>
      </TouchableWithoutFeedback>
}