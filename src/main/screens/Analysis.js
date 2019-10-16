import React, { Component } from 'react';
import {
  SafeAreaView,
  View as V,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableHighlight,
  Platform,
  TouchableOpacity,
  Linking,
  ImageBackground
} from 'react-native';
import { connect } from 'react-redux';
import { styles as s } from 'react-native-style-tachyons';
import { BackBtn } from '@screens/SharedComponent/IconBtn'
import { Defs, LinearGradient, Stop, Path, Svg, G, Polyline, Text } from 'react-native-svg';
import { LineChart, Grid, YAxis, XAxis } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import _ from 'lodash';
import { Avatar, Icon, Slider, Card, Image } from 'react-native-elements';
import { Button, Text as T } from '@screens/SharedComponent/OnMyGradComponent';
import LANG from '@lang/lang';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { actions as meActions } from '@reducer/meReducer'

const industry_dic = {
  'bank':'銀行金融',
  'consumer':'消費品及服務',
  'business':'商業及專業服務',
  'conglomerate':'綜合企業、地產及建造業',
  'utility':'公共部門、能源及公用事業',
  'media':'電訊、多媒體及娛樂業',
  'industrial':'工業製品業',
  'logistics':'航空物流',
  'it':'資訊科技業',
}

const RadarChart = (props) => {
  const groups = [];
  const chartSize = 250;
  const viewboxsize = 300;
  const middleOfChart = (chartSize / 2).toFixed(4);
  let data = [];
  // const data = [
  //   { battery: 0.7, design: 1, useful: 0.9, speed: 0.67, weight: 0.8 },
  //   { battery: 0.6, design: 0.9, useful: 0.8, speed: 0.7, weight: 0.6 }
  // ];
  if (!_.isEmpty(props.userdata)){
    data.push(props.userdata);
  }

  if (props.jobData.hasOwnProperty('company')) {
    data.push(props.jobData.attribute)
  }

  // switch (props.job) {
  //   case 0:
  //     data.push(props.userdata.match_job_1.stat);
  //     break;
  //   case 1:
  //     data.push(props.userdata.match_job_2.stat);
  //     break;
  //   case 2:
  //     data.push(props.userdata.match_job_3.stat);
  //     break;
  //   default:
  //     data.push(props.userdata.match_job_1.stat); 
  //     break;
  // }
  const captions = Object.keys(data[0]); 
  const columns = captions.map((key, i, all) => {
    return {
      key,
      angle: (Math.PI * 2 * i) / all.length
    };
  });

  const polarToX = (angle, distance) => Math.cos(angle - Math.PI / 2) * distance;
  const polarToY = (angle, distance) => Math.sin(angle - Math.PI / 2) * distance;

  const pathDefinition = (points) => {
    let d = 'M' + points[0][0].toFixed(4) + ',' + points[0][1].toFixed(4);
    for (let i = 1; i < points.length; i++) {
      d += 'L' + points[i][0].toFixed(4) + ',' + points[i][1].toFixed(4);
    }
    return d + 'z';
  };

  const shape = columns => (chartData, i) => {
    const data = chartData;
    console.log(data)
    console.log(i)
    return (
      <Path
        key={`shape-${i}`}
        d={pathDefinition(
          columns.map(col => {
            const value = data[col.key];
            return [
              polarToX(col.angle, (value * chartSize) / 2),
              polarToY(col.angle, (value * chartSize) / 2)
            ];
          })
        )}
        stroke={ (i == 0 )? `#edc951` : `#51edb4`}
        fill={ (i == 0 )? `#edc951` : `#51edb4`}
        fillOpacity=".5"
      />
    );
  };

  const points = points => {
    return points
      .map(point => point[0].toFixed(4) + ',' + point[1].toFixed(4))
      .join(' ');
  };

  const axis = () => (col, i) => (
    <Polyline
      key={`poly-axis-${i}`}
      points={points([
        [0, 0],
        [polarToX(col.angle, chartSize / 2), polarToY(col.angle, chartSize / 2)]
      ])}
      stroke="#555"
      strokeWidth=".2"
    />
  );

  const caption = () => col => (
    <Text
      key={`caption-of-${col.key}`}
      x={polarToX(col.angle, (chartSize / 2) * 1).toFixed(4)-12}
      y={polarToY(col.angle, (chartSize / 2) * 1.08).toFixed(4)}
      fill="#444"
      fontWeight="400"
      textShadow="1px 1px 0 #fff"
    >
      {col.key}
    </Text>
  );

  groups.push(<G key={`group-axes`}>{columns.map(axis())}</G>);
  groups.push(<G key={`group-captions`}>{columns.map(caption())}</G>);
  groups.push(<G key={`groups}`}>{data.map(shape(columns))}</G>);
  
  return (
    <Svg
      width={chartSize}
      height={chartSize}
      viewBox={`-20 -20 ${chartSize+40} ${chartSize+40}`}
    >
      <G transform={`translate(${middleOfChart},${middleOfChart})`}>{groups}</G>
    </Svg>
    );
};

