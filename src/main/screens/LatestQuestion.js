import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View as V, ScrollView, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { Text as T, Button } from '@screens/SharedComponent/OnMyGradComponent'
import LANG from '@lang/lang'
import { Card, Avatar } from 'react-native-elements'
import _ from 'lodash'
import { styles as s } from 'react-native-style-tachyons'
import { actions as questionActions } from '@reducer/questionReducer'
import { FilterBtn, More2Btn } from '@screens/SharedComponent/IconBtn'
import HTML from "react-native-render-html"

const NewsBlk = (props) => {
	const { user, title, content, like_count, answer_count, comment_count, tag_list, lang } = props
	return <TouchableOpacity onPress={() => props.navigation.navigate("QNA", { question: props })}>
		<V style={[s.mv1, s.pa2,  s.br2, {backgroundColor: '#FFFFFF'}]}>
			<V style={[s.flx_i, s.flx_row, s.aic]}>
				<Avatar
					rounded
					source={{uri: user ? user.thumbnail : null}}
					size="small"
					title={user.name[0]}
				/>
				<T style={[s.ml1]}>{user ? user.name : ''}</T>
			</V>
			<V style={[s.mv2]}>
				<T type={'title'} style={[s.b]}>{title}</T>
				{/* <HTML
					html={content}
					imagesMaxWidth={Dimensions.get('window').width}
				/> */}
			</V>
			<V style={[s.flx_i, s.flx_row, s.aic]}>
				<V style={[s.flx_i]}><T type={'small'}>{`${like_count?like_count:0} ${LANG[lang].like}`}</T></V>
				<V style={[s.flx_i]}><T type={'small'}>{`${answer_count?answer_count:0} ${LANG[lang].answer}`}</T></V>
				{/* <More2Btn onPress={() => props.navigation.navigate("QNA", { question: props })} /> */}
			</V>
		</V>
	</TouchableOpacity>
}
class LatestQuestionScreen extends Component {
	static navigationOptions = ({ navigation }) => ({
		title: "New",
	})
	constructor(props) {
		super(props)
	}
	componentDidMount() {
		this.props.getLatestQuestion()
	}
	componentDidUpdate(prevProps){
		if(prevProps.token != this.props.token){
			this.props.getLatestQuestion()
		}
	}
	render() {
		const { lang } = this.props
		return (<ScrollView style={[s.ph1, {backgroundColor: '#F9F9F9'}]}>
			<V style={[s.pa1]}>
				<V style={[s.flx_row, s.mb1]}>
					<V style={[s.flx_i]}><T type={'title'}>{LANG[lang].news_question}</T></V>
					{/* <FilterBtn onPress={() => console.log("filter btn")} /> */}
				</V>
				<V>
					<FlatList
						data={this.props.latestQuestion}
						keyExtractor={(item, index) => index.toString()}
						renderItem={({item, index}) => {
							//push your code
							return <NewsBlk {...item} navigation={this.props.navigation} lang={this.props.lang} />
						}}
					/>
				</V>
			</V>
		</ScrollView>
		);
	}
}

const styles = StyleSheet.create({

})


export default LatestQuestion = connect(
	(state, props) => ({
		token: state.auth.token,
		lang: state.app.lang,
		latestQuestion: state.question.latestQuestion,
	}),
	(dispatch, props) => ({
		getLatestQuestion: () => dispatch(questionActions.reqLatestQuestion())
	}),
)(LatestQuestionScreen)
