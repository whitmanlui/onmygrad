import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View as V, TouchableOpacity, StyleSheet, ScrollView, Image, FlatList } from 'react-native';
import { styles as s } from 'react-native-style-tachyons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import _ from 'lodash'
import { Card, Icon, Avatar } from 'react-native-elements'
import { Text as T, Button } from '@screens/SharedComponent/OnMyGradComponent'
import LANG from '@lang/lang'
import { actions as userActions } from '@reducer/userReducer'
import { FilterBtn, More2Btn } from '@screens/SharedComponent/IconBtn'
import { CustomIcon } from '@screens/SharedComponent/CustomIcon';
import { actions as authActions } from '@reducer/authReducer';
import { widths } from 'react-native-style-tachyons/lib/styles/widths';

const FriendsListBlk = (props) => {
	const { image, name, education, recordDatetime  } = props
	return <V style={[s.flx_i, s.flx_row, s.pa2, , { backgroundColor: '#ffffff' }]}>
		<Avatar size="medium" rounded icon={{ name: 'user', type: 'font-awesome' }} />
		<V style={[{ borderBottomWidth: 1, borderBottomColor: '#e1e1e1' }, s.flx_i, s.flx_row, s.pb2]}>
			<V style={[s.flx_i, s.mh2]}>
				<T type={'title'} style={[s.b]}>{name}</T>
				<T numberOfLines={1} ellipsizeMode={'tail'}>{education}</T>
        <V style={[s.flx_row, s.jcsb]}>
          <T>{recordDatetime}</T>
          <TouchableOpacity  onPress={()=>props.navigation.goBack()}>
            <V style={[s.asfe, s.ml2]}>
              <CustomIcon name="more-2" style={[{fontSize: 18, color: '#000000'}]} ></CustomIcon>
            </V>
          </TouchableOpacity>
        </V>
				
			</V>
			
		</V>
	</V>
}

const FriendsRecomListBlk = (props) => {
  const { image, name, education  } = props
  return <V style={[s.br3, s.ma2, s.pa2, { backgroundColor: '#ffffff' }]}>
      <TouchableOpacity  onPress={()=>props.navigation.goBack()}>
        <V style={[s.asfe]}>
          <CustomIcon name="cancel-y" style={[{fontSize: 18}]} ></CustomIcon>
        </V>
      </TouchableOpacity>
      <V style={[s.pa2, s.aic, {width: 120}]}>
        <Avatar size="medium" rounded icon={{ name: 'user', type: 'font-awesome' }} />
        <T type={'title'} style={[s.b, s.flx_i]}>{name}</T>
        <T numberOfLines={1} ellipsizeMode={'tail'}>{education}</T>
      </V>
    </V>
}

class FriendsScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: "Friends",
  })
  constructor(props) {
    super(props)
    this.state = { isVisible: false }
  }
  componentDidMount() {
    this.props.feedAll()
  }

  render() {
    const { lang, friendsList, friendsRecomList } = this.props
    return (<ScrollView>
      <V style={[ s.mv2, s.ph3, { backgroundColor: '#F1F1F1' }]}>
        <V style={[s.flx_row, s.mb1]}>
          <V style={[s.flx_i]}><T type={'title'}>{`${LANG[lang].you_may_know}`}</T></V>
          <V style={[s.flx_row, s.aife]}>
            <T style={[s.tr]}>{`${LANG[lang].show_all}`}</T>
            <CustomIcon name="see-more" style={[{ fontSize: 18, color: '#000000' }]} ></CustomIcon>
          </V>
        </V>

        <V style={[s.flx_row, s.flx_wrap, s.jcc]}>
          <FlatList
            contentContainerStyle={[s.asfe]}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            data={friendsRecomList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              //push your code
              return <FriendsRecomListBlk {...item} key={`fdrecom${index}`} navigation={this.props.navigation} />
            }}
          />
        </V>
        <V style={[s.flx_row, s.mb1]}>
          <V style={[s.flx_i]}><T type={'title'}>{`${LANG[lang].my_friends} (${friendsList.length})`}</T></V>
          <FilterBtn onPress={() => console.log("filter btn")} />
        </V>
      </V>
      <V stlye={[s.flx_i]}>
        <FlatList
					data={this.props.friendsList}
					keyExtractor={(item, index) => index.toString()}
					renderItem={({item, index}) => {
						//push your code
						return <FriendsListBlk {...item} navigation={this.props.navigation} lang={this.props.lang} />
					}}
				/>
      </V>
    </ScrollView>
    );
  }
}
//s.jcc, s.aic, s.ba, s.ma1, {width: 70, height: 70}, s.br2
const styles = StyleSheet.create({

})

export default Friends = connect(
  (state, props) => ({
    lang: state.app.lang,
    friendsList: state.user.friendsList,
    friendsRecomList: state.user.friendsRecomList
  }),
  (dispatch, props) => ({
    feedAll: () => {
      dispatch(userActions.reqFriendsList())
      dispatch(userActions.reqFriendsRecomList())
    }
  }),
)(FriendsScreen)