const RecommendToYou = (props) => {
	const { id, thumbnail, name } = props
	return <TouchableWithoutFeedback onPress={() => props.navigation.navigate('SocietyDetail', props)}>
		<V style={[s.br3, s.ma2, { backgroundColor: '#ffffff' }]}>
			<V style={[{ overflow: "hidden", borderTopLeftRadius: 7, borderTopRightRadius: 7, }]}>
				<Image
					source={{uri: thumbnail}}
					resizeMode={"contain"}
					style={{ width: 100, height: 100 }}
				/>
			</V>
			<V style={[s.pl2, s.pv1, s.flx_row, s.aic]}>
				<T style={[s.b, s.flx_i]}>{name}</T>
			</V>
		</V>
	</TouchableWithoutFeedback>
}

const HotCourseblk = (props) => {

  const {
    id,
    thumbnail,
    name,
    description,
    view_count,
    lecture_count,
    time,
    index,
    est_duration,
    level,
    lang
  } = props;

  toDisplayDuration = (seconds) => {
    if (seconds <= 60 ) {
      return `~1${LANG[lang].min}`
    } else {
      if (seconds / 60 >= 60) {
        return `${Math.round(seconds/3600)}${LANG[lang].hour} ${Math.round(seconds%3600/60)}${LANG[lang].min}`
      } else {
        return `${Math.round(seconds/60) }${LANG[lang].min}`
      }
    }
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        props.navigation.navigate('Course', { courseID: id, title: name });
      }}
    >
      <V style={[s.flx_i]}>
      <Card
        key={index}
        containerStyle={[styles.card, s.br3]}
        wrapperStyle={[s.flx_row]}
      >
        <Image
          source={{ uri: thumbnail }}
          containerStyle={[styles.imagecontainer, s.br3, s.br__left]}
          style={[styles.image]}
        />
        <V style={[s.flx_i, s.mh2, s.mv2]}>
          <V style={[s.mb1]}>
            <T style={[styles.hot_course_title]} numberOfLines={2} ellipsizeMode={`tail`}>{name}</T>
          </V>
          <V style={[s.mb1]}>
            <T style={[styles.hotcontent, s.mt1]} ellipsizeMode='tail' numberOfLines={2}>
              {description.replace(/(&nbsp;|<([^>]+)>)/ig, "")}
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
                containerStyle={[s.mr1, s.jcc]}
              />
              <T style={[styles.subinfo]}>
                {
                  view_count
                  ? `${view_count} ${LANG[lang].view_count}`
                  : `- ${LANG[lang].view_count}`
                }
              </T>
            </V>
            <V style={[s.flx_i, s.flx_row]}>
              <Icon
                name="clock-o"
                color="#a4a4a4"
                type="font-awesome"
                size={15}
                containerStyle={[s.ml3, s.mr1, s.jcc]}
              />
              <T style={[styles.subinfo]}>{this.toDisplayDuration(est_duration)}</T>
            </V>
            {/* <V>
              <Icon
                name='ellipsis-h'
                color='#a4a4a4'
                type='font-awesome'
                size={12}
                containerStyle={[s.mr1]}
              />
            </V> */}
          </V>
        </V>
      </Card>
      </V>
    </TouchableWithoutFeedback>
  );
};

