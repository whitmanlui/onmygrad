import React, { Component } from 'react';
import { SafeAreaView, View as V, ScrollView, TouchableWithoutFeedback, Dimensions, FlatList, StyleSheet, Image, TouchableHighlight, TouchableOpacity, Platform, ActivityIndicator, } from 'react-native';
import { connect } from 'react-redux';
import { Header } from 'react-native-elements'
import { styles as s } from 'react-native-style-tachyons'
import _ from 'lodash'
import { Avatar, Icon } from 'react-native-elements'
import { Button, Text as T, LinearBtn } from '@screens/SharedComponent/OnMyGradComponent'
import moment from 'moment';
import momentHK from 'moment/src/locale/zh-hk' ;
import { MoreBtn } from '@screens/SharedComponent/IconBtn';
import LANG from '@lang/lang'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { actions as meActions } from '@reducer/meReducer'
import {NavigationEvents} from 'react-navigation';

FormatDate = (timestamp) => {
	moment.locale('zh-hk', momentHK);
	return moment.unix(timestamp).utcOffset(8).format('MMM Do YYYY');
}

const EducationBlk = (props) => {
	const {
		institution,
		name,
		start_time,
		end_time,
		gpa,
		gpa_max,
		thumbnail,
		lang
	} = props;

	return (
		<V style={[s.flx_row, s.flx_wrap, s.pv1, s.bb, {borderColor: '#eeeeee'}]}>
			<V style={[s.flx_i, s.aic, s.jcc]}>
				<Avatar
					rounded source={{uri: thumbnail ? thumbnail : null}}
					size="small"
					title={name[0]}
				/>
			</V>
			<V style={[{flex:4}]}>
				<V style={[s.pv1]}><T style={[styles.itemName]}>{`${LANG[lang][institution]}`}</T></V>
				<V><T style={[styles.itemSubname]}>{`${name}`}</T></V>
				<V><T style={[styles.itemRemarks]}>{`${FormatDate(start_time)} - ${FormatDate(end_time)}`}</T></V>
			</V>
		</V>
	)
}

const ProBlk = (props) => {
	const {
		name,
		organization,
		description,
		award_year,
		thumbnail
	} = props;

	return (
		<V style={[s.flx_row, s.flx_wrap, s.pv1, s.bb, {borderColor: '#eeeeee'}]}>
			<V style={[s.flx_i, s.aic, s.jcc]}>
				<Avatar 
					rounded
					source={{uri: thumbnail ? thumbnail : null}}
					size="small"
					title={organization[0]}
				/>
			</V>
			<V style={[{flex:4}]}>
				<V style={[s.pv1]}><T style={[styles.itemName]}>{`${organization}`}</T></V>
				<V><T style={[styles.itemSubname]}>{`${name}`}</T></V>
				<V><T style={[styles.itemRemarks]}>{`${award_year}`}</T></V>
				<V><T style={[styles.itemContent]}>{`${description}`}</T></V>
			</V>
		</V>
	)
}

const ExpBlk = (props) => {
	const {
		name,
		organization,
		description,
		start_date,
		end_date
	} = props;

	return (
		<V style={[s.flx_row, s.flx_wrap, s.pv1, s.bb, {borderColor: '#eeeeee'}]}>
			<V style={[{flex:1}]}>
				<V style={[s.pv1]}><T style={[styles.itemName]}>{`${name}`}</T></V>
				<V><T style={[styles.itemSubname]}>{`${organization}`}</T></V>
				<V><T style={[styles.itemContent]}>{`${description}`}</T></V>
				<V><T style={[styles.itemRemarks]}>{`${FormatDate(start_date)} - ${FormatDate(end_date)}`}</T></V>
			</V>
		</V>
	)
}

