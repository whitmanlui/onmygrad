import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View as V, ScrollView, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { Text as T, Button } from '@screens/SharedComponent/OnMyGradComponent'
import LANG from '@lang/lang'
import _ from 'lodash'
import { styles as s } from 'react-native-style-tachyons'
import { actions as meActions } from '@reducer/meReducer'
import { Input } from 'react-native-elements';
import { BackBtn, CloseBtn } from '@screens/SharedComponent/IconBtn'

class ChangePwScreen extends Component {
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
		const { lang } = this.props
		this.props.navigation.setParams({
			title: LANG[lang].change_pw
		})
	
	}
	_post() {
		this.setState({error: false, cNewPwError: false, oldPwError: false})
		const {oldPw, newPw, cNewPw} = this.state
		if(oldPw && newPw && cNewPw){
			if(newPw != cNewPw){
				this.setState({cNewPwError: true})
			} else {
				this.props.updatePw(oldPw, cNewPw, (result)=>{
					result ? this.props.navigation.goBack() : this.setState({oldPwError: true})
				})
			}
		} else {
			this.setState({error: true})
		}
	}
	state = {
		oldPw: "",
		newPw: "",
		cNewPw: "" ,
		error: false,
		cNewPwError: false,
		oldPwError: false,
	}
	
	render() {
		const { lang } = this.props
		return (<ScrollView style={[s.ph1, {backgroundColor: '#F9F9F9', height: '100%'}]}>
			<V style={[s.flx_i, s.pa1]}>
				<T type={'title'}>{LANG[lang].old_pw}</T>
				<Input underlineColorAndroid={'rgba(0,0,0,0)'}
					onChangeText={(v)=>this.setState({oldPw: v})} 
					containerStyle={[s.ba, s.br3, s.mv2, {borderColor: '#ffd926'}]}
					inputContainerStyle={{ borderBottomWidth: 0 }}
					secureTextEntry={true}
				/>
				<V>
          {this.state.oldPwError?<T style={[{color:'red'}]}>{LANG[lang].err_old_pw}</T>:<T>{''}</T>}
        </V>
				<T type={'title'}>{LANG[lang].new_pw}</T>
				<Input underlineColorAndroid={'rgba(0,0,0,0)'}
					onChangeText={(v)=>this.setState({newPw: v})} 
					containerStyle={[s.ba, s.br3, s.mv2, {borderColor: '#ffd926'}]}
					inputContainerStyle={{ borderBottomWidth: 0 }}
					secureTextEntry={true}
				/>
				<V><T>{''}</T></V>
				<T type={'title'}>{LANG[lang].cnew_pw}</T>
				<Input underlineColorAndroid={'rgba(0,0,0,0)'}
					onChangeText={(v)=>this.setState({cNewPw: v})} 
					containerStyle={[s.ba, s.br3, s.mv2, {borderColor: '#ffd926'}]}
					inputContainerStyle={{ borderBottomWidth: 0 }}
					secureTextEntry={true}
				/>
				<V>
					{this.state.cNewPwError?<T style={[{color:'red'}]}>{LANG[lang].err_cnew_pw}</T>:<T>{''}</T>}
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


export default ChangePw = connect(
	(state, props) => ({
		lang: state.app.lang,
	}),
	(dispatch, props) => ({
		updatePw: (old_password, password, cb) => dispatch(meActions.reqUpdatePw(old_password, password, cb)),
	}),
)(ChangePwScreen)
