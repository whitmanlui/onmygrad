import React, { Component } from 'react';
import { SafeAreaView, View as V, ScrollView, TouchableWithoutFeedback, Dimensions, FlatList, StyleSheet, Image, TouchableHighlight, Platform } from 'react-native';
import { connect } from 'react-redux';
import { Header } from 'react-native-elements'
import { styles as s } from 'react-native-style-tachyons'
import _ from 'lodash'
import { Avatar, Icon } from 'react-native-elements'
import { Button, Text as T } from '@screens/SharedComponent/OnMyGradComponent'
import LANG from '@lang/lang'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { actions as userActions } from '@reducer/userReducer'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { CustomIcon } from '@screens/SharedComponent/CustomIcon';

const temphistory = [
  {id: 0, type: 'question', title: '吃飯好對身體好不好？', content: '100個關注 51個回答'},
  {id: 1, type: 'answer', title: '吃飯好對身體好不好的回答', content: ' 喝湯，對很多家庭來說，是飯桌上少不了的大事。想必大家都聽過這句話：「飯前喝湯，勝過良方」。顯然，飯前喝湯似乎對身體是大有好處的。'},
  {id: 2, type: 'course', title: '身體好要食飯', content: '今天我們就總結了一些吃飯的細枝末節，但卻被忽略的事情。'},
  {id: 3, type: 'event', title: '吃飯大比賽', content: '好吃的飯，最好的比賽'},
  {id: 4, type: 'deadline', title: '吃飯管培生', content: '最好的工作，吃最多的飯'},
  {id: 5, type: 'action', title: '系統提示', content: '飯王關注了你'},
  {id: 6, type: 'action', title: '系統提示', content: '用戶米米收藏了你的回答'},
  {id: 7, type: 'question', title: '吃飯好對身體好不好？', content: '100個關注 51個回答'},
  {id: 8, type: 'answer', title: '吃飯好對身體好不好的回答', content: ' 喝湯，對很多家庭來說，是飯桌上少不了的大事。想必大家都聽過這句話：「飯前喝湯，勝過良方」。顯然，飯前喝湯似乎對身體是大有好處的。'},
  {id: 9, type: 'course', title: '身體好要食飯', content: '今天我們就總結了一些吃飯的細枝末節，但卻被忽略的事情。'},
  {id: 10, type: 'event', title: '吃飯大比賽', content: '好吃的飯，最好的比賽'},
  {id: 11, type: 'deadline', title: '吃飯管培生', content: '最好的工作，吃最多的飯'},
  {id: 12, type: 'action', title: '系統提示', content: '飯王關注了你'},
  {id: 13, type: 'action', title: '系統提示', content: '用戶米米收藏了你的回答'}
]

const HistoryBlk = (props) => {
  const { type, title, content } = props;
  const TypeIconBlk = () => {
    switch (type) {
      case 'question':
        return (<Icon style={[s.tr]} color='#919191' name={'md-help'} type={'ionicon'} />);
      case 'answer':
        return (<Icon style={[s.tr]} color='#919191' name={'md-chatboxes'} type={'ionicon'} />);
      case 'course':
        return (<Icon style={[s.tr]} color='#919191' name={'md-fitness'} type={'ionicon'} />);
      case 'event':
        return (<Icon style={[s.tr]} color='#919191' name={'md-calendar'} type={'ionicon'} />);
      case 'deadline':
        return (<Icon style={[s.tr]} color='#919191' name={'md-ice-cream'} type={'ionicon'} />);
      case 'action':
        return (<Icon style={[s.tr]} color='#919191' name={'md-planet'} type={'ionicon'} />);
      default:
        return null;
    }
  }
  return (<V style={[s.flx_i, s.flx_row, s.pa2]}>
          <V style={[{borderBottomWidth: 1, borderBottomColor: '#f3f3f3'}, s.flx_i, s.flx_row, s.pb2]}>
            <V style={[s.flx_i, s.flx_row]}>
              <V style={[s.pv2, {width: '15%'}]}>
                <TypeIconBlk/>
              </V>
              <V style={[s.flx_i, {width: '85%'}]}>
                <T style={[styles.text]} type={'title'} style={[s.b]}>{title}</T>
                <T ellipsizeMode='tail' numberOfLines={1} style={[styles.text]}>{content}</T>
              </V>
            </V>
          </V>
        </V>)
}


