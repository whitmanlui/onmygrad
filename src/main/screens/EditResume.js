import React, { Component } from 'react';
import { Alert,
				 SafeAreaView,
				 View as V,
				 ScrollView,
				 TouchableWithoutFeedback,
				 Dimensions,
				 FlatList,
				 StyleSheet,
				 Image,
				 TouchableHighlight,
				 TouchableOpacity,
				 Platform,
				 Picker
				} from 'react-native';
import { connect } from 'react-redux';
import { Header, Input } from 'react-native-elements'
import { styles as s } from 'react-native-style-tachyons'
import _ from 'lodash'
import { Avatar, Icon } from 'react-native-elements'
import ImagePicker from 'react-native-image-crop-picker';
import { Button, Text as T, LinearBtn } from '@screens/SharedComponent/OnMyGradComponent'
import DateTimePicker from "react-native-modal-datetime-picker";
import ModalSelector from 'react-native-modal-selector';
import { MoreBtn } from '@screens/SharedComponent/IconBtn';
import moment from 'moment';
import momentHK from 'moment/src/locale/zh-hk' ;
import LANG from '@lang/lang'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { actions as meActions } from '@reducer/meReducer'
import { isNumericLiteral, isGenericTypeAnnotation, bigIntLiteral } from '@babel/types';

FormatDate = (timestamp) => {
	moment.locale('zh-hk', momentHK);
	 if (moment(timestamp).isValid()) {
		return moment(timestamp).format('MMM Do YYYY');
	 } else {
		 return "";
	 }
}

class EducationBlk extends Component {
	
	constructor(props) {
    super(props);
    this.state = {
			isStartDateTimePickerVisible: false,
			isEndDateTimePickerVisible: false
    };
  }

  showStartDateTimePicker = () => {
			this.setState({ isStartDateTimePickerVisible: true });
  };

  hideStartDateTimePicker = () => {
		this.setState({ isStartDateTimePickerVisible: false });
	};
	
  showEndDateTimePicker = () => {
		this.setState({ isEndDateTimePickerVisible: true });
};

	hideEndDateTimePicker = () => {
		this.setState({ isEndDateTimePickerVisible: false });
	};

  handleStartDatePicked = (date) => {
		console.log("A start date has been picked: ", date);
		this.props.handleChangeText(date, this.props.index, 'education', 'start_date');
		this.hideStartDateTimePicker();
	};
	
	handleEndDatePicked = (date) => {
		console.log("A end date has been picked: ", date);
		this.props.handleChangeText(date, this.props.index, 'education', 'end_date');
		this.hideEndDateTimePicker();
  };

