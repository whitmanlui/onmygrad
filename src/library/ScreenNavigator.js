import React, { Component } from 'react';
import { View as V, TouchableOpacity } from 'react-native';
import { styles as s } from 'react-native-style-tachyons'
import { createStackNavigator } from 'react-navigation-stack';
import _ from 'lodash'
import { CustomIcon } from '@screens/SharedComponent/CustomIcon';

//import main screen
import QuestionScreen from '@mainscreens/QuestionScreen'
import SocietyScreen from '@mainscreens/SocietyScreen'
import OpportunityScreen from '@mainscreens/OpportunityScreen'
import MeScreen from '@mainscreens/MeScreen'

//import screen 
import Hots from '@screens/Hots';
import LatestQuestion from '@screens/LatestQuestion';
import ActivityScreen from '@screens/Activity';
import Learning from '@screens/Learning';
import QNA from '@screens/QNA';
import QuestionInput from '@screens/QuestionInput';
import Event from '@screens/Event';
import Course from '@screens/Course';
import Achievements from '@screens/Achievements';
import History from '@screens/History';
import Analysis from '@screens/Analysis';
import Chapter from '@screens/Chapter';
import LearnContent from '@screens/LearnContent';
import Search from '@screens/Search';
import NotiCenter from '@screens/NotiCenter';
import Quiz from '@screens/Quiz'
import Resume from '@screens/Resume'
import EditResume from '@screens/EditResume'
import Badges from '@screens/Badges'
import Bookmarks from '@screens/Bookmarks'
import PublicProfile from '@screens/PublicProfile'
import RelationShip from '@screens/RelationShipScreen'
import SettingScreen from '@screens/Setting'
import SocietyDetail from '@screens/SocietyDetail'
import Preview from '@screens/Preview'
import PsychoTest from '@screens/PsychoTest'
import SubmitFeedback from '@screens/SubmitFeedback'
import SingleAnswer from '@screens/SingleAnswer'
import ChangePw from '@screens/ChangePw'
import ChangeInfo from '@screens/ChangeInfo'

const screens = {
    Hots, LatestQuestion, ActivityScreen, Learning, QNA, QuestionInput, Event, Course, Achievements, History, Analysis, NotiCenter, Chapter, LearnContent, Quiz, Resume, EditResume, Badges, Bookmarks, PublicProfile,
    RelationShip, PsychoTest, SettingScreen, SocietyDetail, Preview, SubmitFeedback, SingleAnswer, ChangePw, ChangeInfo
}

export const QuestionTopTabs = createStackNavigator(
	_.assign({ QuestionScreen }, screens),
	{
		defaultNavigationOptions: ({ navigation }) => ({
			headerStyle: { backgroundColor: '#fff', elevation: 0 },
		})
	}
);
export const SocietyTopTabs = createStackNavigator(
	_.assign({ SocietyScreen }, screens),
	{
		defaultNavigationOptions: ({ navigation }) => ({
			headerStyle: { backgroundColor: '#fff', elevation: 0 },
		})
	}
);
export const OpportunityTopTabs = createStackNavigator(
	_.assign({ OpportunityScreen }, screens),
	{
		defaultNavigationOptions: ({ navigation }) => ({
			headerStyle: { backgroundColor: '#fff', elevation: 0 },
		})
	}
);

OpportunityTopTabs.navigationOptions = ({ navigation }) => {
	let tabBarVisible = true;
	if (navigation.state.index > 0) {
		tabBarVisible = false;
	}
	return {
		tabBarVisible,
	};
};

export const MeTopTabs = createStackNavigator(
	_.assign({ MeScreen }, screens),
	{
		defaultNavigationOptions: ({ navigation }) => ({
			headerStyle: { backgroundColor: '#fff', elevation: 0 },
			headerLeft: <TouchableOpacity
				onPress={() => navigation.pop()} >
				<CustomIcon name="back" style={[s.ml2, { fontSize: 26, color: '#ffd925' }]} ></CustomIcon>
			</TouchableOpacity>,
			headerRight: (<V></V>),
		})
	}
);

MeTopTabs.navigationOptions = ({ navigation }) => {
	let tabBarVisible = true;
	if (navigation.state.index > 0) {
		tabBarVisible = false;
	}
	return {
		tabBarVisible,
	};
};
