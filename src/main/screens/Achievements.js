import React, { Component } from 'react';
import {
  FlatList,
  SafeAreaView,
  View as V,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { Defs, LinearGradient, Stop } from 'react-native-svg';
import { LineChart, Grid, YAxis, XAxis } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import _ from 'lodash';
import { Avatar, Icon, Card, Image } from 'react-native-elements';
import { Button, Text as T } from '@screens/SharedComponent/OnMyGradComponent';
import { connect } from 'react-redux';
import { styles as s } from 'react-native-style-tachyons';
import LANG from '@lang/lang';

import History from '@screens/History';

import CustomHeaderComponent from '@screens/SharedComponent/CustomHeader';

const badgeDataArr = [
  { id: 1, icon: 'user', active: true },
  { id: 2, icon: 'user', active: false },
  { id: 3, icon: 'user', active: false },
  { id: 4, icon: 'user', active: false },
  { id: 5, icon: 'user', active: false },
];

const UserData = {
  login_day: 50,
  exp: [{
    value: 50,
    date: '12/7',
  },
  {
    value: 10,
    date: '12/8',
  },
  {
    value: 150,
    date: '12/9',
  },
  {
    value: 10,
    date: '12/10',
  },
  {
    value: 100,
    date: '12/11',
  },
  {
    value: 20,
    date: '12/12',
  },],
  benchmark: 100,
  ogpoint: 832,
  ogpointRank: 0.6,
  learning_time: 100,
  learning_rank: 0.8,
  interest: ['設計', '銀行金融', '工業製品業'],
};

const temphotcourse = [
  {index: 0, image: 'https://images.pexels.com/photos/207708/pexels-photo-207708.jpeg', title: '國際商務與行銷', content: '手把手教你六種國際商務與行銷的技巧。你永遠不會知道對手對一手牌是什麼?', level: '高級', view: '3023', time: '1時20分'},
  {index: 1, image: 'https://images.pexels.com/photos/207708/pexels-photo-207708.jpeg', title: '管理技巧的三個絕招', content: '手把手教你三種大公司都在使用的管理絕招！', level: '高級', view: '3023', time: '1時20分'},
  {index: 2, image: 'https://images.pexels.com/photos/207708/pexels-photo-207708.jpeg', title: '演講也是一門藝術！', content: '手把手教你六種國際商務與行銷的技巧。你永遠不會知道對手對一手牌是什麼?', level: '高級', view: '3023', time: '1時20分'},
  {index: 3, image: 'https://images.pexels.com/photos/207708/pexels-photo-207708.jpeg', title: '國際商務與行銷', content: '邀請來自美國哈佛知名講師教你如何運用技巧說出藝術!', level: '高級', view: '3023', time: '1時20分'},
  {index: 4, image: 'https://images.pexels.com/photos/207708/pexels-photo-207708.jpeg', title: '國際商務與行銷', content: '手把手教你六種國際商務與行銷的技巧。你永遠不會知道對手對一手牌是什麼?', level: '高級', view: '3023', time: '1時20分'},
  {index: 5, image: 'https://images.pexels.com/photos/207708/pexels-photo-207708.jpeg', title: '國際商務與行銷', content: '手把手教你六種國際商務與行銷的技巧。你永遠不會知道對手對一手牌是什麼?', level: '高級', view: '3023', time: '1時20分'},
  {index: 7, image: 'https://images.pexels.com/photos/207708/pexels-photo-207708.jpeg', title: '國際商務與行銷', content: '手把手教你六種國際商務與行銷的技巧。你永遠不會知道對手對一手牌是什麼?', level: '高級', view: '3023', time: '1時20分'},
]

const Badge = props => {
  const { icon, active } = props;
  return (
    <V style={[s.pa2]}>
      {active ? (
        <Avatar
          rounded
          icon={{ name: icon, type: 'font-awesome', color: '#ffd926' }}
          size="medium"
          overlayContainerStyle={{ backgroundColor: '#ffffff' }}
          containerStyle={{ borderColor: '#ffd926', borderWidth: 1 }}
        />
      ) : (
        <Avatar
          rounded
          icon={{ name: icon, type: 'font-awesome', color: '#b8b6b6' }}
          size="medium"
          overlayContainerStyle={{ backgroundColor: '#f1f1f1' }}
        />
      )}
    </V>
  );
};

const ExperienceBlk = (props) => {
  const { lang, userdata } = props;
  const GradientLine = () => {
    const data = userdata.exp;
    const xAxisHeight = 30;
    const contentInset = { top: 20, bottom: 20 };
    const Gradient = () => (
      <Defs key={'gradient'}>
        <LinearGradient id={'gradient'} x1={'0'} y={'0%'} x2={'100%'} y2={'0%'}>
          <Stop offset={'0%'} stopColor={'rgb(134, 65, 244)'} />
          <Stop offset={'100%'} stopColor={'rgb(66, 194, 244)'} />
        </LinearGradient>
      </Defs>
    );

    return (
      <V style={[s.flx_row, {height: 250}]}>
        <YAxis
          style={{ marginBottom: xAxisHeight }}
          data={data}
          yAccessor={ ({ item }) => item.value }
          contentInset={contentInset}
          svg={{
            fill: 'grey',
            fontSize: 10,
          }}
          numberOfTicks={10}
        />
        <V style={[s.flx_i]}>
          <LineChart
            style={[s.flx_i, { height: 200 }]}
            data={data}
            yAccessor={ ({ item }) => item.value }
            contentInset={{ top: 20, bottom: 20 }}
            svg={{
              strokeWidth: 2,
              stroke: 'url(#gradient)',
            }}
            curve={ shape.curveBasis}
          >
            <Grid />
            <Gradient />
          </LineChart>
          <XAxis
            data={data}
            formatLabel={(item) => item}
            xAccessor={ ({ item }) => item.date }
            numberOfTicks={ 6 }
            style={{ marginHorizontal: -10, height: xAxisHeight }}
            contentInset={{ left: 10, right: 10 }}
            svg={{ fontSize: 10, fill: 'black' }}
          />
        </V>
      </V>
    );
  };

  return (
    <V>
      <V style={[s.flx_row, s.mb1]}>
        <V style={[s.flx_i]}>
          <T type={'title'} style={[s.b]}>{`${LANG[lang].my_experience}`}</T>
        </V>
      </V>
      <V>
        <T type={'small'}>{LANG[lang].total_login_day}</T>
      </V>
      <V style={[s.flx_row]}>
        <T style={[styles.loginday, s.asfe]}>{userdata.login_day}</T>
        <T style={[s.asfe]}>{LANG[lang].day}</T>
        <V style={[s.absolute, s.right_0, s.flx_row, s.aic, s.asfe]}>
          <V style={[styles.explegend]}></V>
          <T>{LANG[lang].exp_gain}</T>
        </V>
      </V>
      <V>
        <GradientLine />
      </V>
    </V>
  );
};

const PointBlk = props => {
  const { lang, userdata } = props;

  const Taglist = props => {
    const { tag } = props;
    return (
      <V style={[styles.tag, s.br5, s.ba]}>
        <T style={[styles.tagtext]}>{tag}</T>
      </V>
    );
  };

  return (
    <V>
      <V
        style={[
          s.flx_row,
          s.pb3,
          s.mb1,
          { borderBottomWidth: 1, borderBottomColor: '#f3f3f3' },
        ]}
      >
        <V style={[s.flx_i]}>
          <V>
            <T type={'title'} style={[s.b]}>{`${LANG[lang].ongrad_point}`}</T>
          </V>
          <V>
            <T style={[styles.pointtitle]}>{userdata.ogpoint}</T>
          </V>
          <V>
            <T>{`${LANG[lang].all_ranking} ${userdata.ogpointRank * 100} %`}</T>
          </V>
        </V>
        <V style={[s.flx_i]}>
          <V>
            <T type={'title'} style={[s.b]}>{`${LANG[lang].learning_time}`}</T>
          </V>
          <V>
            <T style={[styles.pointtitle]}>{`${userdata.learning_time} ${
              LANG[lang].short_hour
            }`}</T>
          </V>
          <V>
            <T>{`${LANG[lang].all_ranking} ${userdata.learning_rank *
              100} %`}</T>
          </V>
        </V>
      </V>
      <V>
        <V style={[s.pv2]}>
          <T>{LANG[lang].my_interest}</T>
        </V>
        <V style={[s.flx_row, styles.tagcontainer]}>
          {_.map(userdata.interest, (v, i) => {
            return <Taglist tag={v} key={i} />;
          })}
        </V>
      </V>
    </V>
  );
};

const RecommendCourseBlk = (props) => {
  const { lang, events} = props;

  const HotCourseblk = (props) => {
    const {
      image,
      title,
      content,
      view,
      time,
      index,
      level,
    } = props;
  
    return (
        <V style={[styles.card, s.mb2, s.pt2, s.pb3]}>
          <V style={[styles.hotcardwrapper, s.flx_row]}>
            <Image
              source={{ uri: image }}
              containerStyle={[styles.imagecontainer, s.br3]}
              style={[styles.image]}
            />
            <V style={[styles.cardcontentconatiner, s.flx_i, s.mh2]}>
              <V style={[s.mb1]}>
                <T>{title}</T>
                <T style={[styles.hotcontent, s.mt1]} ellipsizeMode='tail' numberOfLines={1}>
                  {content}
                </T>
              </V>
              <V style={[s.flx_i, s.flx_row, s.aife]}>
                <V><T style={[styles.subinfo]}>{level}</T></V>
                <V style={[s.flx_i, s.flx_row]}>
                    <Icon
                      name="user-circle-o"
                      color="#a4a4a4"
                      type="font-awesome"
                      size={14}
                      containerStyle={[s.ml2, s.mr1, s.jcc]}
                    />
                    <T style={[styles.subinfo]}>{`${view} ${LANG[lang].view_count}`}</T>
                </V>
                <V style={[s.flx_i, s.flx_row]}>
                  <Icon
                    name="clock-o"
                    color="#a4a4a4"
                    type="font-awesome"
                    size={15}
                    containerStyle={[s.ml3, s.mr1, s.jcc]}
                  />
                  <T style={[styles.subinfo]}>{time}</T>
                </V>
                <V>
                  <Icon
                    name='ellipsis-h'
                    color='#a4a4a4'
                    type='font-awesome'
                    size={12}
                    containerStyle={[s.mr1]}
                  />
                </V>
              </V>
            </V>
          </V>
        </V>
    );
  };

  return (
    <V>
      <V style={[s.flx_row, s.mb1]}>
        <V style={[s.flx_i, s.jcc]}>
          <T type={'title'} style={[s.b]}>{`${LANG[lang].recommend_to_you}`}</T>
        </V>
        <V style={[s.flx_i, s.jcc]}>
          <T style={[s.tr]}>{`${LANG[lang].show_all} >`}</T>
        </V>
      </V>
      <V>
        {_.map(events, (v, i) => {
          return <HotCourseblk {...v} key={i} lang={lang}/>
        })}
      </V>
    </V>
  );
};

const AchievementBlk = (props) => {
  const { lang, navigation, userdata } = props;
  return (
    <ScrollView style={[s.pa3, {backgroundColor: '#f1f1f1'}]}>
      <V style={[s.pa3, s.mb2, {backgroundColor: '#ffffff', borderRadius: 6}]}>
        <ExperienceBlk {...this.props} lang={lang} userdata={userdata}/>
      </V>

      <V style={[s.mb2, s.pa3, {backgroundColor: '#ffffff', borderRadius: 6}]}>
        <V style={[s.flx_row]}>
          <V style={[s.flx_i, s.jcc]}>
            <T type={'title'} style={[s.b]}>{`${LANG[lang].my_badge}`}</T>
          </V>
          <V style={[s.flx_i, s.jcc]}>
            <T style={[s.tr]}>{`${LANG[lang].show_all} >`}</T>
          </V>
        </V>
        <V style={[s.flx_row]}>
          <FlatList
            contentContainerStyle={[s.asfe]}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            data={badgeDataArr}
            keyExtractor={item => item.id}
            renderItem={({ item, index }) => {
              //push your code
              return <Badge {...item} key={index} navigation={navigation} />;
            }}
          />
        </V>
      </V>

      <V style={[s.pa3, s.mb2, {backgroundColor: '#ffffff', borderRadius: 6}]}>
        <PointBlk {...this.props} userdata={userdata} lang={lang} />
      </V>

      <V style={[s.pa3, s.mb2, {backgroundColor: '#ffffff', borderRadius: 6}]}>
        <RecommendCourseBlk {...this.props} lang={lang} events={temphotcourse}/>
      </V>
    </ScrollView>
  );
};

class AchievementsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <CustomHeaderComponent
          {...navigation}
          onPress={selectedIndex =>
            navigation.state.params.showPage(selectedIndex)
          }
          selectedIndex={0}
          buttons={['achievements', 'history']}
          pushPage={true}
        />
      ),
    };
  };

  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      page: 0,
      badgeData: badgeDataArr,
      userdata: UserData,
    };
  }

  componentWillMount() {
    this.props.navigation.setParams({
      showPage: selectedIndex => this.showPage(selectedIndex),
    });
  }

  componentDidMount() {
  }

  showPage(selectedIndex) {
    switch (selectedIndex) {
      case 0:
        this.scroll.scrollTo({ x: 0, y: 0, animated: true });
      case 1:
        this.scroll.scrollTo({
          x: selectedIndex * Dimensions.get('window').width,
          y: 0,
          animated: true,
        });
    }
  }

  render() {
    return (
      <SafeAreaView>
        <ScrollView
          horizontal={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          ref={node => (this.scroll = node)}
          /* onScroll={(event)=>{
          this.setState({page: _.ceil(event.nativeEvent.contentOffset.x / Dimensions.get('window').width)})
        }} */
          scrollEnabled={false}
          scrollEventThrottle={16}
        >
          <V style={[{ width: Dimensions.get('window').width }, s.flx_i]}>
            <AchievementBlk {...this.props} userdata={this.state.userdata} />
          </V>
          <V style={[{ width: Dimensions.get('window').width }, s.flx_i]}>
            <History {...this.props} />
          </V>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  tag: {
    backgroundColor: '#f1f2f3',
    borderColor: '#f1f2f3',
    margin: 2,
    paddingTop: 3,
    paddingBottom: 3,
    paddingRight: 8,
    paddingLeft: 8,
  },
  tagtext: {
    color: '#8d99a4',
    textTransform: 'uppercase',
  },
  pointtitle: {
    fontSize: 30,
    lineHeight: 40
  },
  loginday: {
    color: '#ffd926',
    fontSize: 40,
    lineHeight: 45
  },
  explegend: {
    width: 20,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#4072ee"
  },
  card: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee"
  },
  cardcontentconatiner: {
    height: 80,
  },
  hotcontent: {
    fontSize: 12,
    fontWeight: "300",
    lineHeight: 18,
    color: '#5a6169',
  },
  imagecontainer: {
    width: 80,
    height: 80,
    overflow: 'hidden'
  },
  image: {
    height:85,
    width:85,
  },
});

export default (Achievements = connect(
  (state, props) => ({
    lang: state.app.lang,
  }),
  (dispatch, props) => ({
  })
)(AchievementsScreen));