	render() {
		const {
			index,
			type,
			institution,
			origin,
			faculty,
			name,
			start_date,
			end_date,
			gpa,
			gpa_max,
			thumbnail
		} = this.props;
	
		const { lang } = this.props;
		const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 50 : 60;
		return (
			<V style={[s.flx_i, s.flx_wrap,s.bb, s.pv3, {borderColor: '#ffd926'}]}>
				<TouchableOpacity
					style={[s.absolute, s.pa2, {zIndex: 999, right: 0, top:0}]}
					onPress={() => Alert.alert(
						LANG[lang].ask_sure_delete,
						LANG[lang].delete_cannot_recover,
						[
							{text: LANG[lang].confirm_delete, onPress: () => this.props.handleDeleteItem(index, 'education')},
							{
								text: LANG[lang].cancel,
								onPress: () => console.log('Cancel Pressed'),
								style: 'cancel',
							},
						],
						{cancelable: false}
						)
					}
				>
					<V><T>{`${LANG[lang].delete}`}</T></V>
				</TouchableOpacity>
				
				<V style={[s.flx_i, s.flx_wrap, s.jcc]}>
					<V style={[s.flx_i, s.flx_row]}>
						<V style={[s.flx_i, s.jcc]}><T>{`${LANG[lang].user_education_type}`}</T></V>
						<ModalSelector
							data={[
								{ key: 0, section: true, label: LANG[lang].non_degree_program},
								{ key: 1, label: LANG[lang].certificate_diploma, value: 'certificate_diploma' },
								{ key: 2, label: LANG[lang].high_dip_asso, value: 'high_dip_asso' },
								{ key: 3, label: LANG[lang].short_term_program, value: 'short_term_program' },
								{ key: 4, label: LANG[lang].exchange_study, value: 'exchange_study' },
								{ key: 5, section: true, label: LANG[lang].degree_program},
								{ key: 6, label: LANG[lang].bachelor, value: 'bachelor' },
								{ key: 7, label: LANG[lang].master, value: 'master' },
								{ key: 8, label: LANG[lang].doctor_phd, value: 'doctor_phd' },
								{ key: 9, label: LANG[lang].postdoc, value: 'postdoc' },
							]}
							initValue={[LANG[lang].please_select]}
							supportedOrientations={['portrait']}
							style={[{flex: 4}]}
							accessible={true}
							scrollViewAccessibilityLabel={'Scrollable options'}
							cancelButtonAccessibilityLabel={'Cancel Button'}
							overlayStyle={{ flex: 1, padding: '5%', justifyContent: 'center', backgroundColor: 'rgba(28,28,30,0.8)' }}
							onChange={(option) => this.props.handleChangeText(option.value, index, 'education', 'type')}
						>

							<Input
									inputStyle={[{fontSize: 16}]}
									containerStyle={[{flex: 4}]}
									editable={false}
									value={LANG[lang][type]}
								/>

						</ModalSelector>
					</V>
				</V>

				<V style={[s.flx_i, s.flx_wrap, s.jcc]}>
					<V style={[s.flx_i, s.flx_row]}>
						<V style={[s.flx_i, s.jcc]}><T>{`${LANG[lang].user_institution_origin}`}</T></V>

						<ModalSelector
							data={[
								{ key: 0, label: LANG[lang].hk, value: 'hk' },
								{ key: 1, label: LANG[lang].us, value: 'us' },
								{ key: 2, label: LANG[lang].gb, value: 'gb' },
								{ key: 3, label: LANG[lang].cn, value: 'cn' },
								{ key: 4, label: LANG[lang].au, value: 'au' },
								{ key: 5, label: LANG[lang].others, value: 'others' },
							]}
							initValue={LANG[lang].please_select}
							supportedOrientations={['portrait']}
							style={[{flex: 4}]}
							accessible={true}
							scrollViewAccessibilityLabel={'Scrollable options'}
							cancelButtonAccessibilityLabel={'Cancel Button'}
							overlayStyle={{ flex: 1, padding: '5%', justifyContent: 'center', backgroundColor: 'rgba(28,28,30,0.8)' }}
							onChange={(option) => this.props.handleChangeText(option.value, index, 'education', 'origin')}
						>
							<Input
								inputStyle={[{fontSize: 16}]}
								containerStyle={[{flex: 4}]}
								editable={false}
								value={LANG[lang][origin]}
							/>
						</ModalSelector>
					</V>
				</V>				
				{ (origin == 'hk') 
					? <V style={[s.flx_i, s.flx_wrap, s.jcc]}>
							<V style={[s.flx_i, s.flx_row]}>
								<V style={[s.flx_i, s.jcc]}><T>{`${LANG[lang].user_institution}`}</T></V>
								<ModalSelector
									data={[
										{ key: 0, label: LANG[lang].hku, value: 'hku' },
										{ key: 1, label: LANG[lang].cuhk, value: 'cuhk' },
										{ key: 2, label: LANG[lang].hkust, value: 'hkust' },
										{ key: 3, label: LANG[lang].cityu, value: 'cityu' },
										{ key: 4, label: LANG[lang].polyu, value: 'polyu' },
										{ key: 5, label: LANG[lang].bu, value: 'bu' },
										{ key: 6, label: LANG[lang].lingu, value: 'lingu' },
										{ key: 7, label: LANG[lang].hangseng, value: 'hangseng' },
										{ key: 8, label: LANG[lang].shueyan, value: 'shueyan' },
										{ key: 9, label: LANG[lang].openu, value: 'openu' },
										{ key: 10, label: LANG[lang].others, value: 'others' },
									]}
									initValue={LANG[lang].please_select}
									supportedOrientations={['portrait']}
									style={[{flex: 4}]}
									accessible={true}
									scrollViewAccessibilityLabel={'Scrollable options'}
									cancelButtonAccessibilityLabel={'Cancel Button'}
									overlayStyle={{ flex: 1, padding: '5%', justifyContent: 'center', backgroundColor: 'rgba(28,28,30,0.8)' }}
									onChange={(option) => this.props.handleChangeText(option.value, index, 'education', 'institution')}
								>
									<Input
										inputStyle={[{fontSize: 16}]}
										containerStyle={[{flex: 4}]}
										editable={false}
										value={LANG[lang][institution]}
									/>
								</ModalSelector>
							</V>
						</V>
					: <V style={[s.flx_i, s.flx_wrap, s.jcc]}>
						<V style={[s.flx_i, s.flx_row]}>
							<V style={[s.flx_i, s.jcc]}><T>{`${LANG[lang].user_institution}`}</T></V>
							<Input
								inputStyle={[{fontSize: 16}]}
								containerStyle={[{flex: 4}]}
								value={institution}
								onChangeText={(text) => this.props.handleChangeText(text, index, 'education', 'institution')}
							/>
						</V>
					</V>
				}

				<V style={[s.flx_i, s.flx_wrap, s.jcc]}>
					<V style={[s.flx_i, s.flx_row]}>
						<V style={[s.flx_i, s.jcc]}><T>{`${LANG[lang].user_faculty}`}</T></V>
						<Input
							inputStyle={[{fontSize: 16}]}
							containerStyle={[{flex: 4}]}
							value={faculty}
							onChangeText={(text) => this.props.handleChangeText(text, index, 'education', 'faculty')}
						/>
					</V>
				</V>

				<V style={[s.flx_i, s.flx_wrap, s.jcc]}>
					<V style={[s.flx_i, s.flx_row]}>
						<V style={[s.flx_i, s.jcc]}><T>{`${LANG[lang].user_education_degree}`}</T></V>
						<Input
							inputStyle={[{fontSize: 16}]}
							containerStyle={[{flex: 4}]}
							value={name}
							onChangeText={(text) => this.props.handleChangeText(text, index, 'education', 'name')}
						/>
					</V>
				</V>

				<V style={[s.flx_i, s.flx_wrap, s.jcc]}>
					<V style={[s.flx_i, s.flx_row]}>
						<V style={[s.flx_i, s.jcc]}><T>{`${LANG[lang].start_date}`}</T></V>

						<TouchableOpacity
							style={[s.jcc, s.bb, {marginHorizontal: 10, borderColor: '#777777', flex: 4, minHeight: 40}]}
							onPress={() => this.showStartDateTimePicker()}
						>
							<T style={[{fontSize: 16, lineHeight: 22, color: '#000000'}]}>{`${FormatDate(start_date)}`}</T>
						</TouchableOpacity>
						<DateTimePicker
							isVisible={this.state.isStartDateTimePickerVisible}
							onConfirm={this.handleStartDatePicked}
							onCancel={this.hideStartDateTimePicker}
						/>
					</V>
				</V>


				<V style={[s.flx_i, s.flx_wrap, s.jcc]}>
					<V style={[s.flx_i, s.flx_row]}>
						<V style={[s.flx_i, s.jcc]}><T>{`${LANG[lang].end_date}`}</T></V>
						<TouchableOpacity
							style={[s.jcc, s.bb, {marginHorizontal: 10, borderColor: '#777777', flex: 4, minHeight: 40}]}
							onPress={()=>this.showEndDateTimePicker()}
						>
							<T style={[{ fontSize: 16, lineHeight: 22, color: '#000000'}]}>{`${FormatDate(end_date)}`}</T>
						</TouchableOpacity>
						<DateTimePicker
							isVisible={this.state.isEndDateTimePickerVisible}
							onConfirm={this.handleEndDatePicked}
							onCancel={this.hideEndDateTimePicker}
						/>

					</V>
				</V>


				<V style={[s.flx_i, s.flx_wrap, s.jcc]}>
					<V style={[s.flx_i, s.flx_row]}>
						<V style={[s.flx_i, s.jcc]}><T>{`${LANG[lang].study_result}`}</T></V>
						<Input
							inputStyle={[{fontSize: 16}]}
							containerStyle={[{flex: 4}]}
							value={gpa}
							onChangeText={(text) => this.props.handleChangeText(text, index, 'education', 'gpa')}
						/>
					</V>
				</V>


				<V style={[s.flx_i, s.flx_wrap, s.jcc]}>
					<V style={[s.flx_i, s.flx_row]}>
						<V style={[s.flx_i, s.jcc]}><T>{`${LANG[lang].study_result_max}`}</T></V>
						<Input
							inputStyle={[{fontSize: 16}]}
							containerStyle={[{flex: 4}]}
							value={gpa_max}
							onChangeText={(text) => this.props.handleChangeText(text, index, 'education', 'gpa_max')}
						/>
					</V>
				</V>
			</V>
		)
	}
}

