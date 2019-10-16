import { takeEvery, put, all, select, call, cancel, fork, take } from 'redux-saga/effects'
import update from 'immutability-helper'
import { fetchWithGet, fetchWithPost } from '@lib/helpers'
import _ from 'lodash'
//import AsyncStorage from '@react-native-community/async-storage';
//import dbstore from 'react-native-simple-store'

const REQ_USER_CHECKIN = 'REQ_USER_CHECKIN'
const REQ_FOLLOWING_REQUEST_LIST = 'REQ_FOLLOWING_REQUEST_LIST'
const SET_FOLLOWING_REQUEST_LIST = 'SET_FOLLOWING_REQUEST_LIST'
const REQ_FRIENDS_LIST = 'REQ_FRIENDS_LIST'
const SET_FRIENDS_LIST = 'SET_FRIENDS_LIST'
const REQ_FRIENDS_RECOM_LIST = 'REQ_FRIENDS_RECOM_LIST'
const SET_FRIENDS_RECOM_LIST = 'SET_FRIENDS_RECOM_LIST'
const REQ_FOLLOW_USER = 'REQ_FOLLOW_USER'
const REQ_CANCEL_REQUEST = 'REQ_CANCEL_REQUEST'
const REQ_REJECT_REQUEST = 'REQ_REJECT_REQUEST'
const REQ_ACCEPT_REQUEST = 'REQ_ACCEPT_REQUEST'
const REQ_UNFOLLOW = 'REQ_UNFOLLOW'

type Action = {
  type: typeof REQ_USER_CHECKIN,
} | {
  type: typeof REQ_FOLLOWING_REQUEST_LIST,
} | {
  type: typeof SET_FOLLOWING_REQUEST_LIST,
  followingReqList: any
} | {  
  type: typeof REQ_FRIENDS_LIST,
} | {
  type: typeof SET_FRIENDS_LIST,
  friendsList: any
} | {
  type: typeof REQ_FRIENDS_RECOM_LIST,
} | {
  type: typeof SET_FRIENDS_RECOM_LIST,
  friendsRecomList: any
} | {
  type: typeof REQ_FOLLOW_USER,
} | {
  type: typeof REQ_CANCEL_REQUEST,
} | {
  type: typeof REQ_REJECT_REQUEST,
} | {
  type: typeof REQ_ACCEPT_REQUEST,
}  | {
  type: typeof REQ_UNFOLLOW,
} 

type State = {
  followingReqList: any,
  friendsList: any,
  friendsRecomList: any
}
const initialState: State = {
  followingReqList: [],
  friendsList: [],
  friendsRecomList: []
}

const reqUserIn = (user_id) => ({type: REQ_USER_CHECKIN, user_id})
const reqFolloingReqList = () => ({type: REQ_FOLLOWING_REQUEST_LIST})
const setFolloingReqList = (list) => ({type: SET_FOLLOWING_REQUEST_LIST, list})

const reqFriendsList = () => ({type: REQ_FRIENDS_LIST})
const setFriednsList = (list) => ({type: SET_FRIENDS_LIST, list})

const reqFriendsRecomList = () => ({type: REQ_FRIENDS_RECOM_LIST})
const setFriendsRecomList = (list) => ({type: SET_FRIENDS_RECOM_LIST, list})

const followUser = (user_id) => ({type: REQ_FOLLOW_USER, user_id})
const cancelReq = (user_id) => ({type: REQ_CANCEL_REQUEST, user_id})
const rejectReq = (user_id) => ({type: REQ_REJECT_REQUEST, user_id})
const acceptReq = (user_id) => ({type: REQ_ACCEPT_REQUEST, user_id})
const unfollowUser = (user_id) => ({type: REQ_UNFOLLOW, user_id})


export const actions = { reqUserIn, reqFolloingReqList, reqFriendsList, reqFriendsRecomList, followUser, cancelReq, rejectReq, acceptReq, unfollowUser }

