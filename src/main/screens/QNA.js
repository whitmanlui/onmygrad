import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View as V, TouchableWithoutFeedback, StyleSheet, ScrollView, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import { styles as s } from 'react-native-style-tachyons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import _ from 'lodash'
import { Card, Icon, Avatar } from 'react-native-elements'
import { BackBtn } from '@screens/SharedComponent/IconBtn'
import { Button, Text as T } from '@screens/SharedComponent/OnMyGradComponent'
import QuestionInput from './QuestionInput'
import LANG from '@lang/lang'
import { actions as questionActions } from '@reducer/questionReducer'
import HTML from "react-native-render-html"
import LinearGradient from 'react-native-linear-gradient'
import { IGNORED_TAGS } from 'react-native-render-html/src/HTMLUtils';
import LottieView from 'lottie-react-native';

const Answerblk = (props) => {
	const { image, user, react_datetime, title, content, upvote_count, comment_count, index, lang, onPress } = props
	const WIDTH = Dimensions.get('window').width - 30
	return <TouchableWithoutFeedback onPress={onPress}>
		<Card containerStyle={[styles.card]} title={<V style={[s.flx_i, s.flx_row, s.aic, s.mb1]}>
			<Avatar
				rounded
				source={{uri: user.thumbnail ? user.thumbnail : null}}
				size="small"
				title={user ? user.name[0] : ''}
			/>
			<T style={[s.ml1]}>{user.name}</T>
		</V>}>
			<V style={[s.mv1,{height: 50, overflow: 'hidden'}]}>
				<HTML
					html={content.trim()}
					imagesMaxWidth={WIDTH}
					containerStyle={{paddingBottom: 0, paddingTop:0, marginTop: 0, marginBottom: 0}}
					tagsStyles={{ p: {width: WIDTH, marginTop: 0, marginBottom: 0, fontWeight: 'normal',marginRight: 5} }}

				/>
			</V>
			<V style={[s.flx_i, s.flx_row, s.aic]}>
				<V style={[s.flx_i, s.aife]}><T>{`${comment_count?comment_count:0} ${LANG[lang].comment}`}</T></V>
			</V>
			<V style={[{marginTop: 10, marginRight: 'auto', marginLeft: 'auto', width: WIDTH, height: 0.8, backgroundColor: '#c8c8c8'}]}></V>
		</Card>
		
	</TouchableWithoutFeedback>
}
class QNAScreen extends Component {

	static navigationOptions = ({ navigation }) => ({
		headerLeft: <BackBtn navigation={navigation} />,
		title: `${navigation.state.params.question.title}`,
	})
	constructor(props) {
		super(props)
		this.state = {
			answer: [],
			isVisible: false,
			question:{},
			loading: true,
			heart: require('../../../android/app/src/lottie_assets/like_heart.json'),
      like: true,
			like_speed: 0,
		}
	}

	componentDidMount(){
		const { question } = this.props.navigation.state.params
		this.props.reqQuestionAnswer(question.id, (answers)=>{
			this.setState({answer: answers})
			this.setState({loading:false})
		})
		this.props.reqQuestionById(question.id, (result)=>{
			this.setState({
				question: result.question,
				like: result.liked,
			})
		})
	}

	_PressLike = () => {
		const { question } = this.props.navigation.state.params
    this.animation.play()
    this.setState({
      like_speed: 0.95,
    })
    setTimeout( () => {
      this.setState({like: true})
      },
      1000
		)
		this.setState( (prev) => ({
			question: {
        ...prev.question,
        like_count : prev.question.like_count + 1
      }
		}))
    this.props.reqQuestionLike(question.id, () => {
      console.log('like jor')
    })
  }

  _PressUnlike = () => {
		const { question } = this.props.navigation.state.params
    this.animation.play()
    this.setState({
      like_speed: -0.95,
    })
    setTimeout( () => {
      this.setState({
				like: false
			})
      },
      1000
		)
		if (this.state.question.like_count > 0) {
			this.setState( (prev) => ({
				question: {
					...prev.question,
					like_count : prev.question.like_count - 1
				}
			}))
		}
    this.props.reqQuestionUnLike(question.id, () => {
      console.log('unlike jor')
    })
  }


