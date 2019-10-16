import React, { Component } from 'react';
import { SafeAreaView, View as V, ScrollView, TouchableWithoutFeedback, Dimensions, FlatList, StyleSheet, Image, TouchableHighlight, Alert } from 'react-native';
import { connect } from 'react-redux';
import { styles as s } from 'react-native-style-tachyons'
import _ from 'lodash'
import { Avatar, Icon, Header, Badge, BadgedIcon  } from 'react-native-elements'
import { Button, Text as T, LinearBtn } from '@screens/SharedComponent/OnMyGradComponent'
import LANG from '@lang/lang'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { actions as userActions } from '@reducer/meReducer'
import { actions as authActions } from '@reducer/authReducer'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { CustomIcon } from '@screens/SharedComponent/CustomIcon';

const badgeDataArr = [
	{ badge: "circle", lv: "lv0" },
	{ badge: "exp", lv: "lv0" },
	{ badge: "favourite", lv: "lv0" },
	{ badge: "follower", lv: "lv0" },
	{ badge: "likeGive", lv: "lv0" },
	{ badge: "likeReceive", lv: "lv0" },
	{ badge: "mutual", lv: "lv0" },
	{ badge: "topic", lv: "lv0" },
]
const OMGBadge = (props) => {
	const { badge, lv } = props
	return <V style={[s.pa2]}>
		<Avatar rounded size="medium"
			source={badges[badge][lv]}
		/>
	</V>
}

class Me extends Component {
	screenWidth = Dimensions.get('window').width
	screenHeight = Dimensions.get('window').height + 80
	static navigationOptions = ({ navigation }) => ({
		header: null
	})
	constructor(props) {
		super(props)
		this.state = {
			page: 0,
			badgeData: badgeDataArr,
		}
	}

	componentDidMount() {
		this.props.reqUser();
	}

	_UserCheckin = (msg) => {
		this.props.userCheckin((msg) => {
			this.props.reqUser()
			console.log(msg)
			Alert.alert(
				`${msg}`,
			)
			this.props.reqUser();
		})
	}
	