class ExpBlk extends Component {

	constructor(props) {
    super(props);
    this.state = {
			isStartDateTimePickerVisible: false,
			isEndDateTimePickerVisible: false
    };
  }

  showStartDateTimePicker = () => {
			this.setState({ isStartDateTimePickerVisible: true });
  };

  hideStartDateTimePicker = () => {
		this.setState({ isStartDateTimePickerVisible: false });
	};
	
  showEndDateTimePicker = () => {
		this.setState({ isEndDateTimePickerVisible: true });
	};

	hideEndDateTimePicker = () => {
		this.setState({ isEndDateTimePickerVisible: false });
	};

  handleStartDatePicked = (date) => {
		console.log("A start date has been picked: ", date);
		this.props.handleChangeText(date, this.props.index, 'experience', 'start_date');
		this.hideStartDateTimePicker();
	};
	
	handleEndDatePicked = (date) => {
		console.log("A end date has been picked: ", date);
		this.props.handleChangeText(date, this.props.index, 'experience', 'end_date');
		this.hideEndDateTimePicker();
  };
	
	render() {
		const {
			index,
			name,
			organization,
			description,
			start_date,
			end_date
		} = this.props;
		
		const { lang } = this.props;

		return (
			<V style={[s.flx_i, s.flx_wrap,s.bb, s.pv3, {borderColor: '#ffd926'}]}>

			<TouchableOpacity
				style={[s.absolute, s.pa2, {zIndex: 999, right: 0, top:0}]}
				onPress={() => Alert.alert(
					LANG[lang].ask_sure_delete,
					LANG[lang].delete_cannot_recover,
					[
						{text: LANG[lang].confirm_delete, onPress: () => this.props.handleDeleteItem(index, 'experience')},
						{
							text: LANG[lang].cancel,
							onPress: () => console.log('Cancel Pressed'),
							style: 'cancel',
						},
					],
					{cancelable: false}
					)
				}
			>
					<V><T>{`${LANG[lang].delete}`}</T></V>
				</TouchableOpacity>

				<V style={[s.flx_i, s.flx_wrap, s.jcc]}>
					<V style={[s.flx_i, s.flx_row]}>
						<V style={[s.flx_i, s.jcc]}><T>{`${LANG[lang].exp_name}`}</T></V>
						<Input
							inputStyle={[{fontSize: 16}]}
							containerStyle={[{flex: 4}]}
							value={name}
							onChangeText={(text) => this.props.handleChangeText(text, index, 'experience', 'name')}
						/>
					</V>
				</V>

				<V style={[s.flx_i, s.flx_wrap, s.jcc]}>
					<V style={[s.flx_i, s.flx_row]}>
						<V style={[s.flx_i, s.jcc]}><T>{`${LANG[lang].exp_org}`}</T></V>
						<Input
							inputStyle={[{fontSize: 16}]}
							containerStyle={[{flex: 4}]}
							value={organization}
							onChangeText={(text) => this.props.handleChangeText(text, index, 'experience', 'organization')}
						/>
					</V>
				</V>

				<V style={[s.flx_i, s.flx_wrap, s.jcc]}>
					<V style={[s.flx_i, s.flx_row]}>
						<V style={[s.flx_i, s.jcc]}><T>{`${LANG[lang].brief_description}`}</T></V>
						<Input
							inputStyle={[{fontSize: 16}]}
							containerStyle={[{flex: 4}]}
							value={description}
							onChangeText={(text) => this.props.handleChangeText(text, index, 'experience', 'description')}
							maxLength={120}
							multiline={true}
							numberOfLines={4}
						/>
					</V>
				</V>

				<V style={[s.flx_i, s.flx_wrap, s.jcc]}>
					<V style={[s.flx_i, s.flx_row]}>
						<V style={[s.flx_i, s.jcc]}><T>{`${LANG[lang].start_date}`}</T></V>

						<TouchableOpacity
							style={[s.jcc, s.bb, {marginHorizontal: 10, borderColor: '#777777', flex: 4, minHeight: 40}]}
							onPress={() => this.showStartDateTimePicker()}
						>
							<T style={[{fontSize: 16, lineHeight: 22, color: '#000000'}]}>{`${FormatDate(start_date)}`}</T>
						</TouchableOpacity>
						<DateTimePicker
							isVisible={this.state.isStartDateTimePickerVisible}
							onConfirm={this.handleStartDatePicked}
							onCancel={this.hideStartDateTimePicker}
						/>
					</V>
				</V>

				<V style={[s.flx_i, s.flx_wrap, s.jcc]}>
					<V style={[s.flx_i, s.flx_row]}>
						<V style={[s.flx_i, s.jcc]}><T>{`${LANG[lang].end_date}`}</T></V>
						<TouchableOpacity
							style={[s.jcc, s.bb, {marginHorizontal: 10, borderColor: '#777777', flex: 4, minHeight: 40}]}
							onPress={()=>this.showEndDateTimePicker()}
						>
							<T style={[{ fontSize: 16, lineHeight: 22, color: '#000000'}]}>{`${FormatDate(end_date)}`}</T>
						</TouchableOpacity>
						<DateTimePicker
							isVisible={this.state.isEndDateTimePickerVisible}
							onConfirm={this.handleEndDatePicked}
							onCancel={this.hideEndDateTimePicker}
						/>
					</V>
				</V>
			</V>
		)
	}
}