	render() {
		const { question } = this.props.navigation.state.params
		const { lang, token } = this.props
		const { loading, heart, like, like_speed } = this.state
		return (loading ? <V style={[s.flx_i, s.jcc, s.aifc]}><ActivityIndicator size="large" color="#ffd926" /></V> :<V>
			<ScrollView style={{ backgroundColor: '#f6f6f6', height: '100%' }}>
				<V style={[s.mb2]}>
					<V style={[s.flx_row, s.ph2]}>
						{/* <V style={[s.flx_i]}><T type={'title'}>{this.state.question.title}</T></V> */}
						<V style={[s.flx_i, s.aife, s.pa2]}>
							<Button iconName={'edit'} iconType={'Feather'}
								title={"寫答案"} type={"OnMyGrad"}
								onPress={() => {
									token.token
									? this.props.navigation.navigate('WriteAnswer', {actionType: 'answer', question_id: this.state.question.id, title: this.state.question.title, cb: ()=>{
											this.props.reqQuestionAnswer(this.state.question.id, (answers)=>{
												this.setState({data: answers})
											})
										}})
									: this.props.navigation.navigate('Login')
									//this.setState({isVisible: true})
								}} />
						</V>
					</V>
					<Card containerStyle={[styles.card]} title={<V style={[s.flx_i, s.flx_row, s.aic]}>
						<Avatar
							rounded
							source={{uri: this.state.question.user ? this.state.question.user.thumbnail : null}}
							size="small"
							title={ !_.isEmpty(this.state.question) ? this.state.question.user.name[0] : ''}
						/>
						<T style={[s.ml1]}>{ !_.isEmpty(this.state.question) ? this.state.question.user.name: ""}</T>
					</V>}>
						<V style={[s.mv2]}>
							<T type={'title'} style={[s.b, s.mb2]}>{this.state.question.title}</T>
							<HTML
								html={this.state.question.content}
								imagesMaxWidth={Dimensions.get('window').width - 30}
							/>
							{/* <T>{question.content}</T> */}
						</V>
						<V style={[s.flx_i, s.flx_row, s.aic]}>
							<V style={[s.aife, {flex: 3}]}><T>{`${this.state.question.answer_count} ${LANG[lang].answer}`}</T></V>
							<V style={[s.aife, {flex: 1}]}><T>{`${this.state.question.like_count} ${LANG[lang].like}`}</T></V>
							<V style={[s.flx_i, s.jcc, s.aife, {width: 50,height: 50}]}>
								<TouchableWithoutFeedback
									onPress={() => {
										token.token
											? like ? this._PressUnlike() : this._PressLike()
											: this.props.navigation.navigate('Login')
									}}
								>
									<LottieView
										ref={ animation => {this.animation = animation}}
										source={heart}
										speed={like_speed}
										loop={false}
										progress={ like ? 1 : 0}
									/>
								</TouchableWithoutFeedback>
							</V>

						</V>
					</Card>
				</V>
				<V style={[s.flx_row, s.aic, s.pb1, s.pt3, s.pl2]}>
					<T style={[s.flx_i]}>{`全部答案共有 ${this.state.answer.length} 則`}</T>
					{/* <Button iconName={'sort'}
						title={"依照按讚數量排序"}
						style={[s.flx_i]} /> */}
				</V>
				<V style={[s.mv2]}>
					<FlatList
						data={this.state.answer}
						keyExtractor={(item, index) => index.toString()}
						renderItem={({item, index}) => {
							//push your code
							return <Answerblk {...item} lang={this.props.lang} onPress={()=>this.props.navigation.navigate('SingleAnswer', {question: this.state.question , answer: item})} />
						}}
					/>
				</V>
			</ScrollView>
			<QuestionInput isVisible={this.state.isVisible} close={() => this.setState({ isVisible: false })} /></V>
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
		marginTop: 0,
		marginBottom: 0,
		paddingTop: 5,
		paddingBottom: 5,
		shadowOpacity: 0,
		shadowColor: 'rgba(0,0,0,0)',
		shadowRadius: 0,
		borderWidth: 0,
		borderColor: 'transparent'
	}
})

export default QNA = connect(
	(state, props) => ({
		lang: state.app.lang,
		token: state.auth.token

	}),
	(dispatch, props) => ({
		reqQuestionAnswer: (question_id, cb)=>dispatch(questionActions.reqQuestionAnswer(question_id, cb)),
		reqQuestionById: (question_id, cb) => dispatch(questionActions.reqQuestionById(question_id, cb)),
		reqQuestionLike: (question_id, cb) => dispatch(questionActions.reqQuestionActions('like', undefined, undefined, undefined, undefined, question_id,cb)),
		reqQuestionUnLike: (question_id, cb) => dispatch(questionActions.reqQuestionActions('unlike', undefined, undefined, undefined, undefined, question_id,cb))
	}),
)(QNAScreen)
