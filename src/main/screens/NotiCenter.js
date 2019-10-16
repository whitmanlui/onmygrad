import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View as V, StyleSheet, ScrollView, TextInput, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Text as T, Button } from '@screens/SharedComponent/OnMyGradComponent'
import { styles as s } from 'react-native-style-tachyons'
import _ from 'lodash'
import { BackBtn } from '@screens/SharedComponent/IconBtn'
import { ListItem } from 'react-native-elements'
import moment from 'moment'
import { CustomIcon } from '@screens/SharedComponent/CustomIcon';

class NotiCenterScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    headerLeft: <BackBtn navigation={navigation} />,
    title: "通知中心",
    /* headerRight: <Button
        title={'全部已讀'} type={'OnMyGrad_re'} containerStyle={{paddingRight: 15}}
        onPress={()=>{navigation.state.params.clearTxt()}}
    />, */
    headerStyle: { borderBottomWidth: 0, elevation: 0, shadowOpacity: 0 }
  })
  constructor(props) {
    super(props)
    this.state = { text: "" }
  }
  componentWillMount() {
    this.props.navigation.setParams({ clearTxt: () => this.setState({ text: "" }) })
  }

  _renderItem = ({ item }) => {
    return (
      //<TouchableOpacity onPress={() => console.log(item)}>
        <ListItem
          containerStyle={[s.br3, s.ma2]}
          //leftAvatar={{ source: { uri: l.avatar_url } }}
          leftIcon={{ name: item.icon, type: 'font-awesome' }}
          title={<T type="title">{item.title}</T>}
          subtitle={<T type="normal">{item.message}</T>}
          rightSubtitle={<T type="normal">{moment.unix(item.created_time).fromNow()}</T>}
        />
      //</TouchableOpacity>
    );
  }
  render() {
    const { lang, notification } = this.props
    return (<V style={[s.flx_i, {backgroundColor: '#f6f6f6', height: '100%'}]}>
      {notification.length==0?<V style={[s.flx_i, s.jcc, s.aic, {backgroundColor: '#f6f6f6', height: '100%'}]}>
				<V style={[s.mb3, s.jcc, s.aic,  {
					borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
					width: Dimensions.get('window').width * 0.5,
					height: Dimensions.get('window').width * 0.5,
					backgroundColor: '#ffffff'
				}]}>
					<CustomIcon name="Notification" style={[{fontSize: 120, color: '#ffd926'}]} ></CustomIcon>
				</V>
				<T type={"title"}>{LANG[lang].no_notification}</T>
			</V> : <FlatList
        data={notification}
        extraData={this.props.data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={this._renderItem}
      />}
    </V>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 5,
    marginBottom: 5,
    paddingTop: 5,
    paddingBottom: 5,
  }
})

export default NotiCenter = connect(
  (state, props) => ({
    lang: state.app.lang,
    notification: state.me.notification
  }),
  (dispatch, props) => ({

  }),
)(NotiCenterScreen)