class ProBlk extends Component {

	constructor(props) {
    super(props);
    this.state = {
			isStartDateTimePickerVisible: false,
    };
  }

  showStartDateTimePicker = () => {
		this.setState({ isStartDateTimePickerVisible: true });
  };

  hideStartDateTimePicker = () => {
		this.setState({ isStartDateTimePickerVisible: false });
	};
	

  handleStartDatePicked = (date) => {
		console.log("A start date has been picked: ", date);
		this.props.handleChangeText(date, this.props.index, 'professional', 'award_year');
		this.hideStartDateTimePicker();
	};
	
	render() {
		const {
			index,
			type,
			name,
			organization,
			description,
			award_year,
			thumbnail
		} = this.props;

		const { lang } = this.props;

		return (
			<V style={[s.flx_i, s.flx_wrap,s.bb, s.pv3, {borderColor: '#ffd926'}]}>
				<TouchableOpacity
					style={[s.absolute, s.pa2, {zIndex: 999, right: 0, top:0}]}
					onPress={() => Alert.alert(
						LANG[lang].ask_sure_delete,
						LANG[lang].delete_cannot_recover,
						[
							{text: LANG[lang].confirm_delete, onPress: () => this.props.handleDeleteItem(index, 'professional')},
							{
								text: LANG[lang].cancel,
								onPress: () => console.log('Cancel Pressed'),
								style: 'cancel',
							},
						],
						{cancelable: false}
						)
					}
				>
					<V><T>{`${LANG[lang].delete}`}</T></V>
				</TouchableOpacity>

				{/* <V style={[s.flx_i, s.flx_wrap, s.jcc]}>
					<V style={[s.flx_i, s.flx_row]}>
						<V style={[s.flx_i, s.jcc]}><T>{`${LANG[lang].professional_type}`}</T></V>
						<ModalSelector
							data={[
								{ key: 1, label: LANG[lang].banking_n_finance },
								{ key: 2, label: LANG[lang].consumer_goods_n_services },
								{ key: 3, label: LANG[lang].commercial_professional_services },
								{ key: 4, label: LANG[lang].conglomerates_properties_n_construction },
								{ key: 6, label: LANG[lang].public_sector_energy_utilities },
								{ key: 7, label: LANG[lang].telecommunications_media_entertainment },
								{ key: 8, label: LANG[lang].engineering_n_industrial_goods },
								{ key: 9, label: LANG[lang].logistics_n_aviation },
								{ key: 10, label: LANG[lang].information_technology },
							]}
							supportedOrientations={['portrait']}
							style={[{flex: 4}]}
							accessible={true}
							scrollViewAccessibilityLabel={'Scrollable options'}
							cancelButtonAccessibilityLabel={'Cancel Button'}
							overlayStyle={{ flex: 1, padding: '5%', justifyContent: 'center', backgroundColor: 'rgba(28,28,30,0.8)' }}
							onChange={(option) => this.props.handleChangeText(option.label, index, 'professional', 'type')}
						>

							<Input
									inputStyle={[{fontSize: 16}]}
									inputContainerStyle={{ padding: 0, borderBottomWidth: 0 }}
									editable={false}
									value={type}
								/>

						</ModalSelector>
					</V>
				</V> */}

				<V style={[s.flx_i, s.flx_wrap, s.jcc]}>
					<V style={[s.flx_i, s.flx_row]}>
						<V style={[s.flx_i, s.jcc]}><T>{`${LANG[lang].professional_name}`}</T></V>
						<Input
							inputStyle={[{fontSize: 16}]}
							containerStyle={[{flex: 4}]}
							value={name}
							onChangeText={(text) => this.props.handleChangeText(text, index, 'professional', 'name')}
						/>
					</V>
				</V>

				<V style={[s.flx_i, s.flx_wrap, s.jcc]}>
					<V style={[s.flx_i, s.flx_row]}>
						<V style={[s.flx_i, s.jcc]}><T>{`${LANG[lang].professional_organization}`}</T></V>
						<Input
							inputStyle={[{fontSize: 16}]}
							containerStyle={[{flex: 4}]}
							value={organization}
							onChangeText={(text) => this.props.handleChangeText(text, index, 'professional', 'organization')}
						/>
					</V>
				</V>

				<V style={[s.flx_i, s.flx_wrap, s.jcc]}>
					<V style={[s.flx_i, s.flx_row]}>
						<V style={[s.flx_i, s.jcc]}><T>{`${LANG[lang].brief_description}`}</T></V>
						<Input
							inputStyle={[{fontSize: 16}]}
							containerStyle={[{flex: 4}]}
							value={description}
							onChangeText={(text) => this.props.handleChangeText(text, index, 'professional', 'description')}
							maxLength={120}
							multiline={true}
							numberOfLines={4}
						/>
					</V>
				</V>

				<V style={[s.flx_i, s.flx_wrap, s.jcc]}>
					<V style={[s.flx_i, s.flx_row]}>
						<V style={[s.flx_i, s.jcc]}><T>{`${LANG[lang].award_year}`}</T></V>

						<TouchableOpacity
							style={[s.jcc, s.bb, {marginHorizontal: 10, borderColor: '#777777', flex: 4, minHeight: 40}]}
							onPress={() => this.showStartDateTimePicker()}
						>
							<T style={[{fontSize: 16, lineHeight: 22, color: '#000000'}]}>{`${award_year}`}</T>
						</TouchableOpacity>
						<DateTimePicker
							isVisible={this.state.isStartDateTimePickerVisible}
							onConfirm={this.handleStartDatePicked}
							onCancel={this.hideStartDateTimePicker}
						/>
					</V>
				</V>

			</V>
		)
	}
}

class WorkBlk extends Component {
	constructor(props) {
    super(props);
    this.state = {
			isStartDateTimePickerVisible: false,
			isEndDateTimePickerVisible: false
    };
  }

