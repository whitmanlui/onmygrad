import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View as V, StyleSheet, ScrollView, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import { Text as T, Button } from '@screens/SharedComponent/OnMyGradComponent'
import { styles as s } from 'react-native-style-tachyons'
import _ from 'lodash'
import { CloseBtn } from '@screens/SharedComponent/IconBtn'
import LANG from '@lang/lang'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import { actions as questionActions } from '@reducer/questionReducer'
import { Avatar } from 'react-native-elements'

class SearchScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    headerLeft: <CloseBtn navigation={navigation} />,
    headerRight: <Button
      title={'清除'} type={'OnMyGrad_re'} containerStyle={{ paddingRight: 15 }}
      onPress={() => { navigation.state.params.clearTxt() }}
    />,
    headerStyle: { borderBottomWidth: 0, elevation: 0, shadowOpacity: 0 }
  })
  constructor(props) {
    super(props)
    this.state = { data: [], text: "", active: "all" }
  }
  componentWillMount() {
    this.props.navigation.setParams({ clearTxt: () => this.setState({ text: "" }) })
  }
  componentDidMount(){
    if(this.props.navigation.state.params.category){
      const {category}=this.props.navigation.state.params
      this.props.searchByCate(category, (result)=>{
        this.setState({
          data: result.question,
          text: LANG[this.props.lang].search_industry + this.props.navigation.state.params.search_text
        })
      })
    }
  }

  _renderItem = ({ item }) => {
    const { user, title } = item 
    return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate("QNA", { question: item })}>
         <V style={[styles.result, s.mh2, s.pv2]}>
          <V style={[s.flx_i, s.flx_row, s.ml2, s.aic]}>
            <Avatar
              rounded
              source={{uri: user ? user.thumbnail : null}}
              size="small"
              title={user ? user.name[0] : ''}
            />
            <T style={[s.ml2]}>{user.name}</T>
            {/* <SimpleLineIcons name='clock' size={16} color={"#000000"} />
            <T style={[{ color: '#000000' }, s.ml2]}>{item.title}</T> */}
          </V>
          <V>
            <T style={[{ color: '#000000' }, s.ml2, s.mt2]}>{title}</T>
          </V>
        </V>
      </TouchableOpacity>
    );
  }
  render() {
    const { lang, search } = this.props
    return (<V style={[s.flx_i,]}>
      <V>
        <TextInput
          style={[styles.searchInput]}
          placeholder={LANG[lang].top_search}
          onChangeText={(text) => this.setState({ text })}
          value={this.state.text}
          onSubmitEditing={ () => search(this.state.text, (result)=>{
            this.setState({data: result.question})
          }) } 
        />
        {/* <V style={[s.flx_row, { padding: 15 }]}>
          <Button
            containerStyle={[s.mr1, s.br5, s.ph2]}
            title={LANG[lang].all} type={this.state.active == 'all' ? 'ActiveTag' : 'InactiveTag'}
            onPress={() => this.setState({ active: 'all' })}
          />
          <Button
            containerStyle={[s.mr1, s.br5, s.ph2]}
            title={LANG[lang].hots} type={this.state.active == 'hots' ? 'ActiveTag' : 'InactiveTag'}
            onPress={() => this.setState({ active: 'hots' })}
          />
          <Button
            containerStyle={[s.mr1, s.br5, s.ph2]}
            title={LANG[lang].news} type={this.state.active == 'news' ? 'ActiveTag' : 'InactiveTag'}
            onPress={() => this.setState({ active: 'news' })}
          />
        </V> */}
        {(this.state.data.length == 0)
          ? <V style={[s.jcc, s.aic, s.mt2]}><T type={'title'}>{`${LANG[lang].no_search_result}`}</T></V>
          : <FlatList
              contentContainerStyle={{ paddingBottom: 140}}
              data={this.state.data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={this._renderItem}
            />
        }
      </V>
    </V>
    );
  }
}

const styles = StyleSheet.create({
  searchInput: { borderBottomWidth: 1, borderBottomColor: '#ececec', padding: 15, fontSize: 16, color: '#000000' },
  result: { borderBottomWidth: 1, borderBottomColor: '#ececec' }
})

export default Search = connect(
  (state, props) => ({
    lang: state.app.lang,
  }),
  (dispatch, props) => ({
    search: (query, cb) => dispatch(questionActions.reqSearchQuestion(query, cb)),
		searchByCate: (category, cb) => dispatch(questionActions.reqQuestionByCategory(category, cb))
  }), 
)(SearchScreen)

