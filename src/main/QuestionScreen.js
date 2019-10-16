import React, { Component } from 'react';
import { SafeAreaView, View as V, Text as T, ScrollView, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { styles as s } from 'react-native-style-tachyons'

import Hots from '@screens/Hots';
import LatestQuestion from '@screens/LatestQuestion';

import CustomHeaderComponent from '@screens/SharedComponent/CustomHeader' 
import { actions as appActions } from '@reducer/appReducer';
class Question extends Component {  
  static navigationOptions = ({ navigation }) => {
    return ({
      headerTitle: <CustomHeaderComponent 
        {...navigation}
        onPress={(selectedIndex)=>navigation.state.params.showPage(selectedIndex)}
        selectedIndex={0}
        buttons={['hots', 'news']}
      />,
      headerStyle: { borderBottomWidth: 0, elevation: 0, shadowOpacity: 0 }
    })
  }
  showPage(selectedIndex){
    switch(selectedIndex){
      case 0:
        this.scroll.scrollTo({ x: 0, y: 0, animated: true })
      case 1:
        this.scroll.scrollTo({ x: selectedIndex * Dimensions.get('window').width, y: 0, animated: true })
    }
  }

  constructor(props){
    super(props)
  }
  componentWillMount(){
    this.props.navigation.setParams({showPage: (selectedIndex) => this.showPage(selectedIndex)})
    this.props.initApp()
    this.props.startApp()
  }
  componentDidMount(){
  }

  render(){
    return <SafeAreaView>
      <ScrollView
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        ref={(node) => this.scroll = node}
        /* onScroll={(event)=>{
          this.setState({page: _.ceil(event.nativeEvent.contentOffset.x / Dimensions.get('window').width)})
        }} */
        scrollEnabled={false}
        scrollEventThrottle={16}
      >
        <V style={[{width: Dimensions.get('window').width}, s.flx_i]}>
          <Hots {...this.props}/>
        </V>
        <V style={[{width: Dimensions.get('window').width}, s.flx_i]}>
          <LatestQuestion {...this.props}/>
        </V>
      </ScrollView>
    </SafeAreaView>
  }
}


export default QuestionScreen = connect(
  (state, props) => ({
    lang: state.app.lang,
  }),
  (dispatch, props) => ({
    initApp: ()=>dispatch(appActions.reqInitApp()),
    startApp: ()=>dispatch(appActions.reqStartApp()),
  }),
)(Question)