  showStartDateTimePicker = () => {
			this.setState({ isStartDateTimePickerVisible: true });
  };

  hideStartDateTimePicker = () => {
		this.setState({ isStartDateTimePickerVisible: false });
	};
	
  showEndDateTimePicker = () => {
		this.setState({ isEndDateTimePickerVisible: true });
	};

	hideEndDateTimePicker = () => {
		this.setState({ isEndDateTimePickerVisible: false });
	};

  handleStartDatePicked = (date) => {
		console.log("A start date has been picked: ", date);
		this.props.handleChangeText(date, this.props.index, 'workingExperience', 'start_date');
		this.hideStartDateTimePicker();
	};
	
	handleEndDatePicked = (date) => {
		console.log("A end date has been picked: ", date);
		this.props.handleChangeText(date, this.props.index, 'workingExperience', 'end_date');
		this.hideEndDateTimePicker();
  };
	
	render() {
		const {
			index,
			position,
			company,
			exp_industry,
			description,
			start_date,
			end_date
		} = this.props;
		
		const { lang } = this.props;

		return (
			<V style={[s.flx_i, s.flx_wrap,s.bb, s.pv3, {borderColor: '#ffd926'}]}>

			<TouchableOpacity
				style={[s.absolute, s.pa2, {zIndex: 999, right: 0, top:0}]}
				onPress={() => Alert.alert(
					LANG[lang].ask_sure_delete,
					LANG[lang].delete_cannot_recover,
					[
						{text: LANG[lang].confirm_delete, onPress: () => this.props.handleDeleteItem(index, 'workingExperience')},
						{
							text: LANG[lang].cancel,
							onPress: () => console.log('Cancel Pressed'),
							style: 'cancel',
						},
					],
					{cancelable: false}
					)
				}
			>
					<V><T>{`${LANG[lang].delete}`}</T></V>
				</TouchableOpacity>

				<V style={[s.flx_i, s.flx_wrap, s.jcc]}>
					<V style={[s.flx_i, s.flx_row]}>
						<V style={[s.flx_i, s.jcc]}><T>{`${LANG[lang].company_name}`}</T></V>
						<Input
							inputStyle={[{fontSize: 16}]}
							containerStyle={[{flex: 4}]}
							value={company}
							onChangeText={(text) => this.props.handleChangeText(text, index, 'workingExperience', 'company')}
						/>
					</V>
				</V>

				<V style={[s.flx_i, s.flx_wrap, s.jcc]}>
					<V style={[s.flx_i, s.flx_row]}>
						<V style={[s.flx_i, s.jcc]}><T>{`${LANG[lang].company_industry}`}</T></V>
						<ModalSelector
							data={[
								{ key: 1, label: LANG[lang].bank, value: 'bank' },
								{ key: 2, label: LANG[lang].consumer, value: 'consumer'},
								{ key: 3, label: LANG[lang].business, value: 'business' },
								{ key: 4, label: LANG[lang].property , value: 'property'},
								{ key: 6, label: LANG[lang].utility , value: 'utility'},
								{ key: 7, label: LANG[lang].media , value: 'media'},
								{ key: 8, label: LANG[lang].industrial , value: 'industrial'},
								{ key: 9, label: LANG[lang].logistics , value: 'logistics'},
								{ key: 10, label: LANG[lang].it , value: 'it'},
							]}
							supportedOrientations={['portrait']}
							style={[{flex: 4}]}
							accessible={true}
							scrollViewAccessibilityLabel={'Scrollable options'}
							cancelButtonAccessibilityLabel={'Cancel Button'}
							overlayStyle={{ flex: 1, padding: '5%', justifyContent: 'center', backgroundColor: 'rgba(28,28,30,0.8)' }}
							onChange={(option) => this.props.handleChangeText(option.value, index, 'workingExperience', 'exp_industry')}
						>

							<Input
									inputStyle={[{fontSize: 16}]}
									inputContainerStyle={{ padding: 0, borderBottomWidth: 0 }}
									editable={false}
									value={LANG[lang][exp_industry]}
							/>
						</ModalSelector>
					</V>
				</V>

				<V style={[s.flx_i, s.flx_wrap, s.jcc]}>
					<V style={[s.flx_i, s.flx_row]}>
						<V style={[s.flx_i, s.jcc]}><T>{`${LANG[lang].company_position}`}</T></V>
						<Input
							inputStyle={[{fontSize: 16}]}
							containerStyle={[{flex: 4}]}
							value={position}
							onChangeText={(text) => this.props.handleChangeText(text, index, 'workingExperience', 'position')}
						/>
					</V>
				</V>

				<V style={[s.flx_i, s.flx_wrap, s.jcc]}>
					<V style={[s.flx_i, s.flx_row]}>
						<V style={[s.flx_i, s.jcc]}><T>{`${LANG[lang].brief_description}`}</T></V>
						<Input
							inputStyle={[{fontSize: 16}]}
							containerStyle={[{flex: 4}]}
							value={description}
							onChangeText={(text) => this.props.handleChangeText(text, index, 'workingExperience', 'description')}
							maxLength={120}
							multiline={true}
							numberOfLines={4}
						/>
					</V>
				</V>

				<V style={[s.flx_i, s.flx_wrap, s.jcc]}>
					<V style={[s.flx_i, s.flx_row]}>
						<V style={[s.flx_i, s.jcc]}><T>{`${LANG[lang].start_date}`}</T></V>

						<TouchableOpacity
							style={[s.jcc, s.bb, {marginHorizontal: 10, borderColor: '#777777', flex: 4, minHeight: 40}]}
							onPress={() => this.showStartDateTimePicker()}
						>
							<T style={[{fontSize: 16, lineHeight: 22, color: '#000000'}]}>{`${FormatDate(start_date)}`}</T>
						</TouchableOpacity>
						<DateTimePicker
							isVisible={this.state.isStartDateTimePickerVisible}
							onConfirm={this.handleStartDatePicked}
							onCancel={this.hideStartDateTimePicker}
						/>
					</V>
				</V>

				<V style={[s.flx_i, s.flx_wrap, s.jcc]}>
					<V style={[s.flx_i, s.flx_row]}>
						<V style={[s.flx_i, s.jcc]}><T>{`${LANG[lang].end_date}`}</T></V>
						<TouchableOpacity
							style={[s.jcc, s.bb, {marginHorizontal: 10, borderColor: '#777777', flex: 4, minHeight: 40}]}
							onPress={()=>this.showEndDateTimePicker()}
						>
							<T style={[{ fontSize: 16, lineHeight: 22, color: '#000000'}]}>{`${FormatDate(end_date)}`}</T>
						</TouchableOpacity>
						<DateTimePicker
							isVisible={this.state.isEndDateTimePickerVisible}
							onConfirm={this.handleEndDatePicked}
							onCancel={this.hideEndDateTimePicker}
						/>
					</V>
				</V>
			</V>
		)
	}
}

