import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View as V, ScrollView, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { Text as T, Button } from '@screens/SharedComponent/OnMyGradComponent'
import LANG from '@lang/lang'
import _ from 'lodash'
import { Avatar, Badge  } from 'react-native-elements'
import { styles as s } from 'react-native-style-tachyons'
import { actions as meActions } from '@reducer/meReducer'
import { Input } from 'react-native-elements';
import { BackBtn, CloseBtn } from '@screens/SharedComponent/IconBtn'
import { CustomIcon } from '@screens/SharedComponent/CustomIcon';

class ChangeInfoScreen extends Component {
	static navigationOptions = ({ navigation }) => ({
		headerLeft: <BackBtn navigation={navigation} />,
		title: navigation.state.params && navigation.state.params.title,
		headerRight: navigation.state.params && navigation.state.params.headerRight,
		headerStyle: { borderBottomWidth: 0, elevation: 0, shadowOpacity: 0 }
	})
	constructor(props) {
		super(props)
	}
	componentDidMount() {
		const { lang, user } = this.props
		this.props.navigation.setParams({
			title: LANG[lang].change_pw
		})
		this.setState({username: user.name, headline: user.headline})
	}

	_post() {
		this.setState({error: false})
		const {username, headline} = this.state
		if(username){
			this.props.updateInfo(username, headline, (result)=>{
				this.props.navigation.goBack()
			})
		} else {
			this.setState({error: true})
		}
	}
	state = {
		username: "",
		headline: "",
		error: false,
	}
	
	render() {
		const { lang, user } = this.props
		return (<ScrollView style={[s.ph1, {backgroundColor: '#F9F9F9', height: '100%'}]}>
			<V style={[s.flx_i, s.pa1]}>
				<V style={[s.flx_i, s.aic, s.mv4]}>
					<TouchableOpacity onPress={()=>this.props.navigation.navigate('SignupImage', { isUpload: true })}>
						<V>
							<Avatar rounded source={{uri: user.thumbnail}} size="large" />
							<Badge
								value={<CustomIcon name="ask-add" style={[{fontSize: 18, color: "#ffd926"}]} ></CustomIcon>}
								containerStyle={{ position: 'absolute', bottom: -1, right: -1}}
								badgeStyle={{backgroundColor: '#F9F9F9' }}
							/>
						</V>
					</TouchableOpacity>
				</V>
				<T type={'title'}>{LANG[lang].username}</T>
				<Input underlineColorAndroid={'rgba(0,0,0,0)'}
					onChangeText={(v)=>this.setState({username: v})} 
					value={this.state.username}
					containerStyle={[s.ba, s.br3, s.mv2, {borderColor: '#ffd926'}]}
					inputContainerStyle={{ borderBottomWidth: 0 }}
				/>
				<T type={'title'} style={[s.mt3]}>{LANG[lang].my_headline}</T>
				<Input underlineColorAndroid={'rgba(0,0,0,0)'}
					onChangeText={(v)=>this.setState({headline: v})} 
					value={this.state.headline}
					containerStyle={[s.ba, s.br3, s.mv2, {borderColor: '#ffd926'}]}
					inputContainerStyle={{ borderBottomWidth: 0 }}
				/>
				<V>
					{this.state.error?<T style={[{color:'red'}]}>{LANG[lang].err_input_field}</T>:<T>{''}</T>}
        </V>
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


export default ChangeInfo = connect(
	(state, props) => ({
		lang: state.app.lang,
		user: state.auth.user,
	}),
	(dispatch, props) => ({
		updateInfo: (name, headline, cb)=> dispatch(meActions.reqUpdateMe(name, headline, cb))
	}),
)(ChangeInfoScreen)
