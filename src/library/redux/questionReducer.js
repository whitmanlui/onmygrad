import { takeEvery, put, all, select, call, cancel, fork, take } from 'redux-saga/effects'
import update from 'immutability-helper'
import { fetchWithGet, fetchWithPost } from '@lib/helpers'

const REQ_HOTS_CATE = 'REQ_HOTS_CATE'
const SET_HOTS_CATE = 'SET_HOTS_CATE'
const REQ_HOTS_ANSWER = 'REQ_HOTS_ANSWER'
const SET_HOTS_ANSWER = 'SET_HOTS_ANSWER'
const REQ_LATEST_QUESTION = 'REQ_LATEST_QUESTION'
const SET_LATEST_QUESTION = 'SET_LATEST_QUESTION'

const REQ_QUESTION_BY_ID = 'REQ_QUESTION_BY_ID'
const QUESTION_ACTIONS = 'QUESTION_ACTIONS'

const REQ_QUESTION_ANSWER = 'REQ_QUESTION_ANSWER'
const QUESTION_ANSWER_ACTIONS = 'QUESTION_ANSWER_ACTIONS'

const REQ_ANSWER_COMMENT = 'REQ_ANSWER_COMMENT'
const ANSWER_COMMENT_ACTIONS = 'ANSWER_COMMENT_ACTIONS'

const REQ_SEARCH_QUESTION = 'REQ_SEARCH_QUESTION'
const REQ_QUESTION_BY_CATEGORY = 'REQ_QUESTION_BY_CATEGORY'

type Action = {
  type: typeof REQ_HOTS_CATE,
} | {
  type: typeof SET_HOTS_CATE,
  hotsCate: any
} | {
  type: typeof REQ_HOTS_ANSWER,
} | {
  type: typeof SET_HOTS_ANSWER,
  hotsAnswer: any
} | {
  type: typeof REQ_LATEST_QUESTION,
} | {
  type: typeof SET_LATEST_QUESTION,
  latestQuestion: any
} | {
  type: typeof QUESTION_ACTIONS,
} | {
  type: typeof REQ_QUESTION_ANSWER,
} | {
  type: typeof QUESTION_ANSWER_ACTIONS,
} | {
  type: typeof REQ_QUESTION_BY_ID
} | {
  type: typeof REQ_ANSWER_COMMENT,
} | {
  type: typeof ANSWER_COMMENT_ACTIONS,
} | {
  type: typeof REQ_SEARCH_QUESTION,
} | {
  type: typeof REQ_QUESTION_BY_CATEGORY,
}

type State = {
  hotsCate: any,
  hotsAnswer: any,
  latestQuestion: any
}
const initialState: State = {
  hotsCate: [],
  hotsAnswer: [],
  latestQuestion: []
}

const reqHotsCate = () => ({type: REQ_HOTS_CATE})
const setHotsCate = (hotsCate) => ({type: SET_HOTS_CATE, hotsCate})
const reqHotsAnswer = () => ({type: REQ_HOTS_ANSWER})
const setHotsAnswer = (hotsAnswer) => ({type: SET_HOTS_ANSWER, hotsAnswer})
const reqLatestQuestion = () => ({type: REQ_LATEST_QUESTION})
const setLatestQuestion = (latestQuestion) => ({type: SET_LATEST_QUESTION, latestQuestion})

const reqQuestionById = (question_id, cb) => ({type: REQ_QUESTION_BY_ID, question_id, cb})
const reqQuestionActions = (actionType, title, content, description, tag_list, question_id, cb) => ({type: QUESTION_ACTIONS, actionType, title, content, description, tag_list, question_id, cb})

const reqQuestionAnswer = (question_id, cb) => ({type: REQ_QUESTION_ANSWER, question_id, cb})
const reqQuestionAnswerActions = (actionType, question_id, content, answer_id, vote, cb) => ({type: QUESTION_ANSWER_ACTIONS, actionType, question_id, content, answer_id, vote, cb})

const reqAnswerComment = (answer_id, cb) => ({type: REQ_ANSWER_COMMENT, answer_id, cb})
const reqAnswerCommentActions = (actionType, answer_id, comment, cb) => ({type: ANSWER_COMMENT_ACTIONS, actionType, answer_id, comment, cb})

const reqSearchQuestion = (query, cb) => ({type: REQ_SEARCH_QUESTION, query, cb})
const reqQuestionByCategory = (category, cb) => ({type: REQ_QUESTION_BY_CATEGORY, category, cb})

export const actions = { 
  reqHotsCate, reqHotsAnswer, reqLatestQuestion, 
  reqQuestionById, reqQuestionActions,
  reqQuestionAnswer,reqQuestionAnswerActions,
  reqAnswerComment, reqAnswerCommentActions,
  reqSearchQuestion, reqQuestionByCategory
}

export const reducer = function(state: State = initialState, action: Action): State {
  switch (action.type) {
    case SET_HOTS_CATE:
      return update(state, {hotsCate: {$set: action.hotsCate}})
    case SET_HOTS_ANSWER:
      return update(state, {hotsAnswer: {$set: action.hotsAnswer}})    
    case SET_LATEST_QUESTION:
      return update(state, {latestQuestion: {$set: action.latestQuestion}})
  }
  return state
}

