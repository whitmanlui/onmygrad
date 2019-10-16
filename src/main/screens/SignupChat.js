import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View as V, StyleSheet, SafeAreaView, Image, FlatList, Dimensions } from 'react-native';
import { Text as T, Button, LinearBtn } from '@screens/SharedComponent/OnMyGradComponent'
import { styles as s } from 'react-native-style-tachyons'
import _ from 'lodash'
import { BackBtn } from '@screens/SharedComponent/IconBtn'
import LANG from '@lang/lang'
import { GiftedChat } from 'react-native-gifted-chat'
import { actions as authActions } from '@reducer/authReducer'

class SignupChatScreen extends Component {
	static navigationOptions = ({ navigation }) => ({
		headerLeft: <BackBtn navigation={navigation} />,
		title: 'OMG 小幫手',
		headerStyle: { borderBottomWidth: 0, elevation: 0, shadowOpacity: 0 }
	})
	state = {
		questions: ["請問你叫咩名？", "你俾邀請碼我 check 下先", "可唔可以俾埋個 email 我？開戶要email認證", "設定登入用密碼", "打多次密碼", "我無其他問題喇，麻煩去 check email，click個制認證，返黎就可以登入"],
		///questions: ["請輸入邀請碼","你叫咩名", "你確認使用這個用戶名稱？Y/N", "你的電郵", "輸入你的密碼", "再次輸入你的密碼", "你已完成申請, 請檢查你的電郵！"],
		answers: [],
		questionIndex: 0,
		messages: [],
		omgHelper: { _id: 999, name: 'OMG小幫手', avatar: require('../../res/assets/logo.png') },
		confirmName: false,
	}