class PublicProfileScreen extends Component {
	screenWidth = Dimensions.get('window').width
	screenHeight = Dimensions.get('window').height + 80
	static navigationOptions = ({ navigation }) => ({
	
	})
	constructor(props) {
		super(props);
  }

  _publicItem = ({item}) => (
    <HistoryBlk
      {...item}
      id={item.id}
      navigation={this.props.navigation}
      lang={this.props.lang}
    />
  );

	render() {
		const { lang } = this.props
		return <SafeAreaView style={[{backgroundColor: '#f6f6f6'}]}>
			<ScrollView>
				<V>
					<V style={{ backgroundColor: '#ffd926', position: 'absolute', width: '100%', height: 250 }}></V>
					<V style={[{ alignItems: 'center', }]}>
						<V style={[s.pa3, s.aic, s.mb1]}>
							<Avatar rounded icon={{ name: 'user', type: 'font-awesome' }} size="large" />
							<V style={[s.mt1, s.aic]}>
								<T style={[s.b]} type={'title'}>{'Name'}</T>
							</V>
						</V>

						<V style={[{ backgroundColor: '#ffffff', width: '95%' }, s.br2, s.pa2, s.mb2]}>
							<V style={[s.flx_i, s.pa1, {backgroundColor: '#f6f6f6'}]}>
								<V style={[s.flx_row, s.mb1]}>
									<V style={[s.flx_i]}><CustomIcon name="liked" style={[{fontSize: 26, color: '#ffd926'}]} ></CustomIcon></V>
									<V style={[s.jcc, {flex: 5}]}><T>{`認證左嘅野`}</T></V>
								</V>
							</V>

              <V style={[s.flx_i, s.pv3, s.ph1]}>
                <V style={[s.flx_i, s.flx_row]}>
                  <V style={[s.flx_i, s.aic, s.jcc]}>
                    <V><T style={[styles.figures]}>{`300`}</T></V>
                    <V><T>{`關注他的人`}</T></V>
                  </V>
                  <V style={[s.asc, {width: 1, height: 25, backgroundColor: '#cdcdcd'}]}></V>
                  <V style={[s.flx_i, s.aic, s.jcc]}>
                    <V><T style={[styles.figures]}>{`300`}</T></V>
                    <V><T>{`他關注的人`}</T></V>
                  </V>
                </V>
              </V>

              <V style={[s.aic]}>
								<Button
									type={"OnMyGrad"}
									title={"關注佢"}
									containerStyle={[{ width: '60%' }, s.br5, s.mb2]}
									onPress={ () => {this.props.navigation.navigate('Quiz')} }
									//onPress={ () => {this.props.userCheckin(1)} }
								/>
							</V>

              <V style={[s.aic]}>
								<Button
									type={"OnMyGrad"}
									title={"私訊他"}
									containerStyle={[{ width: '60%' }, s.br5, s.mb2]}
									onPress={ () => {this.props.navigation.navigate('Quiz')} }
									//onPress={ () => {this.props.userCheckin(1)} }
								/>
							</V>

						</V>

						<V style={[{ width: '100%', backgroundColor: '#ffffff' }, s.ph4]}>
              <FlatList
                data={temphistory}
                renderItem={this._publicItem}
              />
						</V>

					</V>
				</V>
			</ScrollView>
		</SafeAreaView>
	}
}

const styles = StyleSheet.create({
  figures: {
    fontSize: 30,
    lineHeight: 32
  },
	shadowBtn: {
		backgroundColor: "#ffffff",
		shadowColor: "#e6e4ee",
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.46,
		shadowRadius: 6.65,
		elevation: 7,
	},
	menuBtn: { borderBottomWidth: 1, borderBottomColor: '#f3f3f3' }
})

export default PublicProfile = connect(
	(state, props) => ({
		lang: state.app.lang,
	}),
	(dispatch, props) => ({
		userCheckin: ()=>dispatch(userActions.reqUserIn()) 
	}),
)(PublicProfileScreen)

