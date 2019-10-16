import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View as V, StyleSheet, SafeAreaView, Image, FlatList, Dimensions, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text as T, Button, LinearBtn } from '@screens/SharedComponent/OnMyGradComponent'
import { styles as s } from 'react-native-style-tachyons'
import _ from 'lodash'
import { BackBtn } from '@screens/SharedComponent/IconBtn'
import LANG from '@lang/lang'
import ImagePicker from 'react-native-image-crop-picker';

import { actions as meActions } from '@reducer/meReducer'

class SignupImageScreen extends Component {
	static navigationOptions = ({ navigation }) => ({
		headerLeft: navigation.state.params.isUpload ? <BackBtn navigation={navigation} /> : null,
		title: '我的頭像',
		headerStyle: { borderBottomWidth: 0, elevation: 0, shadowOpacity: 0 }
	})
	state = {
		img: ""
	}


	renderImgInstruction(text) {
		return _.map(text, (v, i) =>
			<V key={i} style={[s.flx_row, s.aic, { width: '100%' }]}>
				<V style={[s.br5, s.mr1, { backgroundColor: '#ffd926', width: 8, height: 8 }]} />
				<T type={"title"}>{v}</T>
			</V>
		)
	}

	render() {
		const { lang } = this.props
		const {isUpload, img} = this.props.navigation.state.params
		return (<ScrollView>
			<V style={[s.flx_i, s.aic, s.mh4]}>
				
				<TouchableOpacity onPress={() => {
					ImagePicker.clean()
					ImagePicker.openPicker({
						includeBase64: true,
						width: 150,
						height: 150,
						cropping: true
					}).then(image => {
						this.setState({ img: `data:${image.mime};base64,${image.data}` })
					});
				}}>
					{isUpload ? <V style={[s.mt5, s.mb3]}>
						{this.state.img ? <Image source={{ uri: this.state.img }} style={styles.image} resizeMode="stretch" /> : 
						<Image source={{ uri: this.props.user.thumbnail }} style={styles.image} resizeMode="stretch" />/* <V style={styles.emptyImg} /> */}
					</V> : <V style={[s.mt5, s.mb3]}>
						{this.state.img ? <Image source={{ uri: this.state.img }} style={styles.image} resizeMode="stretch" /> : <V style={styles.emptyImg} /> }
					</V>}
					<V style={[s.mb5, s.aic]}>
						<T type="title">{LANG[lang].upload_profile_pic}</T>
					</V>
				</TouchableOpacity>
				<V style={[s.mb3, s.tc]}>
					{this.renderImgInstruction(LANG[lang].img_instruction)}
				</V>
				{isUpload ? <LinearBtn title={LANG[lang].upload}
					containerStyle={[{ width: '80%' }, s.ma3]}
					onPress={() => {
						this.props.uploadImage(this.state.img, (result)=>{
							result ? this.props.navigation.pop() : Alert.alert("", this.state.img ? "上傳失敗" : "請上傳頭像",[{text: "Ok", onPress: () => {alerted = false;}}], { cancelable: false})
						})
						
					}} /> : <LinearBtn title={LANG[lang].next_page}
					containerStyle={[{ width: '80%' }, s.ma3]}
					onPress={() => {
						this.props.uploadImage(this.state.img, (result)=>{
							this.props.navigation.navigate('AppIntro')
						})
					}} />
				}
			</V>
		</ScrollView>)
	}
}

const styles = StyleSheet.create({
	emptyImg: {
		width: 250,
		height: 250,
		borderRadius: 250 / 2,
		backgroundColor: 'grey'
	},
	image: {
		width: 250,
		height: 250,
		borderRadius: 250 / 2,
	},
})

export default SignupImage = connect(
	(state, props) => ({
		lang: state.app.lang,
		user: state.auth.user,
		token: state.auth.token
	}),
	(dispatch, props) => ({
		uploadImage:(thumbnail_base64, cb)=> dispatch(meActions.reqUpdateMeThumbnail(thumbnail_base64, cb))
	}),
)(SignupImageScreen)