export const reducer = function(state: State = initialState, action: Action): State {
  switch (action.type) {
    case SET_FOLLOWING_REQUEST_LIST:
      return update(state, {followingReqList: {$set: action.list}})
    case SET_FRIENDS_LIST:
      return update(state, {friendsList: {$set: action.list}})
    case SET_FRIENDS_RECOM_LIST:
      return update(state, {friendsRecomList: {$set: action.list}})
  }
  return state
}

function* rqUserCheckin(action) {
  const { cb } = action
  const token = yield select(state=>state.auth.token)

  //fetch api here
  const result = yield fetchWithPost(`user/checkin`, {token} )
  //console.log(result)
  if(cb){
    cb(result)
  }
}

function* rqFollowingReqList(action) {
  const token = yield select(state=>state.auth.token)

  //fetch api here
  const result = yield fetchWithPost(`user/follow/request`, {token} )
  //console.log(result)
  const list = [
    { image: "", name: "Lui Whitman", education: "嶺南大學 - Marketing & Interasdfasdfasdfasdfasdfasdfafasfasfsa", requestDatetime: "30 分鐘前發出申請"}, 
    { image: "", name: "Chan Tai Man", education: "嶺南大學 - Marketing & Interasdfasdfasdfasdfasdfasdfafasfasfsa", requestDatetime: "30 分鐘前發出申請"}, 
    { image: "", name: "香港小甜甜布蘭尼", education: "嶺南大學 - Marketing & Interasdfasdfasdfasdfasdfasdfafasfasfsa", requestDatetime: "30 分鐘前發出申請"}, 
    { image: "", name: "Jim Haro", education: "嶺南大學 - Marketing & Interasdfasdfasdfasdfasdfasdfafasfasfsa", requestDatetime: "30 分鐘前發出申請"}, 
  ]
  yield put(setFolloingReqList(list))
  if(result.success){
    yield put(setFolloingReqList(result.content))
  }
}

function* rqFriendsList(action) {
  const token = yield select(state=>state.auth.token)

  //fetch api here
  const result = yield fetchWithPost(`user/follow/request`, {token} )
  //console.log(result)
  const list = [
    { image: "", name: "Lui Whitman", education: "Fd嶺南大學 - Marketing & Interasdfasdfasdfasdfasdfasdfafasfasfsa", recordDatetime: "1 個月前建立關係"}, 
    { image: "", name: "Chan Tai Man", education: "Fd嶺南大學 - Marketing & Interasdfasdfasdfasdfasdfasdfafasfasfsa", recordDatetime: "1 個月前建立關係"}, 
    { image: "", name: "香港小甜甜布蘭尼", education: "Fd嶺南大學 - Marketing & Interasdfasdfasdfasdfasdfasdfafasfasfsa", recordDatetime: "1 個月前建立關係"}, 
    { image: "", name: "Jim Haro", education: "Fd嶺南大學 - Marketing & Interasdfasdfasdfasdfasdfasdfafasfasfsa", recordDatetime: "1 個月前建立關係"}, 
    { image: "", name: "Jim Haro", education: "Fd嶺南大學 - Marketing & Interasdfasdfasdfasdfasdfasdfafasfasfsa", recordDatetime: "1 個月前建立關係"}, 
    { image: "", name: "Jim Haro", education: "Fd嶺南大學 - Marketing & Interasdfasdfasdfasdfasdfasdfafasfasfsa", recordDatetime: "1 個月前建立關係"}, 
    { image: "", name: "Jim Haro", education: "Fd嶺南大學 - Marketing & Interasdfasdfasdfasdfasdfasdfafasfasfsa", recordDatetime: "1 個月前建立關係"}, 
    { image: "", name: "Jim Haro", education: "Fd嶺南大學 - Marketing & Interasdfasdfasdfasdfasdfasdfafasfasfsa", recordDatetime: "1 個月前建立關係"}, 
  ]
  yield put(setFriednsList(list))
  if(result.success){
    yield put(setFriednsList(result.content))
  }
}

