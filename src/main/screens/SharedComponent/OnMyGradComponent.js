import React, { Component } from 'react'
import { View as V, Text as T, TouchableWithoutFeedback, Platform, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux';
import { styles as s } from 'react-native-style-tachyons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { Button as Btn, Icon } from 'react-native-elements'
import styles from '@lib/styles'
import LinearGradient from 'react-native-linear-gradient';

export const Text = (props) => {
	//type = title, content
	const { ellipsizeMode, numberOfLines, fontWeight } = props
	const type = props.type ? props.type : "normal"
	return <T
		allowFontScaling={false}
		style={[{
			fontFamily: Platform.OS == 'ios' ? `Noto Sans TC ${fontWeight ? 'Bold' : 'Regular'}` : `NotoSansTC${fontWeight ? '-Bold' : 'Regular'}`,
			fontSize: styles.fontSize[type],
			lineHeight: styles.lineHeight[type],
			color: styles.fontColor[type]
		},
		props.style]}
		ellipsizeMode={ellipsizeMode}
		numberOfLines={numberOfLines}
	>{props.children}</T>
}

export const Button = (props) => {
	const { iconName, iconType, type, title, onPress, containerStyle, disabled } = props
	let style = {
		btnText: '#808080',
		btnColor: 'transparent',
		borderWidth: 0
	}
	switch (type) {
		case 'OnMyGrad':
			style.btnText = styles.btnText
			style.btnColor = styles.btnColor
			break
		case 'OnMyGrad_re':
			style.btnText = styles.btnColor
			style.btnColor = 'transparent'
			break
		case 'ActiveTag':
			style.btnText = '#000000'
			style.btnColor = styles.btnColor
			style.borderWidth = 0
			break
		case 'InactiveTag':
			style.btnText = styles.btnColor
			style.btnColor = 'transparent'
			style.borderWidth = 1
			break

	}
	return <Btn
		icon={<Icon name={iconName}
			color={style.btnText}
			size={styles.fontSize.normal}
			type={iconType ? iconType : 'font-awesome'} />}
		containerStyle={[{ backgroundColor: style.btnColor, borderColor: style.btnText, borderWidth: style.borderWidth }, containerStyle]}
		title={title}
		titleStyle={{ color: style.btnText, fontSize: styles.fontSize.normal }}
		type="clear"
		onPress={onPress}
		disabled={disabled}
		/>
}
export const LinearBtn = (props) => {
	const { iconName, iconType, type, title, onPress, containerStyle } = props

	return <TouchableOpacity onPress={onPress} style={[containerStyle]}>
		<LinearGradient colors={['#fdda51', '#fca741']} style={[s.br5]} start={{x: 0, y: 0}} end={{x: 1, y: 0}} >
			<T allowFontScaling={false}
				style={[s.tc, {
					fontFamily: Platform.OS == 'ios' ? 'Noto Sans TC Regular' : 'NotoSansTCRegular',
					color: styles.btnText
				}, Platform.OS == 'ios' ? s.mv2:s.mh1]}
			>{title}</T>
		</LinearGradient>
	</TouchableOpacity>
}