	render() {
		const { lang, user } = this.props
		return <SafeAreaView style={[{backgroundColor: '#FFD926'}]}>
			<ScrollView style={{height: '100%'}}>
				<V style={[{ flex: 1, backgroundColor: '#f6f6f6' }]}>
					<V style={{ backgroundColor: '#FFD926', position: 'absolute', width: '100%', height: 300 }}></V>
					<V style={[{ alignItems: 'center' }]}>
						<Header
							containerStyle={[{ backgroundColor: 'transparent', paddingTop: 25, height: 50, borderBottomWidth: 0 }, s.ph2]}
							rightComponent={{
								icon: 'settings',
								color: '#fff',
								onPress: () => this.props.navigation.push('SettingScreen', {logout:()=>{
									this.props.navigation.navigate('Question')
								}})
							}}
							leftComponent={
								<V style={[s.flx_i, s.flx_row, s.aic, s.jcc, s.ph1, {width: 80}]}>
									<T>{LANG[lang].medal_experience_point}</T>
									<T style={{paddingLeft: 3, color: '#000000', fontSize: 16, lineHeight: 18}}>{user ? user.experience : '-'}</T>
								</V>
							}
						/>
						<V style={[s.pa2, s.aic, s.mb1]}>
							<TouchableOpacity onPress={()=>this.props.navigation.navigate('ChangeInfo', {isUpload: true})}>
								<V>
									<Avatar
										rounded
										source={{uri: user ? user.thumbnail : '' }}
										icon={{ name: 'user', type: 'font-awesome' }}
										size="large"
									/>
									{/* <BadgedIcon type="ionicon" name="ios-chatbubbles" /> */}
									<Badge
										value={<CustomIcon name="ask-add" style={[{fontSize: 18, color: "#ffffff"}]} ></CustomIcon>}
										containerStyle={{ position: 'absolute', bottom: -1, right: -1}}
										badgeStyle={{backgroundColor: '#ffd926', borderColor: '#ffd926' }}
									/>
								</V>
							</TouchableOpacity>
							<V style={[s.mt1, s.aic]}>
								<T style={[s.b]} type={'title'}>{user.name ? `${user.name}` : ''}</T>
								{/* <T>{user.headline ? `${user.headline}` : ''}</T> */}
							</V>
						</V>
						<V style={[{ backgroundColor: 'transparent', width: '95%' }, s.br2, s.pa2, s.mb2]}>
							<V style={[s.aic]}>
								{user.is_checked_in?<Button
									title={"已打卡"}
									titleStyle={{color: '#ffd926'}}
									containerStyle={[{ backgroundColor: '#ffffff', width: '75%', color: '#FFD926'}, s.br5]}
									disable={false}
								/>:<Button
									title={"每日打卡"}
									titleStyle={{color: '#ffd926'}}
									containerStyle={[{ backgroundColor: '#ffffff', width: '75%', color: '#FFD926'}, s.br5]}
									onPress={() => this._UserCheckin()}
								/>}
								</V>

								{/* <V style={[s.pa2]}>
									<V style={[s.flx_row, s.mb1]}>
										<V style={[s.flx_i]}><T type={'title'} style={[s.b]}>{`${LANG[lang].my_badge}`}</T></V>
										<TouchableOpacity onPress={() => {
											this.props.navigation.navigate('Badges');
										}}>
											<V style={[s.flx_row, s.aife]}>
												<T style={[s.tr]}>{`${LANG[lang].show_all}`}</T>
												<CustomIcon name="see-more" style={[{ fontSize: 18, color: '#000000' }]} ></CustomIcon>
											</V>
										</TouchableOpacity>
									</V>
									<V style={[s.flx_row]}>
										<FlatList
											contentContainerStyle={[s.asfe]}
											showsHorizontalScrollIndicator={false}
											horizontal={true}
											data={this.state.badgeData}
											keyExtractor={(item, index) => index.toString()}
											renderItem={({ item, index }) => {
												//push your code
												return <OMGBadge {...item} navigation={this.props.navigation} />
											}}
										/>
									</V>
								</V> */}
							</V>

						<V style={[{ backgroundColor: '#ffffff', width: '95%' }, s.br2, s.pa2, s.mb2]}>
							<V style={[s.pa2]}>
								<V style={[s.flx_row, s.mb1]}>
									<V style={[s.flx_i]}><T type={'title'} style={[s.b]}>{`${LANG[lang].my_resume}`}</T></V>
									<TouchableOpacity
										onPress={() => { this.props.navigation.navigate('Resume') }}
									>
										<V style={[s.flx_i]}><T style={[s.tr]}>{`${LANG[lang].show_all} >`}</T></V>
									</TouchableOpacity>
								</V>
								<V style={[s.flx_row, s.flx_wrap, s.jcc, s.pa1]}>
									<V style={[s.flx_i, s.flx_row, s.aic, s.ph3]}>
										<V style={[{ flex: 2 }]}><T style={[{ fontSize: 14, lineHeight: 20 }]}>{`${LANG[lang].my_education}`}</T></V>
										<V style={[{ flex: 1 }]}>
											{	(user.resume || {}).education_completed
												? <FontAwesome name='smile-o' size={16} color={"#7bd51f"} />
												: <FontAwesome name='meh-o' size={16} color={"#fcb445"} />
											}
										</V>
									</V>
									<V style={[s.flx_i, s.flx_row, s.aic, s.ph3]}>
										<V style={[{ flex: 2 }]}><T style={[{ fontSize: 14, lineHeight: 20 }]}>{`${LANG[lang].my_professional}`}</T></V>
										<V style={[{ flex: 1 }]}>
											{ (user.resume || {}).professional_completed
												? <FontAwesome name='smile-o' size={16} color={"#7bd51f"} />
												: <FontAwesome name='meh-o' size={16} color={"#fcb445"} />
											}
										</V>
									</V>
								</V>

								<V style={[s.flx_row, s.flx_wrap, s.jcc, s.pa1]}>
									<V style={[s.flx_i, s.flx_row, s.aic, s.ph3]}>
										<V style={[{ flex: 2 }]}><T style={[{ fontSize: 14, lineHeight: 20 }]}>{`${LANG[lang].my_expereience}`}</T></V>
										<V style={[{ flex: 1 }]}>
											{ (user.resume || {}).experience_completed
												? <FontAwesome name='smile-o' size={16} color={"#7bd51f"} />
												: <FontAwesome name='meh-o' size={16} color={"#fcb445"} />
											}
										</V>
									</V>
									<V style={[s.flx_i, s.flx_row, s.aic, s.ph3]}>
										<V style={[{ flex: 2 }]}><T style={[{ fontSize: 14, lineHeight: 20 }]}>{`${LANG[lang].my_work}`}</T></V>
										<V style={[{ flex: 1 }]}>
											{ (user.resume || {}).working_experience_completed
												? <FontAwesome name='smile-o' size={16} color={"#7bd51f"} />
												: <FontAwesome name='meh-o' size={16} color={"#fcb445"} />
											}
										</V>
									</V>
								</V>
							</V>
						</V>
						<V style={[s.flx_i, s.flx_row, s.ph4, s.pv2]}>
							<V style={[s.flx_i, s.aifs]}>
								<Button
									type={"OnMyGrad"}
									title={LANG[lang].perform_apt_test}
									containerStyle={[{ width: '85%' }, s.br5, s.mb2]}
									onPress={ () => {this.props.navigation.navigate('Quiz')}}
								/>
							</V>
							<V style={[s.flx_i, s.aife]}>
								<Button
									type={"OnMyGrad"}
									title={LANG[lang].perform_psycho_test}
									containerStyle={[{ width: '85%' }, s.br5, s.mb2]}
									onPress={ () => {this.props.navigation.navigate('PsychoTest')}}
								/>
							</V>
						</V>
						<V style={[s.flx_i, s.pa2, {width: '100%'}]}>
							{ ((user.resume || {}).education_completed) && (user.experience >= 6) && <V style={[s.flx_i, s.aic, s.jcc]}><T type={'title'} style={[s.b]}>{`${LANG[lang].analysis}`}</T></V>}
							{ ((user.resume || {}).education_completed)
								? (user.experience < 6)
									? <V style={[s.flx_i, s.aic, s.jcc]}>
											<T style={[{fontSize: 12, lineHeight: 16, color: '#e5625c'}]}>{`${LANG[lang].profile_incomplete_for_ai}`}</T>
											<T style={[{fontSize: 12, lineHeight: 16, color: '#e5625c'}]}>{`${LANG[lang].experience_less_than_five}`}</T>
										</V>
									: <V style={[s.flx_i, s.aic, s.jcc]}><T>{`${LANG[lang].timely_update_resume}`}</T></V>
								: <V style={[s.flx_i, s.aic, s.jcc]}>
										<T style={[{fontSize: 12, lineHeight: 16, color: '#e5625c'}]}>{`${LANG[lang].profile_incomplete_for_ai}`}</T>
										<T style={[{fontSize: 12, lineHeight: 16, color: '#e5625c'}]}>{`${LANG[lang].profile_imcomplete_education}`}</T>
									</V>
							}
							<V style={[s.aic, s.pa1]}>
							{ ((user.resume || {}).education_completed) || (user.experience < 6)
								? <Button
									type={"OnMyGrad"}
									containerStyle={[s.br5, { width: '80%' }]}
									title={`${LANG[lang].check_report}`}
									onPress={() => {
										this.props.navigation.navigate('Analysis');
									}}
								/>
								: <Button
									type={"OnMyGrad"}
									containerStyle={[s.br5, { width: '80%' }]}
									title={`${LANG[lang].my_resume}`}
									onPress={() => {
										this.props.navigation.navigate('Resume');
									}}
								/>
							}
							</V>
						</V>
						<V style={[{ width: '100%', height: '100%', backgroundColor: '#ffffff' }, s.ph4, s.pb5]}>
							<TouchableWithoutFeedback onPress={() => {
								this.props.navigation.navigate('Bookmarks');
							}}>
								<V style={[s.flx_row, s.aic, s.pv2, { borderBottomWidth: 1, borderBottomColor: '#f3f3f3' }]}>
									<V style={[s.flx_i]}><T style={[{ color: '#919191' }]} type='title'>{LANG[lang].my_favourite}</T></V>
									<Icon style={[s.tr]} color='#919191' name={'ios-arrow-forward'} type={'ionicon'} />
								</V>
							</TouchableWithoutFeedback>
							<TouchableWithoutFeedback onPress={() => {
								this.props.navigation.navigate('History');
							}}>
								<V style={[s.flx_row, s.aic, s.pv2, styles.menuBtn]}>
									<V style={[s.flx_i]}><T style={[{ color: '#919191' }]} type='title'>{LANG[lang].history}</T></V>
									<Icon style={[s.tr]} color='#919191' name={'ios-arrow-forward'} type={'ionicon'} />
								</V>
							</TouchableWithoutFeedback>
							{/* <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('RelationShip')}>
								<V style={[s.flx_row, s.aic, s.pv2, styles.menuBtn]}>
									<V style={[s.flx_i]}><T style={[{ color: '#919191' }]} type='title'>{LANG[lang].friends}</T></V>
									<Icon style={[s.tr]} color='#919191' name={'ios-arrow-forward'} type={'ionicon'} />
								</V>
							</TouchableWithoutFeedback> */}
						</V>
					</V>
				</V>
			</ScrollView>
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
	menuBtn: { borderBottomWidth: 1, borderBottomColor: '#f3f3f3' }
})

export default MeScreen = connect(
	(state, props) => ({
		lang: state.app.lang,
		user: state.auth.user,
	}),
	(dispatch, props) => ({
		userCheckin: (cb) => dispatch(userActions.reqCheckin(cb)),
		reqUser: () => dispatch(authActions.reqUser())
	}),
)(Me)

