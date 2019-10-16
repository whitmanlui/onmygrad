import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View as V, ScrollView, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Text as T, Button } from '@screens/SharedComponent/OnMyGradComponent'
import LANG from '@lang/lang'
import { Input, Avatar } from 'react-native-elements'
import _ from 'lodash'
import { styles as s } from 'react-native-style-tachyons'
import { actions as societyActions } from '@reducer/societyReducer'
import { BackBtn } from '@screens/SharedComponent/IconBtn'
import moment from 'moment';
import momentHK from 'moment/src/locale/zh-hk' ;
import { CustomIcon } from '@screens/SharedComponent/CustomIcon'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

const CommentBlk = (props) => {
	const { user, comment, lang, token, created_time } = props
	return <V style={[s.mv2, s.mh3, {borderBottomWidth: 1, borderBottomColor: '#f1f1f1'}]}>
		<V style={[s.flx_i, s.flx_row, s.aic]}>
			<V style={[s.flx_row, s.aic, {flex: 3}]}>
				<Avatar
					rounded
					size={15}
					source={{uri: user ? user.thumbnail : null}}
					icon={{ name: 'user', type: 'font-awesome' }}
				/>
				<V style={[s.mh2, s.mv1]}>
					<T type={'normal'}>{user.name}</T>
				</V>
			</V>
			<V style={[s.flx_i, s.aife]}>
				<T>{moment.unix(created_time).utcOffset(8).format('D/M/YYYY')}</T>
			</V>
		</V>
		<V style={[s.mt1, s.mb2]}>
			<T type={'normal'}>{comment}</T>
		</V>
	</V>
}

class SocietyDetailScreen extends Component {
	static navigationOptions = ({ navigation }) => ({
		headerLeft: <BackBtn navigation={navigation} />,
		title: navigation.state.params && navigation.state.params.name,
		loading: true
	})
	constructor(props) {
		super(props)
		this.state = { detail: {}, comment: ""}
	}
	componentDidMount() {
		this.props.getSocietyDetail(this.props.navigation.state.params.id, (result)=>{
			this.setState({detail: result})
		})
		this.props.getSocietyComment(this.props.navigation.state.params.id, (result)=>{
			this.setState({
				loading: false
			})
		})
	}