const Questionblk = (props) => {
	const { user, thumbnail, title, content, like_count, answer_count, comment_count, tag_list, lang } = props
	return <TouchableOpacity onPress={() => props.navigation.navigate("QNA", { question: props })}>
		<V style={[s.mv1, s.pa2,  s.br2, {backgroundColor: '#FFFFFF'}]}>
			<V style={[s.flx_i, s.flx_row, s.aic]}>
				<Avatar
					rounded
					source={{uri: user ? user.thumbnail : null}}
					size="small"
					title={user ? user.name[0] : ''}
				/>
				<T style={[s.ml1]}>{user ? user.name : ''}</T>
			</V>
			<V style={[s.mv2]}>
				<T type={'title'} ellipsizeMode={'tail'} numberOfLines={3} style={[s.b]}>{title}</T>
				{/* <HTML
					html={content}
					imagesMaxWidth={Dimensions.get('window').width}
				/> */}
			</V>
			<V style={[s.flx_i, s.flx_row, s.aic]}>
				<V style={[s.flx_i]}><T type={'small'}>{`${like_count?like_count:0} ${LANG[lang].like}`}</T></V>
				<V style={[s.flx_i]}><T type={'small'}>{`${answer_count?answer_count:0} ${LANG[lang].answer}`}</T></V>
				{/* <More2Btn onPress={() => props.navigation.navigate("QNA", { question: props })} /> */}
			</V>
		</V>
	</TouchableOpacity>
}