class EditResumeScreen extends Component {

	static navigationOptions = ({ navigation }) => ({
		title: `編輯履歷`
	})

	constructor(props) {
    super(props);
    console.log(props);
		this.state = {
      personalInfo : _.omit(this.props.resume.resume, ['education', 'experience', 'working_experience','professional']),
      education: this.props.resume.resume.education,
      professional: this.props.resume.resume.professional,
      experience: this.props.resume.resume.experience,
			workingExperience: this.props.resume.resume.working_experience,
			editType: this.props.navigation.getParam('editPart', 'none'),
			isBirthdayTimePickerVisible: false,
    }
    console.log(this.state)
	}

	componentDidMount(){
		this.props.reqResume();
		// convert the resume information into the the desired form allowing validation
		// make each key-value to an object with keys: value,. type
  }

	handleChangeText = (text, index, changeitem, item) => {
		this.setState((prevState) => {
			console.log(prevState)
			const update = [...prevState[changeitem]]
			console.log(update)
			update[index][item] = text
			return { update }
		})
	}

	createNewItem = (changeitem) => {
		let temp = {};
		
		// temp object should fit validation type

		const edu_temp = {
			"institution": "",
			"origin": "",
			"faculty" : "",
			"name": "",
			"type": "",
			"start_date" : "",
			"end_date": "",
			"gpa" : "",
			"gpa_max" : "",
		};

		const exp_temp = {
			"name": "",
			"organization": "",
			"description": "",
			"start_date": "",
			"end_date": ""
		};

		const work_temp = {
			"position": "",
			"company": "",
			"description": "",
			"exp_industry": "",
			"start_date": "",
			"end_date": ""
		};

		const pro_temp = {
			"name": "",
			"organization": "",
			"description": "",
			"award_year": "",
		}

		switch (changeitem) {
			case 'education':
				temp = edu_temp;
				break;
			case 'experience':
				temp =  exp_temp;
				break;
			case 'workingExperience':
				temp = work_temp;
				break;
			case 'professional':
				temp = pro_temp;
				break;
			default:
				return "";
		}
		if (this.state[changeitem] === null || this.state[changeitem] === undefined || this.state[changeitem] === {} ) {
			this.setState({
				[changeitem]: [temp]
			})
		} else {
			this.setState({
				[changeitem]: [...this.state[changeitem], temp]
			})
		}
	}

	handleDeleteItem = (index, changeitem) => {
		console.log(this.state);
		if (this.state[changeitem].length === 1) {
			this.setState({
				[changeitem]: []
			})
		} else {
			this.setState((prevState) => ({
				[changeitem]: prevState[changeitem].filter((_, i) => i !== index)
			}))
		}
	}

  handleBirthdayDatePicked = (date) => {
		console.log("A start date has been picked: ", date);
		this.setState((prevState) => {
			let personalInfo = Object.assign({}, prevState.personalInfo)
			personalInfo.dob = date
			return { personalInfo }
		})
		this.hideBirthdayDateTimePicker();
	};

  showBirthdayDateTimePicker = () => {
		this.setState({ isBirthdayTimePickerVisible: true });
	};

	hideBirthdayDateTimePicker = () => {
		this.setState({ isBirthdayTimePickerVisible: false });
	};



	_renderEditEducationBlk() {
		const { education } = this.state;
		return _.map( education , (v, index) => {
      return <EducationBlk {...v} index={index} key={index} lang={this.props.lang} handleChangeText={this.handleChangeText} handleDeleteItem={this.handleDeleteItem}/>;
    });
	}

	_renderEditExpBlk() {
		const { experience } = this.state;
		return _.map( experience, (v, index) => {
      return <ExpBlk {...v} index={index} key={index} lang={this.props.lang} handleChangeText={this.handleChangeText} handleDeleteItem={this.handleDeleteItem}/>;
    });
	}

	_renderEditWorkBlk() {
		const { workingExperience } = this.state;
		return _.map( workingExperience, (v, index) => {
      return <WorkBlk {...v} index={index} key={index} lang={this.props.lang} handleChangeText={this.handleChangeText} handleDeleteItem={this.handleDeleteItem}/>;
    });
	}

	_renderEditProBlk() {
		const { professional } = this.state;
		return _.map( professional , (v, index) => {
      return <ProBlk {...v} index={index} key={index} handleChangeText={this.handleChangeText} handleDeleteItem={this.handleDeleteItem} lang={this.props.lang}/>;
    });
	}

	_submitChange() {
		let item;
		switch (this.state.editType) {
			case "editpersonal":
				item = {'profile': this.state.personalInfo}
				break;
			case "editeducation":
				item = {'education': this.state.education}
				console.log(item)
				break;
			case "editprofessional":
				item = {'professional': this.state.professional}
				break;
			case "editwork_experience":
				item = {'working_experience': this.state.workingExperience}
				break;
			case "editexperience":
				item = {'experience': this.state.experience}
				console.log(item)
				break;
			default:
				item = ''
		}
		// const empty = _.every(item, (element) => {
		// 	_.some(element, (value) => {return value === ""})
		// })
		let empty = false
		if (item.length > 0) {
			item[Object.keys(item)[0]].map((element) => {
				for (prop in element) {
					if (element[prop] === "") {
						empty = true
					}
				}
			})
		}
		if (!empty) {
			this.props.reqUpdateResume(item, (msg) => {
				if (msg === 'done') {
					this.props.navigation.goBack()
				} else {
					Alert.alert(
						LANG[this.props.lang].sth_went_wrong,
						msg,
						[
							{text: 'OK', onPress: () => this.props.navigation.goBack()},
						],
						{cancelable: false}
					)
				}
			})
		} else {
			Alert.alert(
				LANG[this.props.lang].sth_went_wrong,
				LANG[this.props.lang].fill_in_all,
				[
					{text: 'OK'},
				],
				{cancelable: false}
			)
		}
	}