	componentWillMount() {
		this.setState({
			messages: [{
				_id: 1,
				text: this.state.questions[this.state.questionIndex],
				createdAt: new Date(),
				user: this.state.omgHelper
			}],
		})
	}
	/* */
	onSend(messages = []) {
		if(this.state.questionIndex == 0){
			//confirm your name
			this.setState(previousState => ({
				messages: GiftedChat.append(previousState.messages, messages),
				questionIndex: previousState.questionIndex + 1,
				answers: _.concat(previousState.answers, [_.trim(messages[0].text)])
			}), () => {
				this.setState(previousState => ({
					messages: GiftedChat.append(previousState.messages, [{
						_id: previousState.messages.length + 1,
						text: `${this.state.answers[0]} 呢個名真係好好聽，好好聽呀`,
						createdAt: new Date(),
						user: previousState.omgHelper,
					}])
				}), () =>{
					setTimeout(() => {
						this.setState(previousState => ({
							messages: GiftedChat.append(previousState.messages, [{
								_id: previousState.messages.length + 1,
								text: previousState.questions[previousState.questionIndex],
								createdAt: new Date(),
								user: previousState.omgHelper,
							}])
						}))
					}, 1000)
				})
				
			})
			
		} else if (this.state.questionIndex == 1) {
			
			this.props.checkInvitationCode(_.trim(messages[0].text), (result)=>{
				if(result){
					this.setState(previousState => ({
						messages: GiftedChat.append(previousState.messages, messages),
						questionIndex: previousState.questionIndex + 1,
						answers: _.concat(previousState.answers, [_.trim(messages[0].text)])
					}), () => {
						this.setState(previousState => ({
							messages: GiftedChat.append(previousState.messages, [{
								_id: previousState.messages.length + 1,
								text: previousState.questions[previousState.questionIndex],
								createdAt: new Date(),
								user: previousState.omgHelper,
							}])
						}))
					})
				} else {
					this.setState(previousState => ({
						messages: GiftedChat.append(previousState.messages, messages),
						questionIndex: previousState.questionIndex - 1,
						answers: _.dropRight(previousState.answers)
					}), () => {
						this.setState(previousState => ({
							messages: GiftedChat.append(previousState.messages, [{
								_id: previousState.messages.length + 1,
								text: previousState.questions[previousState.questionIndex],
								createdAt: new Date(),
								user: previousState.omgHelper,
							}])
						}))
					})
				}
			})
		} /* else if (this.state.questionIndex == 2) {
			if (_.upperCase(_.trim(messages[0].text)) == "Y") {
				this.setState(previousState => ({
					messages: GiftedChat.append(previousState.messages, messages),
					questionIndex: previousState.questionIndex + 1,
				}), () => {
					this.setState(previousState => ({
						messages: GiftedChat.append(previousState.messages, [{
							_id: previousState.messages.length + 1,
							text: previousState.questions[previousState.questionIndex],
							createdAt: new Date(),
							user: previousState.omgHelper,
						}])
					}))
				})
			} else if (_.upperCase(_.trim(messages[0].text)) == "N") {
				this.setState(previousState => ({
					messages: GiftedChat.append(previousState.messages, messages),
					questionIndex: previousState.questionIndex - 1,
					answers: _.dropRight(previousState.answers)
				}), () => {
					this.setState(previousState => ({
						messages: GiftedChat.append(previousState.messages, [{
							_id: previousState.messages.length + 1,
							text: previousState.questions[previousState.questionIndex],
							createdAt: new Date(),
							user: previousState.omgHelper,
						}])
					}))
				})
			} else {
				this.setState(previousState => ({
					messages: GiftedChat.append(previousState.messages, messages),
				}), () => {
					this.setState(previousState => ({
						messages: GiftedChat.append(previousState.messages, [{
							_id: previousState.messages.length + 1,
							text: "輸入不正確",
							createdAt: new Date(),
							user: previousState.omgHelper,
						}])
					}))
				})
			}
		} */ else if (this.state.questionIndex == 2) {
			//check email format
			const email = _.trim(messages[0].text)
			const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
			if (reg.test(email)) {
				//email ok
				this.props.checkEmail(email, (state)=>{
					if(state){
						this.setState(previousState => ({
							messages: GiftedChat.append(previousState.messages, messages),
							questionIndex: previousState.questionIndex + 1,
							answers: _.concat(previousState.answers, [_.trim(messages[0].text)])
						}), () => {
							this.setState(previousState => ({
								messages: GiftedChat.append(previousState.messages, [{
									_id: previousState.messages.length + 1,
									text: previousState.questions[previousState.questionIndex],
									createdAt: new Date(),
									user: previousState.omgHelper,
								}])
							}))
						})
					} else {
						this.setState(previousState => ({
							messages: GiftedChat.append(previousState.messages, messages),
							//answers: _.concat(previousState.answers, [_.trim(messages[0].text)])
						}), () => {
							this.setState(previousState => ({
								messages: GiftedChat.append(previousState.messages, [{
									_id: previousState.messages.length + 1,
									text: "你輸入的電郵已被使用",
									createdAt: new Date(),
									user: previousState.omgHelper,
								}])
							}))
						})
					}
				})
				
			} else {
				this.setState(previousState => ({
					messages: GiftedChat.append(previousState.messages, messages),
					//answers: _.concat(previousState.answers, [_.trim(messages[0].text)])
				}), () => {
					this.setState(previousState => ({
						messages: GiftedChat.append(previousState.messages, [{
							_id: previousState.messages.length + 1,
							text: "你輸入的電郵不正確",
							createdAt: new Date(),
							user: previousState.omgHelper,
						}])
					}))
				})
			}
		} else if (this.state.questionIndex == 3) {
			//check password 
			this.setState(previousState => ({
				messages: GiftedChat.append(previousState.messages, messages),
				questionIndex: previousState.questionIndex + 1,
				answers: _.concat(previousState.answers, [_.trim(messages[0].text)])
			}), () => {
				this.setState(previousState => ({
					messages: GiftedChat.append(previousState.messages, [{
						_id: previousState.messages.length + 1,
						text: previousState.questions[previousState.questionIndex],
						createdAt: new Date(),
						user: previousState.omgHelper,
					}])
				}))
			})
		} else if (this.state.questionIndex == 4) {
			//check confirm pw
/* 			console.log(this.state.questionIndex - 1)
			console.log(this.state.answers)
			console.log(this.state.answers[this.state.answers.length - 1])
			console.log(messages[0].text) */
			if (this.state.answers[this.state.answers.length - 1] === _.trim(messages[0].text)) {
				this.setState(previousState => ({
					messages: GiftedChat.append(previousState.messages, messages),
					questionIndex: previousState.questionIndex + 1,
					answers: _.concat(previousState.answers, [_.trim(messages[0].text)])
				}), () => {
					this.setState(previousState => ({
						messages: GiftedChat.append(previousState.messages, [{
							_id: previousState.messages.length + 1,
							text: previousState.questions[previousState.questionIndex],
							createdAt: new Date(),
							user: previousState.omgHelper,
						}])
					}))
				})
			} else {
				this.setState(previousState => ({
					messages: GiftedChat.append(previousState.messages, messages),
					questionIndex: previousState.questionIndex - 1,
					answers: _.dropRight(previousState.answers)
				}), () => {
					this.setState(previousState => ({
						messages: GiftedChat.append(previousState.messages, [{
							_id: previousState.messages.length + 1,
							text: previousState.questions[previousState.questionIndex],
							createdAt: new Date(),
							user: previousState.omgHelper,
						}])
					}))
				})
			}

		}
	}

	render() {
		const { lang, register } = this.props
		return (
			<GiftedChat
				messages={this.state.messages}
				onSend={messages => this.onSend(messages)}
				user={{
					_id: 1,
				}}
				renderInputToolbar={(this.state.questions.length - 1 != this.state.questionIndex) ? "" : () => <LinearBtn title={LANG[lang].successful_register}
					containerStyle={[s.mh3]}
					//onPress={() => this.props.navigation.navigate('SignupImage')} 
					onPress={() => {
						//console.log(this.state.answers)
						register(this.state.answers[1], this.state.answers[0], this.state.answers[2], this.state.answers[3])
						this.props.navigation.pop()
					}} 
				/>}
			/>
		)
	}
}

const styles = StyleSheet.create({
	activeDot: { width: 25, height: 7 },
	inactiveDot: { width: 15, height: 7 },
	shadow: {
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowOpacity: 0.29,
		shadowRadius: 4.65,
		elevation: 7,
		marginLeft: 0,
		marginRight: 0,
		marginTop: 5,
		marginBottom: 5,
		paddingTop: 5,
		paddingBottom: 5,
		width: '95%'
	}
})

export default SignupChat = connect(
	(state, props) => ({
		lang: state.app.lang,
	}),
	(dispatch, props) => ({
		checkInvitationCode:(code, cb)=>dispatch(authActions.reqCheckInvitationCode(code, cb)),
		checkEmail:(email, cb)=>dispatch(authActions.reqCheckEmail(email, cb)),
		register:(code, username, email, password)=>dispatch(authActions.reqRegister(code, username, email, password))
	}),
)(SignupChatScreen)

