import { takeEvery, put, all, select, call, cancel, fork, take } from 'redux-saga/effects'
import update from 'immutability-helper'
import { fetchWithGet, fetchWithPost } from '@lib/helpers'


const REQ_ALL_EVENT = 'REQ_ALL_EVENT'
const SET_ALL_EVENT = 'SET_ALL_EVENT'
const REQ_SINGLE_EVENT = 'REQ_SINGLE_EVENT'
const SET_SINGLE_EVENT = 'SET_SINGLE_EVENT'
const REQ_RECOMMENDATION = 'REQ_RECOMMENDATION'
const SET_RECOMMENDATION  = 'SET_RECOMMENDATION'
const REQ_LIKE = 'REQ_LIKE'
const REQ_UNLIKE = 'REQ_UNLIKE'

type Action = {
  type: typeof REQ_ALL_EVENT,
} | {
  type: typeof SET_ALL_EVENT,
  allEvent: any
} | {
  type: typeof REQ_SINGLE_EVENT,
} | {
  type: typeof SET_SINGLE_EVENT,
  singleEvent: any
} | {
  type: typeof REQ_RECOMMENDATION,
} | {
  type: typeof SET_RECOMMENDATION,
  recommendation: any
} | {
  type: typeof REQ_LIKE,
} | {
  type: typeof REQ_UNLIKE,
} 

type State = {
  allEvent: any,
  recommendation: any,
  singleEvent: any,
}
const initialState: State = {
  allEvent: [],
  recommendation: [],
  singleEvent: {},
}

const reqAllEvent = (cb) => ({type: REQ_ALL_EVENT, cb})
const setAllEvent = (allEvent) => ({type: SET_ALL_EVENT, allEvent})
const reqRecommendation = () => ({type: REQ_RECOMMENDATION})
const setRecommendation = (recommendation) => ({type: SET_RECOMMENDATION, recommendation})
const reqSingleEvent = (eventID, cb) => ({type: REQ_SINGLE_EVENT, eventID, cb})
const setSingleEvent = (singleEvent) => ({type: SET_SINGLE_EVENT , singleEvent})
const reqLike = (cb) => ({type: REQ_LIKE, cb})
const reqUnlike = (cb) => ({type: REQ_UNLIKE, cb})


export const actions = { reqAllEvent, reqSingleEvent, reqRecommendation, reqLike, reqUnlike }

export const reducer = function(state: State = initialState, action: Action): State {
  switch (action.type) {
    case SET_ALL_EVENT:
      return update(state, {allEvent: {$set: action.allEvent}})
    case SET_SINGLE_EVENT:
      return update(state, {singleEvent: {$set: action.singleEvent}})
    case SET_RECOMMENDATION:
      return update(state, {recommendation: {$set: action.recommendation}})
  }
  return state
}

function* rqAllEvent(action) {
  const { cb } = action;
  const result = yield fetchWithPost(`user/event`, {id: 419, token: `Gn16w8aKsKef6SUUnUfG`})
  if ((result || {}).success) {
    const { content } = result
    yield put(setAllEvent(content.event))
    if (cb) {
      cb()
    }
  }
  //yield put(setUserList(user))
}

function* rqSingleEvent(action) {
  const { eventID, cb } = action;
  console.log(eventID);
  const result = yield fetchWithPost(`user/event/${eventID}`, {id: 419, token: `Gn16w8aKsKef6SUUnUfG`})
  console.log(result);
  if ((result || {}).success) {
    const { content } = result;
    yield put(setSingleEvent(content.event));
    if (cb) {
      cb(true);
    }
  }
  
  //fetch api here
  /* const prevToken = yield select(state=>state.auth.token)
  const result = yield fetchWithPost(`user/autologin`, prevToken )
  if(result.success){
    console.log(result)
  } */
}

function* rqRecommendation(action) {
  const recommendationData = [
    { image: "https://originalshrewsbury.co.uk/sites/default/files/styles/original_square_thumb/public/21950749_10155805627431133_2176523688727472824_o_0.jpg", company: "Company good", react_datetime: "2019-01-01T00:00:00Z", title: "Recruitment", content: "biggest recruitment event ever", tags: ['workshop', 'interview'], like: 10000, location: "Kwun Tong", start: "2019-01-01", end: "2019-01-01"},
    { image: "https://originalshrewsbury.co.uk/sites/default/files/styles/original_square_thumb/public/21950749_10155805627431133_2176523688727472824_o_0.jpg", company: "Company good", react_datetime: "2019-01-01T00:00:00Z", title: "Recruitment", content: "biggest recruitment event ever", tags: ['workshop', 'interview'], like: 10000, location: "Kwun Tong", start: "2019-01-01", end: "2019-01-01"},
    { image: "https://originalshrewsbury.co.uk/sites/default/files/styles/original_square_thumb/public/21950749_10155805627431133_2176523688727472824_o_0.jpg", company: "Company good", react_datetime: "2019-01-01T00:00:00Z", title: "Recruitment", content: "biggest recruitment event ever", tags: ['workshop', 'interview'], like: 10000, location: "Kwun Tong", start: "2019-01-01", end: "2019-01-01"},
    { image: "https://originalshrewsbury.co.uk/sites/default/files/styles/original_square_thumb/public/21950749_10155805627431133_2176523688727472824_o_0.jpg", company: "Company good", react_datetime: "2019-01-01T00:00:00Z", title: "Recruitment", content: "biggest recruitment event ever", tags: ['workshop', 'interview'], like: 10000, location: "Kwun Tong", start: "2019-01-01", end: "2019-01-01"},
    { image: "https://originalshrewsbury.co.uk/sites/default/files/styles/original_square_thumb/public/21950749_10155805627431133_2176523688727472824_o_0.jpg", company: "Company good", react_datetime: "2019-01-01T00:00:00Z", title: "Recruitment", content: "biggest recruitment event ever", tags: ['workshop', 'interview'], like: 10000, location: "Kwun Tong", start: "2019-01-01", end: "2019-01-01"}
  ]
  
  yield put(setRecommendation(recommendationData))
  //fetch api here
  /* const prevToken = yield select(state=>state.auth.token)
  const result = yield fetchWithPost(`user/autologin`, prevToken )
  if(result.success){
    console.log(result)
  } */
}

function* rqLike(action) {
  const { cb } = action;
  console.log(cb);
  const result = yield fetchWithPost(`user/event/like`, {})
  if ((result || {}).success) {
    if (result.content === 'success') {
      if (cb) {
        cb()
      }
    }
  }
}

function* rqUnlike(action) {
  const { cb } = action;
  console.log(cb);
  const result = yield fetchWithPost(`user/event/unlike`, {})
  if ((result || {}).success) {
    if (result.content === 'success') {
      if (cb) {
        cb()
      }
    }
  }
}


export const sagas = [
  function* (): any { yield takeEvery(REQ_ALL_EVENT, rqAllEvent) },
  function* (): any { yield takeEvery(REQ_SINGLE_EVENT, rqSingleEvent) },
  function* (): any { yield takeEvery(REQ_RECOMMENDATION, rqRecommendation) },
  function* (): any { yield takeEvery(REQ_LIKE, rqLike) },
  function* (): any { yield takeEvery(REQ_UNLIKE, rqUnlike) },
]