	render() {
		const { lang, token } = this.props
		const { id, name, thumbnail, tag_list, headline, status, joined_user, liked_user, comment_count  } = this.props.navigation.state.params
		const { loading } = this.state

		return (<ScrollView style={{backgroundColor: '#f6f6f6', height:'100%'}}>
			<V style={[{ flex: 1, backgroundColor: '#ffffff' }]}>
				<V style={{ backgroundColor: '#f3f3f3', position: 'absolute', width: '100%', height: 130 }}></V>
				<V style={[s.aic]}>
					<V style={{height: 50}}/> 
					<V style={[s.pa2, s.aic, s.mb2]}>
						<Avatar size={120} rounded 
							source={{
								uri: thumbnail
							}}
							containerStyle={[{borderColor: '#ffffff', borderWidth:2}]}
						 />
						<V style={[s.mb2, s.aic]}>
							<T style={[s.b]} type={'title'}>{name}</T>
							<V style={[s.flx_row, s.mv2]}>
								{_.map(tag_list, (v, i) => {
									return <V key={`tag${i}`} style={[{ backgroundColor: '#f1f1f1' }, s.br5, s.ph2, s.mr1]}><T>{v}</T></V>
								})}
							</V>
							<V style={[s.flx_row, s.mb3, s.ph4]}>
								<T style={[{textAlign: 'center'}]}>{headline}</T>
							</V>
							{this.state.detail.joined?<Button
								type={"OnMyGrad"}
								title={`${LANG[lang].leave_circle}`}
								containerStyle={[s.ph2]}
								onPress={() => {
									token.token ? Alert.alert(`${LANG[lang].confirm_leave_circle}`, "", [
										{
											text: `${LANG[lang].cancel}`,
											style: 'cancel',
										},
										{text: `${LANG[lang].ok}`, onPress: () => this.props.leaveCircle(id, ()=>{
											this.props.getSocietyDetail(this.props.navigation.state.params.id, (result)=>{
												this.setState({detail: result})
											})
										})}
									], { cancelable: false}) : this.props.navigation.navigate('Login');
								}}
							/>:
							<Button
								type={"OnMyGrad"}
								title={`${LANG[lang].apply_join}`}
								containerStyle={[s.ph2]}
								onPress={() => {
									token.token ? this.props.joinCircle(id, ()=>{
										this.props.getSocietyDetail(this.props.navigation.state.params.id, (result)=>{
											this.setState({detail: result})
										})
									}) : this.props.navigation.navigate('Login');
								}}
							/>}
						</V>
						<V style={[s.flx_row, s.mt2]}>
							<V style={[s.flx_i, s.jcc, s.aic]}>
								<T>{joined_user}</T>
								<T>{`${LANG[lang].joined_count}`}</T>
							</V>
							<V style={[s.flx_i, s.jcc, s.aic]}>
								<T>{'0'}</T>
								<T>{`${LANG[lang].active_ranking}`}</T>
							</V>
							{/* <V style={[s.flx_i, s.jcc, s.aic]}>
								<T>{'0'}</T>
								<T>{`${LANG[lang].top_activity}`}</T>
							</V> */}
						</V>
					</V>
				</V>
			</V>
			{/* <V style={[s.flx_i, s.mt2, {backgroundColor: '#ffffff' }]}>
				<V style={[s.pa2, s.flx_i, s.flx_row, s.aic]}>
					<Avatar size="medium" rounded source={{
						uri: thumbnail
					}} />
					<T style={[s.b, s.ml2]} type={'title'}>{name}</T>
				</V>
			</V> */}
			<V style={[s.flx_row, s.aic, s.pb1, s.pt3, s.pl2]}><T style={[s.flx_i]}>{LANG[lang].society_comment}</T></V>
			<V style={[s.mt2, {backgroundColor: '#ffffff'}]}>
			{!_.isEmpty(token)
				? (this.state.detail.joined)
						? <V style={[s.flx_row, s.pa2, s.aic, {borderBottomWidth: 1, borderBottomColor: '#f1f1f1'}]}>
								<V style={[s.flx_i]} >
									<Input 
										underlineColorAndroid={'rgba(0,0,0,0)'}
										placeholder={LANG[lang].comment} 
										containerStyle={[s.br5, {backgroundColor: '#f6f6f6'}]}
										inputContainerStyle={{ borderBottomWidth: 0 }}
										onChangeText={(txt)=>this.setState({comment: txt})} 
										value={this.state.comment}
										maxLength={50}
									/>
								</V>
								<TouchableOpacity onPress={()=>{ 
									if(this.state.comment) this.props.addComment(id, this.state.comment, ()=>{
										this.setState({comment: ""})
										this.props.getSocietyDetail(this.props.navigation.state.params.id, (result)=>{
											console.log("detail", result)
											this.setState({detail: result})
										})
									})
								}}>
									<V style={[s.mv1, s.mh2]} ><FontAwesome name='send' size={20} color={"#ffd926"} /></V>
									<V style={[s.ph1, s.aic, s.jcc, {width: 45}]}><T>{`${this.state.comment.length}/50`}</T></V>
								</TouchableOpacity>
							</V>
						: <V style={[s.aic, s.jcc, s.pv2, {width: '100%'}]}><T>{LANG[lang].please_join_to_comment}</T></V>
				:<V style={[s.aic, s.jcc, s.pv2, {width: '100%'}]}><T>{LANG[lang].please_login_to_comment}</T></V>}
				{ loading
				? <V style={[s.flx_i, s.jcc, s.aifc]}>
						<ActivityIndicator size="large" color="#ffd926" />
						<T type={'normal'}>{LANG[lang].not_yet_have_comment}</T>
					</V>
				: <FlatList
					data={_.orderBy(this.state.detail.comment,['created_time'],['desc'])}
					keyExtractor={(item, index) => index.toString()}
					renderItem={({item, index}) => {
						//push your code
						return <CommentBlk {...item} navigation={this.props.navigation} lang={lang} token={token}/>
					}}
					/>
				}
			</V>
		</ScrollView>
		);
	}
}

const styles = StyleSheet.create({

})


export default SocietyDetail = connect(
	(state, props) => ({
		token: state.auth.token,
		lang: state.app.lang,
		joinedSociety: state.society.joinedSociety
	}),
	(dispatch, props) => ({
		getSocietyDetail: (societyId, cb) => dispatch(societyActions.reqSocietyDetail(societyId, cb)),
		joinCircle:(circle_id, cb)=>dispatch(societyActions.reqSocietyActions("join", circle_id, cb)),
		leaveCircle:(circle_id, cb)=>dispatch(societyActions.reqSocietyActions("leave", circle_id, cb)),
		getSocietyComment:(circle_id, cb)=>dispatch(societyActions.reqSocietyComment(circle_id, cb)),
		addComment: (circle_id, comment, cb)=>dispatch(societyActions.reqSocietyCommentActions("add", circle_id, comment, undefined, cb))
	}),
)(SocietyDetailScreen)