const WorkBlk = (props) => {
	const {
		position,
		company,
		description,
		start_date,
		end_date,
		thumbnail
	} = props;

	return (
		<V style={[s.flx_row, s.flx_wrap, s.pv1, s.bb, {borderColor: '#eeeeee'}]}>
			<V style={[s.flx_i, s.aic, s.jcc]}>
				<Avatar rounded source={{uri: thumbnail ? thumbnail : null}} size="small" title={company[0]}/>
			</V>
			<V style={[{flex:4}]}>
				<V style={[s.pv1]}><T style={[styles.itemName]}>{`${company}`}</T></V>
				<V ><T style={[styles.itemSubname]}>{`${position}`}</T></V>
				<V><T style={[styles.itemRemarks]}>{`${FormatDate(start_date)} - ${FormatDate(end_date)}`}</T></V>
				<V><T style={[styles.itemContent]}>{`${description}`}</T></V>
			</V>
		</V>
	)
}

class ResumeScreen extends Component {

	static navigationOptions = ({ navigation }) => ({
		title: "我的履歷",
	})

	constructor(props) {
		super(props)
		this.state = { 
			page: 0,
			loading: true
		}
	}

	componentDidMount(){
    this.props.reqResume(() => {
			console.log('loaded')
			this.setState({
				loading: false
			})
		});
  }

	_renderEducationBlk() {
		const {education} = this.props.resume.resume
		return _.map(education , (v, i) => {
      return <EducationBlk {...v} key={i} navigation={this.props.navigation} lang={this.props.lang}/>;
    });
	}

	_renderProBlk() {
		const { professional } = this.props.resume.resume
		return _.map( professional , (v, i) => {
      return <ProBlk {...v} key={i} navigation={this.props.navigation} lang={this.props.lang}/>;
    });
	}

	_renderExpBlk() {
		const { experience } = this.props.resume.resume
		return _.map( experience , (v, i) => {
      return <ExpBlk {...v} key={i} navigation={this.props.navigation} lang={this.props.lang}/>;
    });
	}

	_renderWorkBlk() {
		const { working_experience } = this.props.resume.resume
		return _.map( working_experience , (v, i) => {
      return <WorkBlk {...v} key={i} navigation={this.props.navigation} lang={this.props.lang}/>;
    });
	}

