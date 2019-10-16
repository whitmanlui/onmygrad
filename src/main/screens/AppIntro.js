import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View as V, StyleSheet, SafeAreaView, Image, FlatList, Dimensions } from 'react-native';
import { Text as T, Button, LinearBtn } from '@screens/SharedComponent/OnMyGradComponent'
import { styles as s } from 'react-native-style-tachyons'
import _ from 'lodash'
import { BackBtn } from '@screens/SharedComponent/IconBtn'
import LANG from '@lang/lang'
import LottieView from 'lottie-react-native';
import Carousel, { ParallaxImage, Pagination } from 'react-native-snap-carousel';

class AppIntroScreen extends Component {

	static navigationOptions = ({ navigation }) => ({
		headerLeft: <BackBtn navigation={navigation} />,
		title: '使用方法',
		headerStyle: { borderBottomWidth: 0, elevation: 0, shadowOpacity: 0 }
	})
	constructor(props) {
		super(props)
		this.state = {
			appAnimation: [
				require('../../../android/app/src/lottie_assets/OMG_animation1.json'),
				require('../../../android/app/src/lottie_assets/OMG_animation2.json'),
				require('../../../android/app/src/lottie_assets/OMG_animation3.json'),
				require('../../../android/app/src/lottie_assets/OMG_animation4.json'),
			],
			activeSlide: 0
		}
	}
	_renderItem({ item, index }) {
		return (
			<V style={[{ width: '100%' }, s.flx_i, s.jcc, s.aic]}>
				<V style={[s.flx_i, s.br3, { width: '95%' }]}>
					<LottieView source={item} autoPlay loop={true} />
				</V>
			</V>
		);
	}
	render() {
		const { lang } = this.props
		return (<SafeAreaView style={[s.flx_i, , s.jcc, s.aic, s.mh4]}>
			<Carousel
				ref={(c) => { this._carousel = c; }}
				data={this.state.appAnimation}
				renderItem={this._renderItem}
				sliderWidth={Dimensions.get('window').width}
				itemWidth={Dimensions.get('window').width}
				loop={true}
				onSnapToItem={(index) => this.setState({ activeSlide: index })}
			/>
			<Pagination
				dotsLength={this.state.appAnimation.length}
				activeDotIndex={this.state.activeSlide}
				dotColor={'#ffd926'}
				dotStyle={styles.activeDot}
				inactiveDotStyle={styles.inactiveDot}
				inactiveDotColor={'#000000'}
				inactiveDotOpacity={0.4}
				inactiveDotScale={0.6}
				carouselRef={this._carousel}
				tappableDots={!!this._carousel}
			/>
			{/* <V style={[{width: '100%'},s.flx_i, s.jcc, s.aic]}>
                <LottieView source={require('../../../android/app/src/lottie_assets/OMG_animation2.json')} autoPlay loop={false} />
            </V> */}
			<V style={[{ width: '100%' }, s.jcc, s.aic]}>
				<LinearBtn title={LANG[lang].start_use}
					containerStyle={[{ width: '80%' }, s.mb2]}
					onPress={() => this.props.navigation.popToTop()} />
			</V>
		</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	activeDot: { width: 25, height: 7 },
	inactiveDot: { width: 15, height: 7 },
	shadow: {
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowOpacity: 0.29,
		shadowRadius: 4.65,
		elevation: 7,
		marginLeft: 0,
		marginRight: 0,
		marginTop: 5,
		marginBottom: 5,
		paddingTop: 5,
		paddingBottom: 5,
		width: '95%'
	}
})

export default AppIntro = connect(
	(state, props) => ({
		lang: state.app.lang,
	}),
	(dispatch, props) => ({
	}),
)(AppIntroScreen)

