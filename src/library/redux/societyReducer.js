import { takeEvery, put, all, select, call, cancel, fork, take } from 'redux-saga/effects'
import update from 'immutability-helper'
import { fetchWithGet, fetchWithPost } from '@lib/helpers'
import _ from 'lodash'

const REQ_JOINED_SOCIETY = 'REQ_JOINED_SOCIETY'
const SET_JOINED_SOCIETY = 'SET_JOINED_SOCIETY'
const REQ_RECOMMENDATION_TO_YOU = 'REQ_RECOMMENDATION_TO_YOU'
const SET_RECOMMENDATION_TO_YOU  = 'SET_RECOMMENDATION_TO_YOU'
const REQ_HOTS_RECOMMEND = 'REQ_HOTS_RECOMMEND'
const SET_HOTS_RECOMMEND = 'SET_HOTS_RECOMMEND'
const REQ_SOCIETY_DETAIL = 'REQ_SOCIETY_DETAIL'

const SOCIETY_ACTIONS = 'SOCIETY_ACTIONS'
const SOCIETY_COMMENT_ACTIONS = 'SOCIETY_COMMENT_ACTIONS'
const SOCIETY_SUBCOMMENT_ACTIONS = 'SOCIETY_SUBCOMMENT_ACTIONS'

const GET_COMMENT_SOCIETY = 'GET_COMMENT_SOCIETY'
const GET_SUBCOMMENT_SOCIETY = 'GET_SUBCOMMENT_SOCIETY'

type Action = {
  type: typeof REQ_JOINED_SOCIETY,
} | {
  type: typeof SET_JOINED_SOCIETY,
  joinedsociety: any
} | {
  type: typeof REQ_RECOMMENDATION_TO_YOU ,
} | {
  type: typeof SET_RECOMMENDATION_TO_YOU ,
  recommendation: any
} | {
  type: typeof REQ_HOTS_RECOMMEND,
} | {
  type: typeof SET_HOTS_RECOMMEND,
  hotsRecommend: any
} | {
  type: typeof REQ_SOCIETY_DETAIL,
} | {
  type: typeof SOCIETY_ACTIONS,
} | {
  type: typeof SOCIETY_COMMENT_ACTIONS,
} | {
  type: typeof SOCIETY_SUBCOMMENT_ACTIONS,
} | {
  type: typeof GET_COMMENT_SOCIETY,
} | {
  type: typeof GET_SUBCOMMENT_SOCIETY,
}

type State = {
  joinedsociety: any,
  recommendation: any,
  hotsRecommend: any
}
const initialState: State = {
  joinedSociety: [],
  recommendation: [],
  hotsRecommend: []
}

const reqJoinedSociety = () => ({type: REQ_JOINED_SOCIETY})
const setJoinedSociety = (joinedSociety) => ({type: SET_JOINED_SOCIETY, joinedSociety})
const reqRecommendation = () => ({type: REQ_RECOMMENDATION_TO_YOU })
const setRecommendation = (recommendation) => ({type: SET_RECOMMENDATION_TO_YOU , recommendation})
const reqHotsRecommend = () => ({type: REQ_HOTS_RECOMMEND})
const setHotsRecommend = (hotsRecommend) => ({type: SET_HOTS_RECOMMEND, hotsRecommend})
const reqSocietyDetail= (societyId, cb) => ({type: REQ_SOCIETY_DETAIL, societyId, cb})

const reqSocietyActions = (actionType, circle_id, cb) => ({type: SOCIETY_ACTIONS, actionType, circle_id, cb})
const reqSocietyCommentActions = (actionType, circle_id, comment, comment_id, cb) => ({type: SOCIETY_COMMENT_ACTIONS, actionType, circle_id, comment, comment_id, cb})
const reqSocietySubCommentActions = (actionType, comment_id, comment, subcomment_id, cb) => ({type: SOCIETY_SUBCOMMENT_ACTIONS, actionType, comment_id, comment, subcomment_id, cb})

const reqSocietyComment = (circle_id, cb) => ({type: GET_COMMENT_SOCIETY, circle_id, cb})
const reqSocietySubComment = (comment_id, cb) => ({type: GET_SUBCOMMENT_SOCIETY, comment_id, cb})


export const actions = { 
  reqJoinedSociety, reqRecommendation, reqHotsRecommend, reqSocietyDetail,
  reqSocietyActions, reqSocietyCommentActions, reqSocietySubCommentActions,
  reqSocietyComment, reqSocietySubComment, 
}