	render() {
		const { lang } = this.props;
		const { personalInfo, editType } = this.state;
		const { height } =  Dimensions.get('window');

		return <SafeAreaView style={[{backgroundColor: '#f6f6f6'}]}>
			<ScrollView>
				<V style={[{ flex: 1, backgroundColor: '#f6f6f6', minHeight: height - 300}]}>
					<V style={{ backgroundColor: '#ffd926', position: 'absolute', width: '100%', height: 300 }}></V>
					<V style={[s.flx_i, s.aife, s.pa1]}>
						<Button
							containerStyle={[s.ba, s.br4, {backgroundColor: '#f6f6f6',borderColor: '#f6f6f6'}]}
							title={`完成`}
							onPress={() => this._submitChange()}
						/>
					</V>
					{ (editType === 'editpersonal') && <V style={[s.flx_i, s.aic, {width: '100%'}]}>
							{/* <V style={[s.pa2, s.aic, s.mb1]}>
								<Avatar
									source={{
										uri:
											(personalInfo.hasOwnProperty('thumbnail') && personalInfo.thumbnail.hasOwnProperty('mime'))
									  ? `data:${personalInfo.thumbnail.mime};base64,${personalInfo.thumbnail.data}`
										: personalInfo.thumbnail
									}}
									icon={{ name: 'user', type: 'font-awesome' }}
									showEditButton
									size="large"
									onPress={()=> {	
										ImagePicker.openPicker({
											width:400,
											height: 400,
											cropping: true,
											includeBase64: true
										}).then(image => {
											console.log(image)
											this.setState((prevState) => {
												let personalInfo = Object.assign({}, prevState.personalInfo)
												personalInfo.thumbnail = `data:${image.mime};base64,${image.data}`
												return { personalInfo }
											})
										})
									}}
								/>
							</V> */}
							<V style={[{ backgroundColor: '#ffffff', width: '95%'}, s.br2, s.pa2, s.mb2]}>
								<V style={[s.pa2]}>
									{/* <V style={[s.flx_row, s.mb1]}>
										<V><T type={'title'} style={[s.b]}>{`${LANG[lang].my_headline}`}</T></V>
									</V>
									<V style={[s.flx_wrap, s.mb2]}>
										<Input
											containerStyle={[{flex: 4}]}
											value={personalInfo.headline}
											maxLength={20}
											multiline={false}
											numberOfLines={1}
											onChangeText={(text) => this.setState((prevState) => {
												let personalInfo = Object.assign({}, prevState.personalInfo)
												personalInfo.headline = text
												return { personalInfo }
											}
											)}
										/>
									</V> */}

									<V style={[s.flx_row, s.mb1]}>
										<V><T type={'title'} style={[s.b]}>{`${LANG[lang].my_info}`}</T></V>
									</V>

									<V style={[s.flx_wrap, s.jcc]}>
										<V style={[s.flx_i, s.flx_row]}>
											<V style={[s.flx_i, s.jcc]}><T>{`${LANG[lang].user_firstname_eng}`}</T></V>
											<Input
												containerStyle={[{flex: 4}]}
												value={personalInfo.firstname}
												onChangeText={(text) => this.setState((prevState) => {
													let personalInfo = Object.assign({}, prevState.personalInfo)
													personalInfo.firstname = text
													return { personalInfo }
												}
												)}
											/>
										</V>
									</V>

									<V style={[s.flx_wrap, s.jcc]}>
										<V style={[s.flx_i, s.flx_row]}>
											<V style={[s.flx_i, s.jcc]}><T>{`${LANG[lang].user_lastname_eng}`}</T></V>
											<Input
												containerStyle={[{flex: 4}]}
												value={personalInfo.lastname}
												onChangeText={(text) => this.setState((prevState) => {
													let personalInfo = Object.assign({}, prevState.personalInfo)
													personalInfo.lastname = text
													return { personalInfo }
												}
												)}
											/>
										</V>
									</V>

									<V style={[s.flx_wrap, s.jcc]}>
										<V style={[s.flx_i, s.flx_row]}>
											<V style={[s.flx_i, s.jcc]}><T>{`${LANG[lang].user_lastname_chi}`}</T></V>
											<Input
												containerStyle={[{flex: 4}]}
												value={personalInfo.lastname_zh}
												onChangeText={(text) => this.setState((prevState) => {
													let personalInfo = Object.assign({}, prevState.personalInfo)
													personalInfo.lastname_zh = text
													return { personalInfo }
												}
												)}
											/>
										</V>
									</V>

									<V style={[s.flx_row, s.flx_wrap, s.jcc]}>
										<V style={[s.flx_i, s.flx_row]}>
											<V style={[s.flx_i, s.jcc]}><T>{`${LANG[lang].user_firstname_chi}`}</T></V>
											<Input
												containerStyle={[{flex: 4}]}
												value={personalInfo.firstname_zh}
												onChangeText={(text) => this.setState((prevState) => {
													let personalInfo = Object.assign({}, prevState.personalInfo)
													personalInfo.firstname_zh = text
													return { personalInfo }
												}
												)}
											/>
										</V>
									</V>


									<V style={[s.flx_wrap, s.jcc]}>
										<V style={[s.flx_i, s.flx_row]}>
											<V style={[s.flx_i, s.jcc]}><T>{`${LANG[lang].use_email}`}</T></V>
											<Input
												containerStyle={[{flex: 4}]}
												value={personalInfo.email}
												onChangeText={(text) => this.setState((prevState) => {
													let personalInfo = Object.assign({}, prevState.personalInfo)
													personalInfo.email = text
													return { personalInfo }
												}
												)}
											/>
										</V>
									</V>

									<V style={[s.flx_wrap, s.jcc]}>
										<V style={[s.flx_i, s.flx_row]}>
											<V style={[s.flx_i, s.jcc]}><T>{`${LANG[lang].phone_no}`}</T></V>
											<Input
												containerStyle={[{flex: 4}]}
												value={personalInfo.phone}
												onChangeText={(text) => this.setState((prevState) => {
													let personalInfo = Object.assign({}, prevState.personalInfo)
													personalInfo.phone = text
													return { personalInfo }
												}
												)}
											/>
										</V>
									</V>
							
									<V style={[s.flx_i, s.flx_wrap, s.jcc]}>
										<V style={[s.flx_i, s.flx_row]}>
											<V style={[s.flx_i, s.jcc]}><T>{`${LANG[lang].dob}`}</T></V>
											<TouchableOpacity
												style={[s.jcc, s.bb, {marginHorizontal: 10, borderColor: '#777777', flex: 4, minHeight: 40}]}
												onPress={()=>this.showBirthdayDateTimePicker()}
											>
												<T style={[{ fontSize: 16, lineHeight: 22, color: '#000000'}]}>{`${FormatDate(personalInfo.dob)}`}</T>
											</TouchableOpacity>
											<DateTimePicker
												isVisible={this.state.isBirthdayTimePickerVisible}
												onConfirm={this.handleBirthdayDatePicked}
												onCancel={this.hideBirthdayDateTimePicker}
											/>
										</V>
									</V>
								</V>
							</V>
					</V>}

					{ (editType === 'editeducation') && <V style={[s.flx_i, s.aic, {width: '100%'}]}>
						<V style={[{ backgroundColor: '#ffffff', width: '95%' }, s.br2, s.pa2, s.mb2]}>
							<V style={[s.pa2]}>
								<V style={[s.flx_row, s.mb1]}>
									<V style={[s.flx_i]}><T type={'title'} style={[s.b]}>{`${LANG[lang].my_education}`}</T></V>
								</V>
								<V style={[s.flx_i, s.pb2]}><T type={'normal'}>{`${LANG[lang].my_edu_instruction}`}</T></V>
								<V style={[s.flx_i]}>
									{this._renderEditEducationBlk()}
									<V style={[s.flx_i, s.jcc, s.aic]}>
										<TouchableOpacity
											onPress={() => this.createNewItem('education')}
										>
											<V style={[s.pa3]}><T>{`${LANG[lang].add_item}`}</T></V>
										</TouchableOpacity>
									</V>
								</V>
							</V>
						</V>
					</V>}

					{ (editType === 'editexperience') && <V style={[s.flx_i, s.aic, {width: '100%'}]}>
						<V style={[{ backgroundColor: '#ffffff', width: '95%' }, s.br2, s.pa2, s.mb2]}>
							<V style={[s.pa2]}>
								<V style={[s.flx_row, s.mb1]}>
									<V style={[s.flx_i]}><T type={'title'} style={[s.b]}>{`${LANG[lang].my_experience}`}</T></V>
								</V>
								<V style={[s.flx_i, s.pb2]}><T type={'normal'}>{`${LANG[lang].my_exp_instruction}`}</T></V>
								<V style={[s.flx_i]}>
									{this._renderEditExpBlk()}
									<V style={[s.flx_i, s.jcc, s.aic]}>
										<TouchableOpacity
											onPress={() => this.createNewItem('experience')}
										>
											<V style={[s.pa5]}><T>{`${LANG[lang].add_item}`}</T></V>
										</TouchableOpacity>
									</V>
								</V>
							</V>
						</V>
					</V>}

					{ (editType === 'editwork_experience') && <V style={[s.flx_i, s.aic, {width: '100%'}]}>
						<V style={[{ backgroundColor: '#ffffff', width: '95%' }, s.br2, s.pa2, s.mb2]}>
							<V style={[s.pa2]}>
								<V style={[s.flx_row, s.mb1]}>
									<V style={[s.flx_i]}><T type={'title'} style={[s.b]}>{`${LANG[lang].my_work}`}</T></V>
								</V>
								<V style={[s.flx_i, s.pb2]}><T type={'normal'}>{`${LANG[lang].my_work_instruction}`}</T></V>
								<V style={[s.flx_i]}>
									{this._renderEditWorkBlk()}
									<V style={[s.flx_i, s.jcc, s.aic]}>
										<TouchableOpacity
											onPress={() => this.createNewItem('workingExperience')}
										>
											<V style={[s.pa5]}><T>{`${LANG[lang].add_item}`}</T></V>
										</TouchableOpacity>
									</V>
								</V>
							</V>
						</V>
					</V>}

					{ (editType === 'editprofessional') && <V style={[s.flx_i, s.aic, {width: '100%'}]}>
						<V style={[{ backgroundColor: '#ffffff', width: '95%' }, s.br2, s.pa2, s.mb2]}>
							<V style={[s.pa2]}>
								<V style={[s.flx_row, s.mb1]}>
									<V style={[s.flx_i]}><T type={'title'} style={[s.b]}>{`${LANG[lang].my_professional}`}</T></V>
								</V>
								<V style={[s.flx_i, s.pb2]}><T type={'normal'}>{`${LANG[lang].my_pro_instruction}`}</T></V>
								<V style={[s.flx_i]}>
									{this._renderEditProBlk()}
									<V style={[s.flx_i, s.jcc, s.aic]}>
										<TouchableOpacity
											onPress={() => this.createNewItem('professional')}
										>
											<V style={[s.pa5]}><T>{`${LANG[lang].add_item}`}</T></V>
										</TouchableOpacity>
									</V>
								</V>
							</V>
						</V>
					</V>}

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

export default EditResume = connect(
	(state, props) => ({
		lang: state.app.lang,
		resume: state.me.resume,
	}),
	(dispatch, props) => ({
		reqResume: () => dispatch(meActions.reqResume()),
		reqUpdateResume: (item, cb) => dispatch(meActions.reqUpdateResume(item, cb))
	}),
)(EditResumeScreen)
