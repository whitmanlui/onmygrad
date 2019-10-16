import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View as V, ScrollView, StyleSheet, TouchableOpacity, FlatList, Dimensions, Alert } from 'react-native';
import { Text as T, Button } from '@screens/SharedComponent/OnMyGradComponent'
import LANG from '@lang/lang'
import _ from 'lodash'
import { styles as s } from 'react-native-style-tachyons'
import { actions as questionActions } from '@reducer/questionReducer'
import HTML from "react-native-render-html"
import Tags from "react-native-tags"
import { BackBtn, CloseBtn } from '@screens/SharedComponent/IconBtn'

class PreviewScreen extends Component {
	static navigationOptions = ({ navigation }) => ({
		headerLeft: <BackBtn navigation={navigation} />,
		title: '預覽',
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
			headerRight: (
				<TouchableOpacity  onPress={()=>this._post()}>
					<V style={[s.jcc, s.aic, s.mr3]}>
						<T tpye={'title'}>{LANG[lang].launch}</T>
					</V>
				</TouchableOpacity>
			)
		})
	
	}
	_post() {
		//const reqQuestionActions = (title, content, tag_list, question_id, cb) => ({type: QUESTION_ACTIONS, title, content, tag_list, question_id, cb})
    const { message, actionType, question_id, cb } = this.props.navigation.state.params
    const { lang } = this.props
		Alert.alert(
      LANG[lang].confirm_launch,
      "",
      [
        { text: LANG[lang].cancel, style: 'cancel', },
        {text: LANG[lang].launch, onPress: () => {
          if(actionType == 'question'){
            this.props.addQuestion(message.title, message.content, message.description, this.state.tagsSelected, undefined, (result)=>{
              console.log("cb", result)
              //this.props.navigation.pop()
              this.props.navigation.replace("QNA", { question: {id: result.id, title: message.title} }) 
              
            }) 
          } else if(actionType == 'answer') {
            //(question_id, content, answer_id, vote, cb)
            this.props.addAnswer(question_id, message.content, undefined, undefined, (result)=>{
              console.log("cb", result)
              if(cb) cb()
              this.props.navigation.pop()
            }) 
          }
        }},
      ],
      {cancelable: false},
		);
	}
	state = {
    	tagsSelected : []
	}
	
	render() {
		const { lang } = this.props
		const { message, actionType, title } = this.props.navigation.state.params
		console.log("preview page")
		console.log(this.props.navigation.state.params)
		return (<ScrollView style={[s.ph1, {backgroundColor: '#F9F9F9', height: '100%'}]}>
			<V style={[s.pa1]}>
				<V style={[s.flx_row, s.mb2]}>
					<V style={[s.flx_i, {backgroundColor: '#ffffff'}, s.pa2]}>
					{actionType == 'question'?<T type={'title'}>{message.title}</T>:<T type={'title'}>{title}</T>}
					</V>
				</V>
				{/* <V style={[s.flx_i, {backgroundColor: '#ffffff'}, s.mb2]}>
					<Tags
						initialText=""
						textInputProps={{
							placeholder: `${LANG[lang].add_tags}`
						}}
						createTagOnString={[" "]}
						initialTags={this.state.tagsSelected}
						onChangeTags={tags => this.setState({tagsSelected: tags})}
						onTagPress={(index, tagLabel, event, deleted) =>{
							console.log("console loggggggggg")
							console.log(index, tagLabel, event, deleted ? "deleted" : "not deleted")
						}}
						tagContainerStyle={{backgroundColor: '#ffd926'}}
						inputStyle={{ backgroundColor: "white" }}
					/>
				</V> */}
				<V style={[{backgroundColor: '#ffffff'}, s.pa2]}>
					<HTML
						html={message.content}
						imagesMaxWidth={Dimensions.get('window').width - 30}
					/>
				</V>
			</V>
		</ScrollView>
		);
	}
}

const styles = StyleSheet.create({

})


export default Preview = connect(
	(state, props) => ({
		lang: state.app.lang,
		latestQuestion: state.question.latestQuestion,
	}),
	(dispatch, props) => ({
		getLatestQuestion: () => dispatch(questionActions.reqLatestQuestion()),
		addQuestion: (title, content, description, tag_list, question_id, cb) => dispatch(questionActions.reqQuestionActions('add', title, content, description, tag_list, question_id, cb)),
		addAnswer: (question_id, content, answer_id, vote, cb) => dispatch(questionActions.reqQuestionAnswerActions('add', question_id, content, answer_id, vote, cb)),
	}),
)(PreviewScreen)
