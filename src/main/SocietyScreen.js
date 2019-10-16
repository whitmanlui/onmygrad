import React, { Component } from 'react';
import { SafeAreaView, View as V, Text as T, ScrollView, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { styles as s } from 'react-native-style-tachyons'

import MySociety from '@screens/MySociety';
import HotsRecommend from '@screens/HotsRecommend';
import { actions as societyActions } from '@reducer/societyReducer'
import CustomHeaderComponent from '@screens/SharedComponent/CustomHeader'

class Society extends Component {
  static navigationOptions = ({ navigation }) => {
    return ({
      headerTitle: <CustomHeaderComponent 
        {...navigation}
        onPress={(selectedIndex)=>navigation.state.params.showPage(selectedIndex)}
        selectedIndex={0}
        buttons={['hots_recommend', 'my_society']}
      />,
      headerStyle: { borderBottomWidth: 0, elevation: 0, shadowOpacity: 0 }
    })
  }
  showPage(selectedIndex){
    switch(selectedIndex){
      case 0:
        this.scroll.scrollTo({ x: 0, y: 0, animated: true })
      case 1:
        this.props.getJoinedSociety()
        this.scroll.scrollTo({ x: selectedIndex * Dimensions.get('window').width, y: 0, animated: true })
    }
  }

  constructor(props){
    super(props)
  }
  componentWillMount(){
    this.props.navigation.setParams({showPage: (selectedIndex) => this.showPage(selectedIndex)})
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
          <HotsRecommend {...this.props} />
        </V>
        <V style={[{width: Dimensions.get('window').width}, s.flx_i]}>
          <MySociety {...this.props} />
        </V>
      </ScrollView>
    </SafeAreaView>
  }
}


export default SocietyScreen = connect(
  (state, props) => ({
    lang: state.app.lang,
  }),
  (dispatch, props) => ({
    getJoinedSociety: () => dispatch(societyActions.reqJoinedSociety())
  }),
)(Society)

