import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View as V, ScrollView, StyleSheet, TouchableWithoutFeedback, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { Text as T, Button } from '@screens/SharedComponent/OnMyGradComponent'
import LANG from '@lang/lang'
import { Avatar } from 'react-native-elements'
import _ from 'lodash'
import { styles as s } from 'react-native-style-tachyons'
import { actions as societyActions } from '@reducer/societyReducer'
import { FilterBtn, More2Btn } from '@screens/SharedComponent/IconBtn'
import { CustomIcon } from '@screens/SharedComponent/CustomIcon';

const RecommendToYou = (props) => {
	const { id, thumbnail, name } = props
	return <TouchableWithoutFeedback onPress={() => props.navigation.navigate('SocietyDetail', props)}>
		<V style={[s.br3, s.ma2, { backgroundColor: '#ffffff' }]}>
			<V style={[{ overflow: "hidden", borderTopLeftRadius: 7, borderTopRightRadius: 7, }]}>
				<Image
					source={{uri: thumbnail}}
					resizeMode={"contain"}
					style={{ width: 120, height: 120 }}
				/>
			</V>
			<V style={[s.pl2, s.pv1, s.flx_row, s.aic]}>
				<T style={[s.b, s.flx_i]}>{name}</T>
				<Button iconName={'plus'} type={'OnMyGrad_re'} 
					onPress={() => props.joinCircle(id) }
				/>
			</V>
		</V>
	</TouchableWithoutFeedback>
}

const HotsRecommendBlk = (props) => {
	const { id, comment_count, headline, joined_user, liked_user, name, status, tag_list, thumbnail, joined, lang } = props
	return <TouchableOpacity onPress={()=>props.navigation.navigate('SocietyDetail', props) }>
		<V style={[s.flx_i, s.flx_row, s.pa2]}>
			<Avatar size="medium" rounded source={{
				uri: thumbnail
			}} />
			<V style={[{ borderBottomWidth: 1, borderBottomColor: '#f3f3f3' }, s.flx_i, s.flx_row, s.pb1]}>
				<V style={[s.flx_i, s.ml2]}>
					<T style={[styles.text]} type={'title'} style={[s.b]}>{name}</T>
					<T style={[styles.text]}>{headline}</T>
					<V style={[s.flx_row]}>
						{_.map(tag_list, (v, i) => {
							return <V key={`key${i}`} style={[{ backgroundColor: '#f1f1f1' }, s.br5, s.ph2, s.mr1]}><T>{v}</T></V>
						})}
					</V>
				</V>
				<V style={[s.aic, s.jcc]}>
					{joined?<Button
						type={"OnMyGrad"}
						title={`${LANG[lang].joined}`}
						containerStyle={[s.ph2, s.br5]}
						disabled={true}
					/>:
					<Button
						type={"OnMyGrad"}
						title={`${LANG[lang].join}`}
						containerStyle={[s.ph2, s.br5]}
						onPress={() => { props.joinCircle(id) }}
					/>}
				</V>
			</V>
		</V>
	</TouchableOpacity>
}
class HotsRecommendScreen extends Component {
	static navigationOptions = ({ navigation }) => ({
		title: "",
	})
	constructor(props) {
		super(props)
	}
	componentDidMount() {
		this.props.feedAll()
	}

	componentDidUpdate(prevProps){
		if(prevProps.token != this.props.token){
			this.props.feedAll()
		}
	}

	render() {
		const { lang, token } = this.props
		return (<ScrollView style={{backgroundColor: '#f6f6f6', height:'100%'}} showsVerticalScrollIndicator={false}>
			<V style={[s.pa2]}>
				<V style={[s.flx_row, s.mb1]}>
					<V style={[s.flx_i]}><T type={'title'} style={[s.b]}>{`${LANG[lang].recommend_to_you}(${this.props.recommendation.length})`}</T></V>
					{/* <V style={[s.flx_row, s.aife]}>
						<T style={[s.tr]}>{`${LANG[lang].show_all}`}</T>
						<CustomIcon name="see-more" style={[{ fontSize: 18, color: '#000000' }]} ></CustomIcon>
					</V> */}
				</V>
				<V style={[s.flx_row, s.flx_wrap, s.jcc]}>
					<FlatList
						contentContainerStyle={[s.asfe]}
						showsHorizontalScrollIndicator={false}
						horizontal={true}
						data={this.props.recommendation}
						keyExtractor={(item, index) => index.toString()}
						renderItem={({ item, index }) => {
							//push your code
							return <RecommendToYou {...item} navigation={this.props.navigation} joinCircle={(circle_id)=>token.hasOwnProperty('token') ? this.props.joinCircle(circle_id, (result)=>{
								Alert.alert(
									"",
									LANG[lang].msg_circle_joined,
									[
										{text: 'OK', onPress: () => this.props.feedAll()},
									],
									{cancelable: true}
								)
							}) : this.props.navigation.navigate('Login')}/>
						}}
					/>
				</V>
				<V style={[s.flx_row, s.mb1]}>
					<V style={[s.flx_i]}><T type={'title'}>{`${LANG[lang].monthly_recommend}`}</T></V>
				</V>
				<V>
					<FlatList
						data={this.props.hotsRecommend}
						keyExtractor={(item, index) => index.toString()}
						renderItem={({item, index}) => {
							//push your code
							return <HotsRecommendBlk {...item} navigation={this.props.navigation} lang={lang} joinCircle={(circle_id)=>token.token ? this.props.joinCircle(circle_id, (result)=>{
								Alert.alert(
									"",
									LANG[lang].msg_circle_joined,
									[
										{text: 'OK', onPress: () => this.props.feedAll()},
									],
									{cancelable: true}
								)
							}) : this.props.navigation.navigate('Login')}/>
						}}
					/>
				</V>
			</V>
		</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	card: {
		marginLeft: 0,
		marginRight: 0,
		marginTop: 5,
		marginBottom: 5,
		paddingTop: 5,
		paddingBottom: 5,
		borderWidth: 0
	},
	text: {
		marginLeft: 0,
		marginRight: 0,
		marginTop: 0,
		marginBottom: 0,
		paddingLeft: 0,
		paddingRight: 0,
		paddingTop: 0,
		paddingBottom: 0,
	}
})


export default HotsRecommend = connect(
	(state, props) => ({
		token: state.auth.token,
		lang: state.app.lang,
		recommendation: state.society.recommendation,
		hotsRecommend: state.society.hotsRecommend
	}),
	(dispatch, props) => ({
		feedAll: () => {
			dispatch(societyActions.reqRecommendation())
			dispatch(societyActions.reqHotsRecommend())
		},
		joinCircle:(circle_id, cb)=>dispatch(societyActions.reqSocietyActions("join", circle_id, cb))
	}),
)(HotsRecommendScreen)
