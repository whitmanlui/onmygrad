import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View as V, TouchableOpacity, StyleSheet, ScrollView, Image, FlatList } from 'react-native';
import { styles as s } from 'react-native-style-tachyons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import _ from 'lodash'
import { Card, Icon, Avatar } from 'react-native-elements'
import { Text as T, Button } from '@screens/SharedComponent/OnMyGradComponent'
import LANG from '@lang/lang'
import { actions as userActions } from '@reducer/userReducer'
import { FilterBtn, More2Btn } from '@screens/SharedComponent/IconBtn'
import { CustomIcon } from '@screens/SharedComponent/CustomIcon';

const FriendsRequestBlk = (props) => {
	const { image, name, education, requestDatetime  } = props
	return <V style={[s.flx_i, s.flx_row, s.pa2]}>
		<Avatar size="medium" rounded icon={{ name: 'user', type: 'font-awesome' }} />
		<V style={[{ borderBottomWidth: 1, borderBottomColor: '#e1e1e1' }, s.flx_i, s.flx_row, s.pb2]}>
			<V style={[s.flx_i, s.mh2]}>
				<T type={'title'} style={[s.b]}>{name}</T>
				<T numberOfLines={1} ellipsizeMode={'tail'}>{education}</T>
				<T>{requestDatetime}</T>
			</V>
			<V style={[s.flx_row, s.aic, s.jcc]}>
				<TouchableOpacity  onPress={()=>props.navigation.goBack()}>
					<V style={[s.jcc, s.aic, s.ml2]}>
						<CustomIcon name="cancel-y" style={[{fontSize: 18, color: '#e5625c'}]} ></CustomIcon>
					</V>
				</TouchableOpacity>
				<TouchableOpacity  onPress={()=>props.navigation.goBack()}>
					<V style={[s.jcc, s.aic, s.ml2]}>
						<CustomIcon name="yes" style={[{fontSize: 20,color: '#7cd422'}]} ></CustomIcon>
					</V>
				</TouchableOpacity>
			</V>
		</V>
	</V>
}

class FriendsRequestScreen extends Component {

	static navigationOptions = ({ navigation }) => ({
		title: "FriendRequest",
	})
	constructor(props) {
		super(props)
	}
	componentDidMount() {
		this.props.feedAll()
	}
	renderFriendsRequestBlk = () => {
		return (
			_.map(this.props.followingReqList, (v, i) => {
				return <FriendsRequestBlk {...v} key={i} navigation={this.props.navigation} lang={this.props.lang} />
			})
		)
	}

	render() {
		const { lang, followingReqList } = this.props
		return (<ScrollView style={[s.flx_i, { backgroundColor: '#F1F1F1' }]}>
			{this.renderFriendsRequestBlk()}
		</ScrollView>
		);
	}
}
//s.jcc, s.aic, s.ba, s.ma1, {width: 70, height: 70}, s.br2
const styles = StyleSheet.create({
})

export default FriendsRequest = connect(
	(state, props) => ({
		lang: state.app.lang,
		followingReqList: state.user.followingReqList,
	}),
	(dispatch, props) => ({
		feedAll: () => {
			dispatch(userActions.reqFolloingReqList())
		}
	}),
)(FriendsRequestScreen)