function* rqFriendsRecomList(action) {
  const token = yield select(state=>state.auth.token)

  //fetch api here
  const result = yield fetchWithPost(`user/follow/request`, {token} )
  //console.log(result)
  const list = [
    { image: "", name: "Lui Whitman", education: "Recom嶺南大學 - Marketing & Interasdfasdfasdfasdfasdfasdfafasfasfsa", recordDatetime: "1 個月前建立關係"}, 
    { image: "", name: "Chan Tai Man", education: "Recom嶺南大學 - Marketing & Interasdfasdfasdfasdfasdfasdfafasfasfsa", recordDatetime: "1 個月前建立關係"}, 
    { image: "", name: "香港小甜甜布蘭尼", education: "Recom嶺南大學 - Marketing & Interasdfasdfasdfasdfasdfasdfafasfasfsa", recordDatetime: "1 個月前建立關係"}, 
    { image: "", name: "Jim Haro", education: "Recom嶺南大學 - Marketing & Interasdfasdfasdfasdfasdfasdfafasfasfsa", recordDatetime: "1 個月前建立關係"}, 
  ]
  yield put(setFriendsRecomList(list))
  if(result.success){
    yield put(setFriendsRecomList(result.content))
  }
}

function* rqFollowUser(action) {
  const { user_id, cb } = action
  const token = yield select(state=>state.auth.token)
  const data = {
    user_id,
    ...token
  }
  //fetch api here
  const result = yield fetchWithPost(`user/follow`, data )
  //console.log(result)
  if(cb){
    cb(result)
  }
}

function* rqCancelReq(action) {
  const { user_id, cb } = action
  const token = yield select(state=>state.auth.token)
  const data = {
    user_id,
    ...token
  }
  //fetch api here
  const result = yield fetchWithPost(`user/follow/cancel`, data )
  //console.log(result)
  if(cb){
    cb(result)
  }
}

function* rqRejectReq(action) {
  const { user_id, cb } = action
  const token = yield select(state=>state.auth.token)
  const data = {
    user_id,
    ...token
  }
  //fetch api here
  const result = yield fetchWithPost(`user/follow/reject`, data )
  //console.log(result)
  if(cb){
    cb(result)
  }
}

function* rqAcceptReq(action) {
  const { user_id, cb } = action
  const token = yield select(state=>state.auth.token)
  const data = {
    user_id,
    ...token
  }
  //fetch api here
  const result = yield fetchWithPost(`user/follow/accept`, data )
  //console.log(result)
  if(cb){
    cb(result)
  }
}

function* rqUnfollow(action) {
  const { user_id, cb } = action
  const token = yield select(state=>state.auth.token)
  const data = {
    user_id,
    ...token
  }
  //fetch api here
  const result = yield fetchWithPost(`user/follow/unfollow`, data )
  //console.log(result)
  if(cb){
    cb(result)
  }
}

export const sagas = [
  function* (): any { yield takeEvery(REQ_USER_CHECKIN, rqUserCheckin) },
  function* (): any { yield takeEvery(REQ_FOLLOWING_REQUEST_LIST, rqFollowingReqList) },
  function* (): any { yield takeEvery(REQ_FRIENDS_LIST, rqFriendsList) },
  function* (): any { yield takeEvery(REQ_FRIENDS_RECOM_LIST, rqFriendsRecomList) },
  function* (): any { yield takeEvery(REQ_FOLLOW_USER, rqFollowUser) },
  function* (): any { yield takeEvery(REQ_CANCEL_REQUEST, rqCancelReq) },
  function* (): any { yield takeEvery(REQ_REJECT_REQUEST, rqRejectReq) },
  function* (): any { yield takeEvery(REQ_ACCEPT_REQUEST, rqAcceptReq) },
  function* (): any { yield takeEvery(REQ_UNFOLLOW, rqUnfollow) },
]