const JobListItem = (props) => {
  const {name, compatibility, industry, company, attribute} = props

  return (
    <TouchableOpacity
      onPress={() => {
        props.selectProgram({name, compatibility, industry, company, attribute})
      }}
    >
      {(props.company.thumbnail !== "")
        ? <Image
            containerStyle={[s.ma1]}
            source={{ uri: company.thumbnail ? company.thumbnail : '' }}
            style={[{height: 80, width: 80}]}
            resizeMode={'contain'}
          />
        : <Avatar
            title={company.name[0]}
            containerStyle={[s.ma1, s.jcc, {height: 80, width: 80}]}
          />
      }
    </TouchableOpacity>
  )
}
class Analysis extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerLeft: <BackBtn navigation={navigation} />,
    title: "A.I.職能分析",
  });

  screenWidth = Dimensions.get('window').width;

  screenHeight = Dimensions.get('window').height + 80;

  constructor(props) {
    super(props);
    this.state = {
      page: 0,  
      analysisData: {},
      job: 0,
      loading: true,
      selectedJob: {},
      enableScrollViewScroll: true
    };
  }

  componentDidMount() {
    this.props.reqAnalysis( (result) => {
      this.setState({
        analysisData: result,
        loading: false
      })
    });
  }
  
  _selectedProgram = (selected) => {
    this.setState({
      selectedJob: selected
    })
    this.onEnableScroll(true)
  }

  _checkValidRadarChart(attr) {
    let count = 0
    Object.keys(attr).forEach((item) => {      
      if (attr[item] == 0 ) count++
    });
    return !(count > 3)
  }

  _goExternal = (website) => {
    Linking.canOpenURL(website).then(supported => {
      if (supported) 
        Linking.openURL(website);
    });
  }

  onEnableScroll = (value: boolean) => {
    this.setState({
      enableScrollViewScroll: value
    })
  }

  _renderJobList = () => {
    let job_list = []
    Object.keys(this.state.analysisData.job_list).forEach((item) => {      
      job_list.push(this.state.analysisData.job_list[item])
    })
    job_list = _.flatten(job_list)
    return <FlatList
      data={job_list}
      onTouchStart={() => {
        this.onEnableScroll(false)
      }}
      onMomentumScrollEnd={() => {
        this.onEnableScroll(true)
      }}
      onScrollEndDrag={() => {
        this.onEnableScroll(true)
      }}
      keyExtractor={item => item.id}
      renderItem={({ item, index }) => {
        //push your code
        return (
          <JobListItem {...item} selectProgram={this._selectedProgram} navigation={this.props.navigation}/>
        );
      }}
    />
  }

  _renderScoreLevel = () => {
    if (this.state.analysisData.compatibility >= 80) {
      return <T style={[{color: '#7ed321'}]}>{`${LANG[this.props.lang].compatibility_excellent}`}</T>
    } else if (this.state.analysisData.compatibility >= 50) {
      return <T style={[{color: '#ffd926'}]}>{`${LANG[this.props.lang].compatibility_good}`}</T>
    } else {
      return <T style={[{color: '#e5625c'}]}>{`${LANG[this.props.lang].compatibility_soso}`}</T>
    }
  }

  render(){
    const { lang } = this.props;
    const { analysisData, loading} = this.state;
    return (
      <SafeAreaView>
        <ScrollView
          nestedScrollEnabled={true}
          scrollEnabled={this.state.enableScrollViewScroll}
          style={[{backgroundColor: '#f7f7f7'}]}
        >
        { ((!loading) && analysisData.user_attr && analysisData.job_list && analysisData.compatibility)? 
          <V style={[{ flex: 1, backgroundColor: '#f7f7f7' }]}>
            <V style={{ backgroundColor: '#ffd926', position: 'absolute', width: '100%', height: 60 }}></V>
            <V style={[s.ph1, { alignItems: 'center' }]}>
              <V style={[{width: '95%', backgroundColor: '#ffffff'}, s.br2, s.pa2, s.mv2]}>
                <V style={[s.flx_i, s.pa2, s.jcc, s.aic]}>
                  <V>
                    <T style={[styles.point]} type={'title'} style={[{fontSize: 45, color: '#ffd926', lineHeight: 49}]}>{analysisData.compatibility}</T>
                  </V>
                  <V><T type={'title'} style={[{color: '#8f8f8f'}]}>{`${LANG[lang].omg_conso_point}`}</T></V>
                  <V>{this._renderScoreLevel()}</V>
                  {/* <V>
                    <T>{LANG[lang].average_score}</T>
                    <T>{`利害！你超越 ${Math.floor(analysisdata.percentile*100)}% 用戶`}</T>
                  </V> */}
                </V>
              </V>
              
              {/* at least 4 attr > 0, check if a radar graph can be formed */}
              <V style={[s.flx_i, s.aifs, s.mv2]}>
                <T type={'title'} style={[s.b]}>{`${LANG[lang].analysis} - ${LANG[lang].job_matching}`}</T>
              </V>
              { (this.state.analysisData && this._checkValidRadarChart(analysisData.user_attr))
                ? <V style={[s.flx_i, s.flx_row, {height: 450}]}>
                    <V style={[{flex:1}]}>
                      <V style={[s.jcc]}>
                        {this._renderJobList()}
                      </V>
                    </V>
                      <V style={[{flex: 3, backgroundColor: '#ffffff'}]}>
                        { (this.state.selectedJob.hasOwnProperty('company'))
                          ? <V>
                              <V style={[s.flx_row, s.pa1, {width: '100%'}]}> 
                                <V style={[s.pa1, s.jcc, s.aifs, {flex: 3, height: 60}]}>
                                  <T type='title' numberOfLines={3} ellipsizeMode={`tail`}>{`${this.state.selectedJob.name}`}</T>
                                </V>
                                <V style={[s.flx_i]}>
                                  { (this.state.selectedJob.hasOwnProperty('company'))
                                    ? (this.state.selectedJob.company.thumbnail !== "")
                                      ? <Image
                                            containerStyle={[s.ma1, {height: 60, width: 60}]}
                                            source={{ uri: this.state.selectedJob.company.thumbnail }}
                                            style={[{height: 60, width: 60}]}
                                            resizeMode={'contain'}
                                          />
                                      : <Avatar
                                          title={this.state.selectedJob.company.name[0]}
                                          containerStyle={[s.ma1, {height: 60, width: 60}]}
                                        />
                                    : <V style={[s.pa1]}></V>
                                  }
                                </V>                   
                              </V>
                              <V style={[s.pa1, {width: '100%'}]}>
                                <T>{`${this.state.selectedJob.company.name}`}</T>
                                <V style={[s.flx_row, s.mv2]}>
                                  <V style={[{ backgroundColor: '#f1f1f1' }, s.br5, s.ph2, s.mr1]}><T>{`${industry_dic[this.state.selectedJob.industry]}`}</T></V>
                                </V>
                              </V>
                              <V style={[s.pa1, s.aic, {backgroundColor: '#ffffff', width: '100%'}]}>
                                <RadarChart userdata={analysisData.user_attr} jobData={this.state.selectedJob} job={this.state.job}/>
                              </V>
                              <V style={[s.flx_i]}>
                                <V style={[s.flx_row, s.aic, s.pl2, {height: 18}]}><V style={[s.mr1, {backgroundColor: `#edc951`, width: 10, height: 10}]}></V><T>{`${LANG[lang].self}`}</T></V>
                                <V style={[s.flx_row, s.aic, s.pl2, {height: 18}]}><V style={[s.mr1, {backgroundColor: `#51edb4`, width: 10, height: 10}]}></V><T>{LANG[lang].selected_program}</T></V>
                              </V>
                            </V>
                          : <V style={[s.flx_i, s.jcc, s.aic]}><T type={'title'}>選擇職位開始分析</T></V>
                      }
                      </V>
                  </V>
                : <V style={[s.flx_i]}>
                    <ImageBackground
                      style={[s.jcc, s.aic, {width: 300, height: 300}]}
                      resizeMode={`cover`}
                      source={require('../../res/assets/blurred_radar_400.jpg')}
                    >
                      <V style={[s.jcc, s.aic, s.br3, {height: 100, backgroundColor: 'rgba(201, 201, 201, 0.8)'}]}>
                        <V style={[s.ma2]}><T>{`${LANG[lang].profile_incomplete_for_ai}`}</T></V>
                        <Button
                          type={"OnMyGrad"}
                          containerStyle={[{ width: '80%' }]}
                          title={`${LANG[lang].my_resume}`}
                          onPress={() => {
                            this.props.navigation.navigate('Resume');
                            }}
                        />
                      </V>
                    </ImageBackground>
                </V>
              }
              </V>
          </V>
        : <V style={[s.flx_i, s.jcc, s.aic, s.mv4, s.mh2]}>
          <T type="title">{LANG[lang].analysis_data_error}</T>
        </V>
      }
        <V style={[s.asc, s.mt3, { flex: 1, backgroundColor: '#ffffff', width: '95%'}]}>
          <V style={[s.flx_i, s.aifs, s.ma2]}>
            <T type={'title'} style={[s.b]}>{`${LANG[lang].recommend_to_you} - ${LANG[lang].question}`}</T>
          </V>
          <V>
            <FlatList
              scrollEnabled={false}
              data={this.state.analysisData.question}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => {
                //push your code
                return <Questionblk {...item} navigation={this.props.navigation} lang={lang}/>
              }}
            />
          </V>
          <V style={[s.flx_i, s.aifs, s.ma2]}>
            <T type={'title'} style={[s.b]}>{`${LANG[lang].recommend_to_you} - ${LANG[lang].society}`}</T>
          </V>
          <V style={[s.flx_row, s.flx_wrap, s.jcc]}>
            <FlatList
              scrollEnabled={false}
              contentContainerStyle={[s.asfe]}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              data={this.state.analysisData.circle}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => {
                //push your code
                return <RecommendToYou {...item} navigation={this.props.navigation} />
              }}
            />
          </V>
          <V style={[s.flx_i, s.aifs, s.ma2]}>
            <T type={'title'} style={[s.b]}>{`${LANG[lang].recommend_to_you} - ${LANG[lang].learning}`}</T>
          </V>
          <V style={[s.flx_i, s.jcc, s.mh2]}>
            <FlatList
              scrollEnabled={false}
              showsHorizontalScrollIndicator={false}
              data={this.state.analysisData.course}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => {
                //push your code
                return <HotCourseblk {...item} lang={lang} navigation={this.props.navigation} />
              }}
            />
          </V>
          
        </V>
      </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  point: {
    fontFamily: Platform.OS == 'ios' ? `Noto Sans TC Bold` : `NotoSansTC-Bold`,
  },
  shadowBtn: {
    backgroundColor: '#ffffff',
    shadowColor: '#e6e4ee',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.46,
    shadowRadius: 6.65,
    elevation: 7,
  },
  menuBtn: { borderBottomWidth: 1, borderBottomColor: '#f3f3f3' },
  imagecontainer: {
    width: 80,
    height: 80,
    overflow: 'hidden'
  },
  image: {
    height:85,
    width:85,
  },
  card: {
    borderColor: "transparent",
    shadowColor: '#ffffff',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    marginLeft: 0,
    marginRight: 0,
    marginTop: 5,
    marginBottom: 5,
    padding: 0
  },
  hot_course_title: {
    fontFamily: Platform.OS == 'ios' ? `Noto Sans TC Bold` : `NotoSansTC-Bold`,
    fontSize: 14,
    lineHeight: 16,
    color: '#323643'
  },
  hotcontent: {
    fontSize: 12,
		lineHeight: 14,
		color: '#323643'
  },
  imagecontainer: {
    width: 100,
    height: 130,
    overflow: 'hidden'
  },
  image: {
    height:130,
    width:105,
  },
});

export default (Analysis = connect(
  (state, props) => ({
    lang: state.app.lang,
    hotsCate: state.question.hotsCate,
  }),
  (dispatch, props) => ({
    reqAnalysis: (cb) => dispatch(meActions.reqAnalysis(cb))
  })
)(Analysis));
