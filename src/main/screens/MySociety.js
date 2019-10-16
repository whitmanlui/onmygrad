import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View as V, ScrollView, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Text as T, Button } from '@screens/SharedComponent/OnMyGradComponent'
import LANG from '@lang/lang'
import { Card, Avatar } from 'react-native-elements'
import _ from 'lodash'
import { styles as s } from 'react-native-style-tachyons'
import { actions as societyActions } from '@reducer/societyReducer'
import { CustomIcon } from '@screens/SharedComponent/CustomIcon';

const MySocietyBlk = (props) => {
	const { id, name, thumbnail, tag_list, headline, status, joined_user, liked_user, comment_count, lang } = props
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
							return <V key={`tag${i}`} style={[{ backgroundColor: '#f1f1f1' }, s.br5, s.ph2, s.mr1]}><T>{v}</T></V>
						})}
					</V>
				</V>
				<V style={[s.aic, s.jcc]}>
					<Button
						type={"OnMyGrad"}
						title={`${LANG[lang].joined}`}
						containerStyle={[s.ph2, s.br5]}
						disabled={true}
					/>
				</V>
			</V>
		</V>
	</TouchableOpacity>
}
class MySocietyScreen extends Component {
	static navigationOptions = ({ navigation }) => ({
		title: "",
	})
	constructor(props) {
		super(props)
	}
	componentDidMount() {
		this.props.getJoinedSociety()
	}

	componentDidUpdate(prevProps){
		if(prevProps.token != this.props.token){
			this.props.getJoinedSociety()
		}
	}

	render() {
		const { lang } = this.props
		return (this.props.joinedSociety.length == 0? <V style={[s.flx_i, s.jcc, s.aic, {backgroundColor: '#f6f6f6', height: '100%'}]}>
				<V style={[s.mb3, s.jcc, s.aic,  {
					borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
					width: Dimensions.get('window').width * 0.5,
					height: Dimensions.get('window').width * 0.5,
					backgroundColor: '#ffffff'
				}]}>
					<CustomIcon name="tabbar2-w" style={[{fontSize: 120, color: '#ffd926'}]} ></CustomIcon>
				</V>
				<T type={"title"}>{LANG[lang].no_joined_society}</T>
			</V> : <ScrollView style={{backgroundColor: '#f6f6f6', height:'100%'}}>
			<V style={[s.pa2]}>
				<V>
					<V style={[s.flx_row, s.mb1]}>
						<V style={[s.flx_i]}><T type={'title'}>{`${LANG[lang].joined_society}(${this.props.joinedSociety.length})`}</T></V>
					</V>
					<V>
						<FlatList
							data={this.props.joinedSociety}
							keyExtractor={(item, index) => index.toString()}
							renderItem={({item, index}) => {
								//push your code
								return <MySocietyBlk {...item} navigation={this.props.navigation} lang={this.props.lang} />
							}}
						/>
					</V>
					</V>

			</V>
		</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
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


export default MySociety = connect(
	(state, props) => ({
		lang: state.app.lang,
		joinedSociety: state.society.joinedSociety
	}),
	(dispatch, props) => ({
		getJoinedSociety: () => dispatch(societyActions.reqJoinedSociety())
	}),
)(MySocietyScreen)