	render() {
		const { lang } = this.props
		const { loading } = this.state
		const resume = this.props.resume.resume
		console.log(resume)
		return <SafeAreaView>
			<NavigationEvents onWillFocus={() => 
				this.props.reqResume(() => {
					console.log('loaded')
					this.setState({
						loading: false
					})
					})}
			/>
			<V style={{ backgroundColor: '#ffd926', position: 'absolute', width: '100%', height: loading ? 0 : 300 }}></V>
			{loading
				? <V style={[s.flx_i, s.jcc, s.aifc, {top: 350}]}>
						<ActivityIndicator size="large" color="#ffd926" />
					</V>
				: <ScrollView>
						<V style={[{ flex: 1, backgroundColor: '#f6f6f6' }]}>
							<V style={{ backgroundColor: '#ffd926', position: 'absolute', width: '100%', height: 300 }}></V>
							<V style={[{ alignItems: 'center'}]}>
								{/* <V style={[s.pa2, s.aic, s.mb1]}>
									<Avatar 
										source={{uri: resume.thumbnail ? resume.thumbnail : ''}}
										size="large"
									/> 
									<V style={[s.mt1, s.aic]}>
										<T style={[s.b]} type={'title'}>{(resume.headline !== "") ? `${resume.headline}` : ''}</T>
									</V>
								</V> */}

		{/* personal Information */}
								<V style={[{ backgroundColor: '#ffffff', width: '95%' }, s.br2, s.pa2, s.mb2, s.mt2]}>
									<TouchableOpacity
										style={[s.absolute, s.pa2, {right: 0, top: 0, zIndex: 999}]}
										onPress={ () => this.props.navigation.navigate('EditResume', {editPart: 'editpersonal'})}
									>
										<V>
											<FontAwesome name='edit' size={16} color={"#000000"} />
										</V>
									</TouchableOpacity>
									<V style={[s.pa2]}>
										<V style={[s.flx_row, s.mb1]}>
											<V style={[s.flx_i]}><T type={'title'} style={[s.b]}>{`${LANG[lang].my_info}`}</T></V>
										</V>

										<V style={[s.flx_row, s.flx_wrap, s.jcc]}>
											<V style={[s.flx_i, s.flx_row]}>
												<V style={[s.flx_i]}><T>{`${LANG[lang].formal_name_eng}`}</T></V>
												<V style={[{flex: 4}]}><T style={[s.tr]}>{(resume.firstname && resume.lastname) ? `${resume.firstname} ${resume.lastname}` : `-`}</T></V>
											</V>
										</V>

										<V style={[s.flx_row, s.flx_wrap, s.jcc]}>
											<V style={[s.flx_i, s.flx_row]}>
												<V style={[s.flx_i]}><T>{`${LANG[lang].formal_name_chi}`}</T></V>
												<V style={[{flex: 4}]}><T style={[s.tr]}>{(resume.lastname_zh && resume.firstname_zh) ? `${resume.lastname_zh}${resume.firstname_zh}` : `-`}</T></V>
											</V>
										</V>

										<V style={[s.flx_row, s.flx_wrap, s.jcc]}>
											<V style={[s.flx_i, s.flx_row]}>
												<V style={[s.flx_i]}><T>{`${LANG[lang].use_email}`}</T></V>
												<V style={[{flex: 4}]}><T style={[s.tr]}>{resume.email ? `${resume.email}` : `-`}</T></V>
											</V>
										</V>

										<V style={[s.flx_row, s.flx_wrap, s.jcc]}>
											<V style={[s.flx_i, s.flx_row]}>
												<V style={[s.flx_i]}><T>{`${LANG[lang].phone_no}`}</T></V>
												<V style={[{flex: 4}]}><T style={[s.tr]}>{resume.phone ? `${resume.phone}` : `-`}</T></V>
											</V>
										</V>

										<V style={[s.flx_row, s.flx_wrap, s.jcc]}>
											<V style={[s.flx_i, s.flx_row]}>
												<V style={[s.flx_i]}><T>{`${LANG[lang].dob}`}</T></V>
												<V style={[{flex: 4}]}><T style={[s.tr]}>{resume.dob ? `${FormatDate(resume.dob)}` : `-`}</T></V>
											</V>
										</V>

									</V>
								</V>

		{/* Skills tags */}
								{/* <V style={[{ backgroundColor: '#ffffff', width: '95%' }, s.br2, s.pa2, s.mb2]}>
									<V style={[s.pa2]}>
										<V>
											<T>{`TAG`}</T>
										</V>
									</V>
								</V> */}


		{/* education  */}
								<V style={[{ backgroundColor: '#ffffff', width: '95%' }, s.br2, s.pa2, s.mb2]}>
									<TouchableOpacity
										style={[s.absolute, s.pa2, {right: 0, top: 0, zIndex: 999}]}
										onPress={ () => this.props.navigation.navigate('EditResume', {editPart: 'editeducation'})}
									>
										<V>
											<FontAwesome name='edit' size={16} color={"#000000"} />
										</V>
									</TouchableOpacity>
									<V style={[s.pa2]}>
										<V style={[s.flx_row, s.mb1]}>
											<V style={[s.flx_i]}><T type={'title'} style={[s.b]}>{`${LANG[lang].my_education}`}</T></V>
										</V>
										<V style={[s.flx_i, s.pb2]}><T type={'normal'}>{`${LANG[lang].my_edu_instruction}`}</T></V>
										<V style={[s.flx_i]}>{this._renderEducationBlk()}</V>
									</V>
								</V>

		{/* experience Information */}
								<V style={[{ backgroundColor: '#ffffff', width: '95%' }, s.br2, s.pa2, s.mb2]}>
									<TouchableOpacity
										style={[s.absolute, s.pa2, {right: 0, top: 0, zIndex: 999}]}
										onPress={ () => this.props.navigation.navigate('EditResume', {editPart: 'editexperience'})}
									>
										<V>
											<FontAwesome name='edit' size={16} color={"#000000"} />
										</V>
									</TouchableOpacity>
									<V style={[s.pa2]}>
										<V style={[s.flx_row, s.mb1]}>
											<V style={[s.flx_i]}><T type={'title'} style={[s.b]}>{`${LANG[lang].my_experience}`}</T></V>
										</V>
										<V style={[s.flx_i, s.pb2]}><T type={'normal'}>{`${LANG[lang].my_exp_instruction}`}</T></V>
										<V style={[s.flx_i]}>{this._renderExpBlk()}</V>
									</V>
								</V>

		{/* work Information */}
								<V style={[{ backgroundColor: '#ffffff', width: '95%' }, s.br2, s.pa2, s.mb2]}>
									<TouchableOpacity
										style={[s.absolute, s.pa2, {right: 0, top: 0, zIndex: 999}]}
										onPress={ () => this.props.navigation.navigate('EditResume', {editPart: 'editwork_experience'})}
									>
										<V>
											<FontAwesome name='edit' size={16} color={"#000000"} />
										</V>
									</TouchableOpacity>
									<V style={[s.pa2]}>
										<V style={[s.flx_row, s.mb1]}>
											<V style={[s.flx_i]}><T type={'title'} style={[s.b]}>{`${LANG[lang].my_work}`}</T></V>
										</V>
										<V style={[s.flx_i, s.pb2]}><T type={'normal'}>{`${LANG[lang].my_work_instruction}`}</T></V>
										<V style={[s.flx_i]}>{this._renderWorkBlk()}</V>
									</V>
								</V>

		{/* professional Information */}
								<V style={[{ backgroundColor: '#ffffff', width: '95%' }, s.br2, s.pa2, s.mb2]}>
									<TouchableOpacity
										style={[s.absolute, s.pa2, {right: 0, top: 0, zIndex: 999}]}
										onPress={ () => this.props.navigation.navigate('EditResume', {editPart: 'editprofessional'})}
									>
										<V>
											<FontAwesome name='edit' size={16} color={"#000000"} />
										</V>
									</TouchableOpacity>
									<V style={[s.pa2]}>
										<V style={[s.flx_row, s.mb1]}>
											<V style={[s.flx_i]}><T type={'title'} style={[s.b]}>{`${LANG[lang].my_professional}`}</T></V>
										</V>
										<V style={[s.flx_i, s.pb2]}><T type={'normal'}>{`${LANG[lang].my_pro_instruction}`}</T></V>
										<V style={[s.flx_i]}>{this._renderProBlk()}</V>
									</V>
								</V>
							</V>
						</V>
					</ScrollView>
			}
		</SafeAreaView>
	}
}

const styles = StyleSheet.create({
	shadowBtn: {
		backgroundColor: "#ffffff",
		shadowColor: "#e6e4ee",
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.46,
		shadowRadius: 6.65,
		elevation: 7,
	},
	menuBtn: { borderBottomWidth: 1, borderBottomColor: '#f3f3f3' },
	itemName: {
		fontFamily: Platform.OS == 'ios' ? `Noto Sans TC Bold` : `NotoSansTC-Bold`,
		fontSize: 15,
		lineHeight: 18,
		color: '#323643'
	},
	itemSubname: {
		fontSize: 14,
		lineHeight: 16,
		color: '#323643'
	},
	itemContent: {
		fontSize: 12,
		color: '#5d5d5d'
	},
	itemRemarks: {
		fontSize: 12,
		color: '#9b9b9b'
	}

})

export default Resume = connect(
	(state, props) => ({
		lang: state.app.lang,
		resume: state.me.resume,
	}),
	(dispatch, props) => ({
		reqResume: (cb) => dispatch(meActions.reqResume(cb))
	}),
)(ResumeScreen)
