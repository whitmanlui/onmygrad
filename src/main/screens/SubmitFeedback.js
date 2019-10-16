import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View as V, ScrollView, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { Text as T, Button } from '@screens/SharedComponent/OnMyGradComponent'
import LANG from '@lang/lang'
import _ from 'lodash'
import { styles as s } from 'react-native-style-tachyons'
import { actions as questionActions } from '@reducer/questionReducer'
import { Input } from 'react-native-elements';
import { BackBtn, CloseBtn } from '@screens/SharedComponent/IconBtn'

class SubmitFeedbackScreen extends Component {
	static navigationOptions = ({ navigation }) => ({
		headerLeft: <BackBtn navigation={navigation} />,
		title: navigation.state.params && navigation.state.params.title,
		headerRight: navigation.state.params && navigation.state.params.headerRight,
		headerStyle: { borderBottomWidth: 0, elevation: 0, shadowOpacity: 0 }
	})
	constructor(props) {
		super(props)
		console.log(this.props.navigation.state.params)
	}
	componentDidMount() {
		const { lang } = this.props
		this.props.navigation.setParams({
			title: LANG[lang].report_problem
		})
	
	}
	_post() {
		console.log(this.state)
	}
	state = {
		email: "",
		name: "",
		suggestion: "" 
	}
	
	render() {
		const { lang } = this.props
		return (<ScrollView style={[s.ph1, {backgroundColor: '#F9F9F9', height: '100%'}]}>
			<V style={[s.flx_i, s.pa1]}>
				<T type={'title'}>{LANG[lang].email}</T>
				<Input underlineColorAndroid={'rgba(0,0,0,0)'}
					onChangeText={(v)=>this.setState({email: v})} 
					containerStyle={[s.ba, s.br3, s.mv2, {borderColor: '#ffd926'}]}
					inputContainerStyle={{ borderBottomWidth: 0 }}
				/>
				<T type={'title'}>{LANG[lang].name}</T>
				<Input underlineColorAndroid={'rgba(0,0,0,0)'}
					onChangeText={(v)=>this.setState({name: v})} 
					containerStyle={[s.ba, s.br3, s.mv2, {borderColor: '#ffd926'}]}
					inputContainerStyle={{ borderBottomWidth: 0 }}
				/>
				<T type={'title'}>{LANG[lang].suggestion}</T>
				<Input underlineColorAndroid={'rgba(0,0,0,0)'}
					onChangeText={(v)=>this.setState({suggestion: v})} 
					containerStyle={[s.ba, s.br3, s.mv2, {borderColor: '#ffd926'}]}
					inputContainerStyle={{ borderBottomWidth: 0 }}
					multiline = {true}
         	height={150}
					maxLength={150}
				/>
				<V style={[s.flx_i, s.aic]}>
					<Button type={'OnMyGrad'} 
						title={`${LANG[lang].submit}`} 
						containerStyle={[s.br3, s.mt4, {width: '60%'}]}
						onPress={()=>this._post()}
					/>
				</V>
			</V>
		</ScrollView>
		);
	}
}

const styles = StyleSheet.create({

})


export default SubmitFeedback = connect(
	(state, props) => ({
		lang: state.app.lang,
		latestQuestion: state.question.latestQuestion,
	}),
	(dispatch, props) => ({
		getLatestQuestion: () => dispatch(questionActions.reqLatestQuestion()),
		addQuestion: (title, content, tag_list, question_id, cb) => dispatch(questionActions.reqQuestionActions('add', title, content, tag_list, question_id, cb)),
		addAnswer: (question_id, content, answer_id, vote, cb) => dispatch(questionActions.reqQuestionAnswerActions('add', question_id, content, answer_id, vote, cb)),
	}),
)(SubmitFeedbackScreen)
