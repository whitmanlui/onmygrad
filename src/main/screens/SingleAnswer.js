import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View as V, TouchableWithoutFeedback, StyleSheet, ScrollView, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { styles as s } from 'react-native-style-tachyons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import _ from 'lodash'
import { Card, Icon, Avatar, Input } from 'react-native-elements'
import { BackBtn } from '@screens/SharedComponent/IconBtn'
import { Button, Text as T } from '@screens/SharedComponent/OnMyGradComponent'
import QuestionInput from './QuestionInput'
import moment from 'moment';
import momentHK from 'moment/src/locale/zh-hk' ;
import LANG from '@lang/lang'
import { actions as questionActions } from '@reducer/questionReducer'
import HTML from "react-native-render-html"

const CommentBlk = (props) => {
	const { user, comment, lang, token, created_time } = props
	console.log(props)
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


class SingleAnswerScreen extends Component {

	static navigationOptions = ({ navigation }) => ({
		headerLeft: <BackBtn navigation={navigation} />,
		title: `${navigation.state.params.question.title}`,
	})

	constructor(props) {
    super(props)
    this.state = { question: {}, comment_list: [], comment: "", loading: false}
		
	}
  componentDidMount(){
		const { question, answer } = this.props.navigation.state.params
    this.props.reqQuestionById(question.id, (result)=>{
			this.setState({question: result.question})
		})
		this.props.reqAnswerComment(answer.id, (result)=>{
			this.setState({comment_list: result.comment})
		})
	}
	
	render() {
		const { question, answer } = this.props.navigation.state.params
		const { lang, token } = this.props
		const { loading, comment_list } = this.state
		
		return (<ScrollView style={{ backgroundColor: '#f6f6f6', height: '100%' }}>
				<V style={[s.mv2]}>
					<V style={[s.flx_row, s.mb1, s.ph2]}>
						<V style={[s.flx_i]}><T type={'title'}>{question.title}</T></V>
					</V>
					<Card containerStyle={[styles.card]} title={<V style={[s.flx_i, s.flx_row, s.aic]}>
						<Avatar
							rounded
							source={{uri: question.user ? question.user.thumbnail : null}}
							size="small"
							title={question.user ? question.user.name[0] : ''}
						/>
						<T style={[s.ml1]}>{question.user.name}</T>
					</V>}>
						<V style={[s.mv2]}>
							<T style={[s.b]}>{question.title}</T>
							<HTML
								html={this.state.question.content}
								imagesMaxWidth={Dimensions.get('window').width - 30}
							/>
							{/* <T>{question.content}</T> */}
						</V>
						<V style={[s.flx_i, s.flx_row, s.aic]}>
							<V style={[s.flx_i]}><T>{`${question.like_count?question.like_count:0} ${LANG[lang].like}`}</T></V>
							<V style={[s.flx_i]}><T>{`${question.answer_count?question.answer_count:0} ${LANG[lang].answer}`}</T></V>
						</V>
					</Card>
				</V>
				<V style={[s.mv2]}>
					<Card containerStyle={[styles.card]} title={<V style={[s.flx_i, s.flx_row, s.aic]}>
						<Avatar
							rounded
							source={{uri: answer.user ? answer.user.thumbnail : null}}
							size="small"
							title={answer.user ? answer.user.name[0] : ''}
						/>
						<T style={[s.ml1]}>{answer.user.name}</T>
					</V>}>
						<V style={[s.mv2]}>
							<HTML
								html={answer.content}
								imagesMaxWidth={Dimensions.get('window').width - 30}
							/>
						</V>
						<V style={[s.flx_i, s.flx_row, s.aic]}>
							<V style={[s.flx_i, s.aife]}><T>{`${answer.comment_count} ${LANG[lang].comment}`}</T></V>
						</V>
					</Card>
				</V>

				<V style={[s.mt2, {backgroundColor: '#ffffff'}]}>
				{!_.isEmpty(token)?
					<V style={[s.flx_row, s.pa2, s.aic, {borderBottomWidth: 1, borderBottomColor: '#f1f1f1'}]}>
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
							if(this.state.comment) this.props.addComment(answer.id, this.state.comment, ()=>{
								this.setState({comment: ""})
								this.props.reqAnswerComment(answer.id, (result)=>{
									this.setState({comment_list: result.comment})
								})
							})
						}}>
							<V style={[s.mv1, s.mh2]} ><FontAwesome name='send' size={20} color={"#ffd926"} /></V>
							<V style={[s.ph1, s.aic, s.jcc, {width: 45}]}><T>{`${this.state.comment.length}/50`}</T></V>
						</TouchableOpacity>
					</V>
					:<V style={[s.aic, s.jcc, s.pv2, {width: '100%'}]}><T>{LANG[lang].please_login_to_comment}</T></V>}
					{ loading
					? <V style={[s.flx_i, s.jcc, s.aifc]}>
							<ActivityIndicator size="large" color="#ffd926" />
							<T type={'normal'}>{LANG[lang].not_yet_have_comment}</T>
						</V>
					: <FlatList
						data={_.orderBy(this.state.comment_list,['created_time'],['desc'])}
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
//s.jcc, s.aic, s.ba, s.ma1, {width: 70, height: 70}, s.br2
const styles = StyleSheet.create({
	categoryBtn: {
		width: 70, height: 80,
		backgroundColor: "#ffffff",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowOpacity: 0.29,
		shadowRadius: 4.65,
		elevation: 7,
	},
	subTitle: { color: "#808080", fontSize: 12 },
	card: {
		marginLeft: 0,
		marginRight: 0,
		marginTop: 5,
		marginBottom: 5,
		paddingTop: 5,
		paddingBottom: 5,
		shadowOpacity: 0,
		shadowColor: 'rgba(0,0,0,0)',
		shadowRadius: 0,
		borderWidth: 0
	}
})

export default SingleAnswer = connect(
	(state, props) => ({
		lang: state.app.lang,
		token: state.auth.token,
	}),
	(dispatch, props) => ({
		reqQuestionAnswer: (question_id, cb)=>dispatch(questionActions.reqQuestionAnswer(question_id, cb)),
		reqQuestionById: (question_id, cb) => dispatch(questionActions.reqQuestionById(question_id, cb)),
		reqAnswerComment: (answer_id, cb) => dispatch(questionActions.reqAnswerComment(answer_id, cb)),
		addComment: (answer_id, comment, cb)=>dispatch(questionActions.reqAnswerCommentActions("add", answer_id, comment, cb))
	}),
)(SingleAnswerScreen)