export const reducer = function(state: State = initialState, action: Action): State {
  switch (action.type) {
    case SET_JOINED_SOCIETY:
      return update(state, {joinedSociety: {$set: action.joinedSociety}})
    case SET_RECOMMENDATION_TO_YOU :
      return update(state, {recommendation: {$set: action.recommendation}})    
    case SET_HOTS_RECOMMEND:
      return update(state, {hotsRecommend: {$set: action.hotsRecommend}})
  }
  return state
}

function* rqJoinedSociety(action) {
  const result = yield fetchWithPost(`user/circle/me`)
  console.log("circle/me", result)
  if((result||{}).success){
    const { content } = result 
    yield put(setJoinedSociety(content.circle))
  }
}

function* rqSocietyDetail(action) {
  const {societyId, cb} = action
  const result = yield fetchWithPost(`user/circle/${societyId}`)
  if((result||{}).success){
    const { content } = result  
    if(cb) cb(content)
  }
}

function* rqRecommendation(action) {
  const result = yield fetchWithPost(`user/circle`, {sorting: "recommend"})
  //console.log(result)
  if((result||{}).success){
    const { content } = result 
    yield put(setRecommendation(content.circle))
  }
}

function* rqHotsRecommend(action) {
  const result = yield fetchWithPost(`user/circle`, {sorting: "hot"})
  //console.log(result)
  if((result||{}).success){
    const { content } = result 
    yield put(setHotsRecommend(content.circle))
  }
}

//society action
function* rqSocietyActons(action){
  const { actionType, circle_id, cb} = action
  const result = yield fetchWithPost(`user/circle/${actionType}`, 
    {circle_id}
  )
  console.log(result)
  if((result||{}).success){
    yield put(reqRecommendation())
    yield put(reqHotsRecommend())
    const { content } = result 
    if(cb) cb(content)
  }
}

//comment action
function* rqSocietyComment(action){
  const { circle_id, cb } = action
  const result = yield fetchWithPost(`user/circle/comment`, {circle_id})
  console.log(result)
  if((result||{}).success){
    const { content } = result 
    if(cb) cb(content)
  }
}
function* rqSocietyCommentActions(action){
  const { actionType, comment_id, circle_id, comment, cb } = action
  const token = yield select(state=>state.auth.token)
  const result = yield fetchWithPost(`user/circle/comment/${actionType}`, 
    {comment_id, circle_id, comment}
  )
  console.log(result)
  if((result||{}).success){
    const { content } = result 
    if(cb) cb(content)
  }
}

//subcomment action
function* rqSocietySubComment(action){
  const { comment_id, cb } = action
  const token = yield select(state=>state.auth.token)
  const result = yield fetchWithPost(`user/circle/subcomment`, {comment_id})
  console.log(result)
  if((result||{}).success){
    const { content } = result 
    if(cb) cb(content)
  }
}
function* rqSocietySubCommentActions(action){
  const { actionType, comment_id, subcomment_id, comment, cb } = action
  const result = yield fetchWithPost(`user/circle/subcomment/${actionType}`, 
    {comment_id, subcomment_id, comment}
  )
  console.log(result)
  if((result||{}).success){
    const { content } = result 
    if(cb) cb(content)
  }
}

export const sagas = [
  function* (): any { yield takeEvery(REQ_JOINED_SOCIETY, rqJoinedSociety) },
  function* (): any { yield takeEvery(REQ_SOCIETY_DETAIL, rqSocietyDetail) },
  function* (): any { yield takeEvery(REQ_RECOMMENDATION_TO_YOU , rqRecommendation) },
  function* (): any { yield takeEvery(REQ_HOTS_RECOMMEND, rqHotsRecommend) },

  function* (): any { yield takeEvery(SOCIETY_ACTIONS, rqSocietyActons) },
  function* (): any { yield takeEvery(SOCIETY_COMMENT_ACTIONS, rqSocietyCommentActions) },
  function* (): any { yield takeEvery(SOCIETY_SUBCOMMENT_ACTIONS , rqSocietySubCommentActions) },

  function* (): any { yield takeEvery(GET_COMMENT_SOCIETY, rqSocietyComment) },
  function* (): any { yield takeEvery(GET_SUBCOMMENT_SOCIETY, rqSocietySubComment) },

]
