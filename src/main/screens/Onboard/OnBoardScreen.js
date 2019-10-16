import React, { Component } from 'react';
import { SafeAreaView, View as V, Text as T, ScrollView, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { Header, ButtonGroup } from 'react-native-elements'
import { styles as s } from 'react-native-style-tachyons'
import _ from 'lodash'
class OnBoard extends Component {
  screenWidth = Dimensions.get('window').width
  screenHeight = Dimensions.get('window').height
  constructor(props){
    super(props)
    console.log(props)
    this.state = { page: 0 }
  }
  componentDidMount(){
  }
  showPage(selectedIndex){
    switch(selectedIndex){
      case 0:
        this.scroll.scrollTo({ x: 0, y: 0, animated: true })
      case 1:
        this.scroll.scrollTo({ x: selectedIndex * this.screenWidth, y: 0, animated: true })
    }
    /*this.setState({page: selectedIndex}, ()=>{
      
    })*/

  }
  render(){
    
    return <SafeAreaView>
      <Header
        containerStyle={{paddingTop: 0, paddingBottom: 0, height :50, backgroundColor: "white"}}
        leftComponent={<ButtonGroup
          onPress={(selectedIndex)=>this.showPage(selectedIndex)}
          selectedIndex={this.state.page}
          buttons={["HOT", "NEWS"]}
          Component={TouchableWithoutFeedback}
          innerBorderStyle={{width: 0}}
          containerStyle={{width: 100, borderWidth:0, borderRadius: 0, backgroundColor: "transparent", marginLeft: 0,}}
          selectedButtonStyle={[{borderBottomColor: "#ffd926", borderBottomWidth: 4, backgroundColor: "#ffffff"}, s.b]}
          selectedTextStyle={[{fontSize: 14,  color: "#ffd926"}]}
          textStyle={[s.tc, {fontSize: 12}]}
        />}
        rightComponent={{ icon: 'home', color: '#fff' }}
      />
      <ScrollView
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        ref={(node) => this.scroll = node}
        onScroll={(event)=>this.setState({page: _.round(event.nativeEvent.contentOffset.x / this.screenWidth) })}
        scrollEventThrottle={16}
      >
        <V style={{width: this.screenWidth, height: this.screenHeight}}>
          <V><T>page1</T></V>
        </V>
        <V style={{width: this.screenWidth, height: this.screenHeight}}>
          <V><T>page2</T></V>
        </V>
      </ScrollView>
    </SafeAreaView>
  }
}


export default OnBoardScreen = connect(
  (state, props) => ({
  }),
  (dispatch, props) => ({
  }),
)(OnBoard)

