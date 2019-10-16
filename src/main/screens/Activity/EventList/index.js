import React, { Component } from 'react';
import {
  View as V,
  ScrollView,
  Dimensions,
  TouchableWithoutFeedback,
  StyleSheet,
  FlatList,
  Platform
} from 'react-native';
import { Button, Text as T } from '@screens/SharedComponent/OnMyGradComponent';
import { styles as s } from 'react-native-style-tachyons';
import _ from 'lodash';
import moment from 'moment';
import momentHK from 'moment/src/locale/zh-hk' ;
import { Card, Icon, Avatar, Image } from 'react-native-elements';
import LANG from '@lang/lang';


const Taglist = (props) => {
  const {
    tag
  } = props;

  return (
    <V style={[styles.tag, s.br5, s.ba]}>
      <T type={'small'} style={[styles.tagtext]}>{tag}</T>
    </V>
  )
}

const Eventblk = (props) => {
  // const {
  //   image,
  //   name,
  //   content,
  //   location,
  //   start,
  //   id,
  //   tags,
  // } = props;
  const {
    id,
    name,
    location,
    start_time,
    end_time,
    tag_list,
    thumbnail,
    token,
  } = props;

  const company = props.company.name;

  ConvertDuration = (starttimestamp, endtimestamp) => {
    moment.locale('zh-hk', momentHK );
    const start_timestamp = moment.unix(starttimestamp)
    const end_timestamp = moment.unix(endtimestamp)

    if ((start_timestamp.month() === end_timestamp.month()) && (start_timestamp.year() === end_timestamp.year()) && (start_timestamp.date() === end_timestamp.date())) {
      return (`${start_timestamp.format("HH:mm")}-${end_timestamp.format("HH:mm")} ${start_timestamp.format("MMM")} ${start_timestamp.format("Do")}`)
    } else {
      return (`${start_timestamp.format("HH:mm MMM Do")} - ${end_timestamp.format("HH:mm MMM Do")}`)
    }
  };


  renderTagList = (tag_list) => {
    return _.map(tag_list, (v, i) => {
      return <Taglist tag={v} key={i}/>;
    });
  }

 
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        props.navigation.navigate('Event', { eventID: id, title: name })
      }}
    >
      <V style={[s.flx_i]}>
      <Card
        key={id}
        containerStyle={[styles.card, s.br3]}
        wrapperStyle={[s.h4, s.flx_row]}
      >
        <Image
          source={{ uri: thumbnail ? thumbnail : "https://ongradstorage1.blob.core.windows.net/testingdata/thumbnail_undraw_product_tour_foyt.png" }}
          containerStyle={[styles.imagecontainer, s.br3, s.br__left]}
          style={[styles.image]}
        />
        <V style={[s.flx_i, s.ma2]}>
          <V style={[s.mb1]}>
            <T style={[s.b, s.lh_copy, s.mb1, styles.event_company]} numberOfLines={2} ellipsizeMode={`tail`}>
              {company}
            </T>
            <T style={[styles.event_name]} numberOfLines={3} ellipsizeMode={`tail`}>{name}</T>
            <V style={[s.flx_row]}>
              {_.map(tag_list, (v, i) => {
                return <V key={`key${i}`} style={[{ backgroundColor: '#f1f1f1' }, s.br5, s.ph2, s.mr1]}><T>{v}</T></V>
              })}
					  </V>
          </V>
          <V style={[s.absolute, s.bottom_0, s.aic, s.o_36, s.aifs, {width: '90%'}]}>
            <V style={[s.flx_i, s.flx_row, s.pl1, s.pb1]}>
              <Icon
                name='map-marker'
                color='#a4a4a4'
                type='font-awesome'
                size={16}
                containerStyle={[s.mr1]}
              />
              <T style={[styles.subinfo]} numberOfLines={1} ellipsizeMode={`tail`}>{location}</T>
            </V>
            <V style={[s.flx_i, s.flx_row]}>
              <Icon
                name='calendar'
                color='#a4a4a4'
                type='font-awesome'
                size={14}
                containerStyle={[s.mr1]}
              />
              <T style={[styles.subinfo]}>{this.ConvertDuration(start_time, end_time)}</T>
            </V>
          </V>
        </V>
      </Card>
      </V>
    </TouchableWithoutFeedback>
  );
};

class EventList extends Component { 

  constructor(props) {
    super(props);
    this.viewabilityConfig = {
      waitForInteraction: true,
      viewAreaCoveragePercentThreshold: 99
    }
  }

  render() {
    const { lang, token } = this.props;
    return (
      <V>
        <V>
          <T style={[styles.title, s.mv2]}>{`${LANG[lang].all_activity} >`}</T>
        </V>
        <V>
          <FlatList
            renderItem={({item}) =>
              <Eventblk
                {...item}
                navigation={this.props.navigation}
                lang={this.props.lang}
              />
            }
            data={this.props.event}
            keyExtractor={(item) => item.id.toString()}
            initialNumToRender={8}
            removeClippedSubviews={true}
            viewabilityConfig={this.viewabilityConfig}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={500}
            token={token}
          />
          {/* {this.renderEventblk()} */}
        </V>
      </V>
    );
  }
}

// s.jcc, s.aic, s.ba, s.ma1, {width: 70, height: 70}, s.br2
const styles = StyleSheet.create({
  title: { color: "#000", fontWeight: 'bold' , fontSize: 16, lineHeight: 20},
  subTitle: { color: "#808080", fontSize: 12},
  card:{
    shadowColor: '#ffffff',
    borderColor: 'transparent',
    marginLeft: 0,
    marginRight: 0,
    marginTop: 5,
    marginBottom: 5,
    padding: 0
  },
  event_company: {
    fontFamily: Platform.OS == 'ios' ? `Noto Sans TC Bold` : `NotoSansTC-Bold`,
    fontSize: 14,
    lineHeight: 16,
    color: '#323643'
  },
  event_name: {
    fontSize: 12,
		lineHeight: 14,
		color: '#323643'
  },
  imagecontainer: {
    width: 100,
    backgroundColor: 'skyblue',
    overflow: 'hidden'
  },
  image: {
    height:160,
    width:100,
  },
  tag: {
    color: "#a4a4a4",
    borderColor: "#a4a4a4",
    margin: 2,
    paddingTop: 3,
    paddingBottom: 3,
    paddingRight: 8,
    paddingLeft: 8,
  },
  tagtext: {
    color: "#a4a4a4",
    textTransform: "uppercase",
    lineHeight: 10
  },
  subinfo: {
    color: "#a4a4a4",
  }
});


export default EventList;