function* rqHotsCate(action) {
  const result = yield fetchWithPost(`user/question/init`)
  //
  console.log(result)
  if((result||{}).success){
    const { content } = result 
    yield put(setHotsCate(content.category))
  }
}

function* rqHotsAnswer(action) {
  const result = yield fetchWithPost(`user/question`, {sorting: 'hots'})
  if((result||{}).success){
    const { content } = result 
    yield put(setHotsAnswer(content.question))
  }
}

function* rqLatestQuestion(action) {
  const result = yield fetchWithPost(`user/question`, {sorting: 'lastest'})
  if((result||{}).success){
    const { content } = result 
    yield put(setLatestQuestion(content.question))
  }
}

function* rqQuestionById(action) {
  const { question_id, cb } = action
  const result = yield fetchWithPost(`user/question/${question_id}`)
  console.log(result)
  if((result||{}).success){
    const { content } = result
    if(cb) cb(content)
  }
}

function* rqQuestionActoins(action){
  const { actionType, title, content, description, tag_list, question_id, cb } = action
  const result = yield fetchWithPost(`user/question/${actionType}`, 
    {title, content, description, tag_list:JSON.stringify(tag_list), question_id}
  )
  console.log(`Question ${actionType}`,result)
  if((result||{}).success){
    yield put(reqHotsAnswer())
    yield put(reqLatestQuestion())
    const { content } = result 
    if(cb)
      cb(content)
  }
}

//queston answer
function* rqQuestionAnswer(action){
  const { question_id, cb } = action
  const result = yield fetchWithPost(`user/question/answer`, { question_id } )
  console.log(result)
  if((result || {}).success){
    if(cb)
      cb(result.content.answer)
  } else {
    if(cb)
      cb([])
  }
}
function* rqQuestionAnswerActions(action){
  const { actionType, question_id, content, answer_id, vote, cb } = action
  const token = yield select(state=>state.auth.token)
  const result = yield fetchWithPost(`user/question/answer/${actionType}`, 
    {question_id, content, answer_id, type: vote}
  )
  console.log(result)
  if((result||{}).success){
    yield put(reqHotsAnswer())
    yield put(reqLatestQuestion())
    const { content } = result 
    if(cb)
      cb(content)
  }
}

// Answer Comment
function* rqAnswerComment(action){
  const { answer_id, cb } = action
  const result = yield fetchWithPost(`user/question/answer/comment`, { answer_id } )
  console.log(result)
  if((result || {}).success){
    if(cb)
      cb(result.content)
  } else {
    if(cb)
      cb([])
  }
}
function* rqAnswerCommentActions(action){
  const { actionType, answer_id, comment, cb } = action
  console.log(action)
  const token = yield select(state=>state.auth.token)
  const result = yield fetchWithPost(`user/question/answer/comment/${actionType}`, 
    {answer_id, comment}
  )
  console.log(result)
  if((result||{}).success){
    const { content } = result 
    if(cb)
      cb(content)
  }
}

function* rqSearchQuestion(action){
  const { query, cb } = action
  const result = yield fetchWithPost(`user/question/search`, 
    {query}
  )
  console.log(result)
  if((result||{}).success){
    const { content } = result 
    if(cb)
      cb(content)
  }
}

function* rqQuestionByCategory(action){
  //category = “bank”, “consumer”, “business”, “property” ,“utility”, “media”, “industrial”, “logistics”, “it”
  const { category, cb } = action
  const result = yield fetchWithPost(`user/question`, 
    {category}
  )
  //console.log(result)
  if((result||{}).success){
    const { content } = result 
    if(cb)
      cb(content)
  }
}

export const sagas = [
  function* (): any { yield takeEvery(REQ_HOTS_CATE, rqHotsCate) },
  function* (): any { yield takeEvery(REQ_HOTS_ANSWER, rqHotsAnswer) },
  function* (): any { yield takeEvery(REQ_LATEST_QUESTION, rqLatestQuestion) },

  function* (): any { yield takeEvery(REQ_QUESTION_BY_ID, rqQuestionById) },
  function* (): any { yield takeEvery(QUESTION_ACTIONS, rqQuestionActoins) },

  function* (): any { yield takeEvery(REQ_QUESTION_ANSWER, rqQuestionAnswer) },
  function* (): any { yield takeEvery(QUESTION_ANSWER_ACTIONS, rqQuestionAnswerActions) },
  
  function* (): any { yield takeEvery(REQ_ANSWER_COMMENT, rqAnswerComment) },
  function* (): any { yield takeEvery(ANSWER_COMMENT_ACTIONS, rqAnswerCommentActions) },

  function* (): any { yield takeEvery(REQ_SEARCH_QUESTION, rqSearchQuestion) },
  function* (): any { yield takeEvery(REQ_QUESTION_BY_CATEGORY, rqQuestionByCategory) },
  
]
