import React from 'react'
import {
  //createSwitchNavigator,
  //createStackNavigator,
  //createBottomTabNavigator,
  createAppContainer,
} from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import {QuestionTopTabs, SocietyTopTabs, OpportunityTopTabs, MeTopTabs } from './ScreenNavigator'

import Login from '@screens/Login'
import WriteAnswer from '@screens/WriteAnswer'
import SignupChat from '@screens/SignupChat'
import SignupImage from '@screens/SignupImage'
import AppIntro from '@screens/AppIntro'
import Search from '@screens/Search'

import TabBar from './TabBar'
import CustomTabBar from './CustomTabBar';

const BottomTabs = createBottomTabNavigator({
  Question: {
    screen: QuestionTopTabs,
    navigationOptions: {
      tabBarIcon: ({tintColor}) => <TabBar index={0} color={tintColor} />,
      tabBarOptions:{
        activeTintColor: '#ffd926',
        showLabel: false
      }
    }
  },
  Society: {
    screen: SocietyTopTabs,
    navigationOptions: {
      tabBarIcon: ({tintColor}) => <TabBar index={1} color={tintColor} />,
      tabBarOptions:{
        activeTintColor: '#ffd926',
        showLabel: false
      }
    }
  },
  Opportunity: {
    screen: OpportunityTopTabs,
    navigationOptions: {
      tabBarIcon: ({tintColor}) => <TabBar index={2} color={tintColor} />,
      tabBarOptions:{
        activeTintColor: '#ffd926',
        showLabel: false
      }
    }
  },
  Me: {
    screen: MeTopTabs,
    navigationOptions: {
      tabBarIcon: ({tintColor}) => <TabBar index={3} color={tintColor} />,
      tabBarOptions:{
        activeTintColor: '#ffd926',
        showLabel: false
      }
    }
  }
},{
  tabBarComponent: props => <CustomTabBar {...props} />
})

const MainNavigator = createStackNavigator({
  BottomTabs: {
    screen: BottomTabs,
    navigationOptions: {
      header: null,
    },
  },
  Login,
  WriteAnswer,
  SignupChat,
  SignupImage,
  AppIntro,
  Search
},{
  mode: 'modal',
});
export default createAppContainer(MainNavigator);
