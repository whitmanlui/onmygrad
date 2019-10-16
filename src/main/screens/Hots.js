import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View as V, TouchableOpacity, StyleSheet, ScrollView, Image, FlatList, Dimensions } from 'react-native';
import { styles as s } from 'react-native-style-tachyons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import _ from 'lodash'
import { Card, Icon, Avatar } from 'react-native-elements'
import { Text as T, Button } from '@screens/SharedComponent/OnMyGradComponent'
import LANG from '@lang/lang'
import { actions as questionActions } from '@reducer/questionReducer'
import { FilterBtn, More2Btn } from '@screens/SharedComponent/IconBtn'
import { CustomIcon } from '@screens/SharedComponent/CustomIcon';
import { actions as authActions } from '@reducer/authReducer';
import HTML from "react-native-render-html"

import BannerAds from './SharedComponent/BannerAds'

const CategoryBlk = (props) => {
	const { thumbnail, name_zh, searchKey } = props
	return <TouchableOpacity onPress={() => props.navigation.navigate("Search", { category: searchKey, search_text: name_zh }) }>
		<V style={[s.jcc, s.aic]} >
			<V style={[styles.categoryBtn, s.jcc, s.aic, s.ma1, s.br2]}>
				<Image
					source={{uri: thumbnail}}
					resizeMode={"contain"}
					style={{ width: 26, height: 26 }}
				/>
				<T type={'small'} style={[s.mt2, s.tc]}>{name_zh}</T>
			</V>
		</V>
	</TouchableOpacity>
}

const Questionblk1 = (props) => {
	const { image, user, react_datetime, title, content, like, answer, index, lang } = props
	return <TouchableOpacity onPress={() => props.navigation.navigate("QNA", { question: props })}>
		<V style={[s.mv1, s.pa2,  s.br2, {backgroundColor: '#FFFFFF'}]}>
			<V style={[s.flx_i, s.flx_row, s.aic]}>
				<Avatar rounded icon={{ name: 'user', type: 'font-awesome' }} />
				<T style={[s.ml1]}>{user}</T>
			</V>
			<V style={[s.mv2]}>
				<T type={'title'} style={[s.b]}>{title}</T>
				<T>{content}</T>
			</V>
			<V style={[s.flx_i, s.flx_row, s.aic]}>
				<V style={[s.flx_i]}><T type={'small'}>{`${like?like:0} ${LANG[lang].like}`}</T></V>
				<V style={[s.flx_i]}><T type={'small'}>{`${answer?answer:0} ${LANG[lang].answer}`}</T></V>
				{/* <More2Btn onPress={() => props.navigation.navigate("QNA", { question: props })} /> */}
			</V>
		</V>
	</TouchableOpacity>
}

const Questionblk = (props) => {
	const { user, thumbnail, title, content, like_count, answer_count, comment_count, tag_list, lang, token } = props
	return <TouchableOpacity onPress={() => props.navigation.navigate("QNA", { question: props })}>
		<V style={[s.mv1, s.pa2,  s.br2, {backgroundColor: '#FFFFFF'}]}>
			<V style={[s.flx_i, s.flx_row, s.aic]}>
				<Avatar
					rounded
					source={{uri: user ? user.thumbnail : null}}
					size="small"
					title={user ? user.name[0] : ''}
				/>
				<T style={[s.ml1]}>{user ? user.name : ''}</T>
			</V>
			<V style={[s.mv2]}>
				<T type={'title'} ellipsizeMode={'tail'} numberOfLines={3} style={[s.b]}>{title}</T>
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
class HotsScreen extends Component {

	static navigationOptions = ({ navigation }) => ({
		title: "Hot",
	})
	constructor(props) {
		super(props)
		this.state = { isVisible: false }
	}
	componentDidMount() {
		this.props.autoLogin()
		this.props.feedAll()
	}
	componentDidUpdate(prevProps){
		if(prevProps.token.id != this.props.token.id){
			this.props.feedAll()
		}
	}

	render() {
		const { lang, token, searchCate } = this.props
		return (<ScrollView style={[{backgroundColor: '#F9F9F9', height: '100%'}]}>
			<BannerAds {...this.props}/>
			<V style={[s.ph2, s.mv2]}>
				<V style={[s.flx_row, s.mb1]}>
					<V style={[s.flx_i]}><T type={'title'}>{`${LANG[lang].hots_cate}(${this.props.hotsCate.length})`}</T></V>
					{/* <V style={[ s.flx_row, s.aife]}>
                            <T style={[s.tr]}>{`${LANG[lang].show_all}`}</T>
                            <CustomIcon name="see-more" style={[{fontSize: 18,color: '#000000'}]} ></CustomIcon>
                        </V> */}
				</V>

				<V style={[s.flx_row, s.flx_wrap, s.jcc]}>
					<FlatList
						contentContainerStyle={{
							alignSelf: 'flex-start'
						}}
						showsHorizontalScrollIndicator={false}
						horizontal={true}
						data={_.chunk(this.props.hotsCate, 2)}
						keyExtractor={(item, index) => index.toString()}
						renderItem={({ item, index }) => {
							//push your code
							return <V>{_.map(item, (v, i) => <CategoryBlk searchCate={searchCate} searchKey={v.key} {...v} navigation={this.props.navigation} />)}</V>
						}}
					/>
				</V>
			</V>
			<V style={[s.ph2, s.mv2]}>
				<V style={[s.flx_row, s.mb1]}>
					<V style={[s.flx_i]}><T type={'title'}>{LANG[lang].hots_qna}</T></V>
					{/* <FilterBtn onPress={()=>console.log("filter btn")}/> */}
				</V>
				<V>
					<FlatList
						data={this.props.hotsAnswer}
						keyExtractor={(item, index) => index.toString()}
						renderItem={({item, index}) => {
							//push your code
							return <Questionblk {...item} navigation={this.props.navigation} lang={lang} token={token}/>
						}}
					/>
				</V>
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
	}
})

export default Hots = connect(
	(state, props) => ({
		token: state.auth.token,
		lang: state.app.lang,
		hotsCate: state.question.hotsCate,
		hotsAnswer: state.question.hotsAnswer
	}),
	(dispatch, props) => ({
		autoLogin: ()=> dispatch(authActions.reqAutoLogin()),
		feedAll: () => {
			dispatch(questionActions.reqHotsCate())
			dispatch(questionActions.reqHotsAnswer())
		}
	}),
)(HotsScreen)
