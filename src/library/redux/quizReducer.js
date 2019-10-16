import { takeEvery, put, all, select, call, cancel, fork, take } from 'redux-saga/effects'
import update from 'immutability-helper'
import { fetchWithGet, fetchWithPost } from '@lib/helpers'

const REQ_QUIZ_START = 'REQ_QUIZ_START'
const SET_QUIZ_ID = 'SET_QUIZ_ID'
const SET_QUIZ_STEP = 'SET_QUIZ_STEP'
const SET_QUIZ_LIST = 'SET_QUIZ_LIST'
const SET_QUIZ_RULE = 'SET_QUIZ_RULE'
const REQ_QUIZ_ANSWER = 'REQ_QUIZ_ANSWER'
const REQ_QUIZ_COMPLETE = 'SET_QUIZ_COMPLETE'
const REQ_PSY_LIST = 'REQ_PSY_LIST'
const SET_PSY_LIST = 'SET_PSY_LIST'
const REQ_PSY_FINISH = 'REQ_PSY_FINISH'

type Action = {
  type: typeof REQ_QUIZ_START,
} | {
  type: typeof SET_QUIZ_ID,
  quizSetID: any
} | {
  type: typeof SET_QUIZ_RULE,
  quizRule: any
} | {
  type: typeof SET_QUIZ_LIST,
  quizList: any
} | {
  type: typeof SET_QUIZ_STEP,
  quizStep: any
} | {
  type: typeof REQ_QUIZ_ANSWER,
} | {
  type: typeof REQ_QUIZ_COMPLETE,
} | {
  type: typeof REQ_PSY_LIST,
} | {
  type: typeof SET_PSY_LIST,
  psyList: any
} | {
  type: typeof REQ_PSY_FINISH
}

type State = {
  quizSetID: any,
  quizStep: any,
  quizList: any,
  quizAnswer: any,
  quizRule: any,
  psyList: any,
}
const initialState: State = {
  quizSetID: '',
  quizStep: '',
  quizList: [],
  quizRule: '',
  psyList: [],
}

const reqQuizStart = (cb) => ({type: REQ_QUIZ_START, cb})
const setQuizID = (quizSetID) => ({type: SET_QUIZ_ID, quizSetID})
const setQuizStep = (quizStep) => ({type: SET_QUIZ_STEP, quizStep})
const setQuizList = (quizList) => ({type: SET_QUIZ_LIST, quizList})
const setQuizRule = () => ({type: SET_QUIZ_RULE})
const reqQuizAnswer = (qid, answer, cb) => ({type: REQ_QUIZ_ANSWER, qid, answer, cb})
const reqQuizComplete = (cb) => ({type: REQ_QUIZ_COMPLETE, cb})
const reqPsyList = (cb) => ({type: REQ_PSY_LIST, cb})
const setPsyList = (psyList) => ({type: SET_PSY_LIST, psyList})
const reqPsyFinish = (psyAnswer, cb) => ({type: REQ_PSY_FINISH, psyAnswer, cb})

export const actions = { reqQuizStart, reqQuizAnswer, reqQuizComplete, reqPsyList, reqPsyFinish }

export const reducer = function(state: State = initialState, action: Action): State {
  switch (action.type) {
    case SET_QUIZ_ID:
      return update(state, {quizSetID: {$set: action.quizSetID}})
    case SET_QUIZ_LIST:
      return update(state, {quizList: {$set: action.quizList}})
    case SET_QUIZ_RULE:
      return update(state, {quizRule: {$set: action.quizRule}})
    case SET_QUIZ_STEP:
      return update(state, {quizStep: {$set: action.quizStep}})
    case SET_PSY_LIST:
      return update(state, {psyList: {$set: action.psyList}})  
  }
  return state
}

function* rqQuizStart(action) {
  const prevQuiz_ID = yield select(state => state.quiz.quizSetID)
  const { cb } = action;
  const result = yield fetchWithPost(`user/apttest/get-set`, {id: 419, token: `Gn16w8aKsKef6SUUnUfG`})
  
  // for development DELETE to use API
  // yield put(setQuizList(quizData));
  console.log(result);
  if (result.success) {
    const { step, id, question, rulesHtml } = result.content.apt_set;
    yield put(setQuizID(id));
    yield put(setQuizStep(step));
    yield put(setQuizList(question));
    yield put(setQuizRule(rulesHtml));
    if (cb) {
      cb(true);
    }
  } else {
    if (cb) {
      cb(result.content);
    }
  }
}

function* rqQuizAnswer(action) {
  const { qid, answer, cb } = action
  const currentQuizSet = yield select(state => state.quiz.quizSetID)
  console.log(`${qid} ${answer} ${currentQuizSet}`)
  const result = yield fetchWithPost(`user/apttest/answer`, {id: 419, token: `Gn16w8aKsKef6SUUnUfG`, apt_set_id: currentQuizSet, question_id: qid, answer: answer})
  console.log(result);
  if (result.success) {
    const { step, is_correct, correct_answer } = result.content
    console.log(result)
    yield put(setQuizStep(step))
    if (cb) {
      cb('nice',is_correct, correct_answer)
    }
  } else {
    cb(result.content, '', '')
  }
}

function* rqQuizComplete(action) {
  const currentQuizSet = yield select(state => state.quiz.quizSetID)
  const result = yield fetchWithPost(`user/apttest/complete-set`, {id: 419, token: `Gn16w8aKsKef6SUUnUfG`, apt_set_id: currentQuizSet})
  console.log(result)

  if (result.success) {
    if (cb) {
      cb(true)
    }  
  }
  
  //fetch api here
  //const prevToken = yield select(state=>state.auth.token)
  //const result = yield fetchWithPost(`user/autologin`, prevToken )
  /* if(result.success){
    console.log(result)
  } */
}

function* rqPsyList(action) {
  const tempList = [
    { "id": 1,
      "content": "I feel little concern for others", "option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]},
    { "id": 2,
      "content": "I am interested in meeting new friends", "option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]},
    { "id": 3,
      "content": "I feel comfortable around people", "option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]},
    { "id": 4,
      "content": "I like to get attention", "option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]},
    { "id": 5,
      "content": "I sympathize with others' feelings", "option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]},
    { "id": 6,
      "content": "I like to start conversations", "option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]},
    { "id": 7,
      "content": "I am not interested in other people's problems", "option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]},
    { "id": 8,
      "content": "I do not speak much", "option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]},
    { "id": 9,
      "content": "I talk to a lot of different people at parties", "option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]},
    { "id": 10,
      "content": "I am not really interested in others", "option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]},
    { "id": 11,
      "content": "I do not like to draw attention", "option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]},
    { "id": 12,
      "content": "I like to spend time with others", "option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]},
    { "id": 13,
      "content": "I do not mind being the center of attention", "option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]},
    { "id": 14,
      "content": "I feel others' emotions.", "option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]},
    { "id": 15,
      "content": "I insult people", "option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]},
    { "id": 16,
      "content": "I am quiet around strangers", "option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]},
    { "id": 17,
      "content": "I leave my belongings around", "option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]},
    { "id": 18,
      "content": "I make things messy", "option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]},
    { "id": 19,
      "content": "I avoid my duties", "option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]},
    { "id": 20,
      "content": "I often forget to put things back in their proper place", "option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]},
    { "id": 21,
      "content": "I am always prepared", "option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]},
    { "id": 22,
      "content": "I pay attention to details", "option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]},
    { "id": 23,
      "content": "I follow a schedule", "option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]},
    { "id": 24,
      "content": "I am exciting about my work", "option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]},
    { "id": 25,
      "content": "I get stressed out easily", "option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]},
    { "id": 26,
      "content": "I worry about things", "option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]},
    { "id": 27,
      "content": "I am easily distracted", "option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]},
    { "id": 28,
      "content": "I have frequent mood swings", "option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]},
    { "id": 29,
      "content": "I am relaxed most of the time", "option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]},
    { "id": 30,
      "content": "I get upset easily", "option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]},
    { "id": 31,
      "content": "I get irritated easily", "option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]},
    { "id": 32,
      "content": "I seldom feel blue", "option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]},
    { "id": 33,
      "content": "I have difficulty understanding abstract ideas", "option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]},
    { "id": 34,
      "content": "I am not interested in abstract ideas", "option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]},
    { "id": 35,
      "content": "I do not have a good imagination", "option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]},
    { "id": 36,
      "content": "I have a vivid imagination", "option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]},
    { "id": 37,
      "content": "I am a fast learner", "option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]},
    { "id": 38,
      "content": "I use difficult words.", "option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]},
    { "id": 39,
      "content": "I spend time reflecting on things", "option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]},
    { "id": 40,
      "content": "I am full of ideas", "option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]},
    { "id": 41,
      "content": "Don't mind being the center of attention.", "option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]},
    { "id": 42,
      "content": "Feel others' emotions.", "option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]},
    { "id": 43,
      "content": "Follow a schedule.", "option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]},
    { "id": 44,
      "content": "Get irritated easily.", "option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]},
    { "id": 45,
      "content": "Spend time reflecting on things.", "option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]},
    { "id": 46,
      "content": "Am quiet around strangers.", "option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]},
    { "id": 47,
      "content": "Make people feel at ease.", "option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]},
    { "id": 48,
      "content": "Am exacting in my work.", "option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]},
    { "id": 49,
      "content": "Often feel blue." ,"option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]}, 
    {"id": 50,
      "content": "Am full of ideas.", "option": [
      "Strongly Agree", "Agree", "Neutral", "Disagree", "Stronly Disagree"
    ]}
    ]
  
  const { cb } = action
  if (cb) {
    cb(true)
  }
  const result = yield fetchWithPost(`user/psychotest/get`, {id: 419, token: `Gn16w8aKsKef6SUUnUfG`})
  
  // for development DELETE to use API
  // yield put(setQuizList(quizData));
  // console.log(result);
  if (result.success) {
    const { question } = result.content;
    yield put(setPsyList(question))
    
    if (cb) {
      cb(true);
    }
  } else {
    if (cb) {
      cb(result.content);
    }
  }
  // yield put(setPsyList(tempList))
}

function* rqPsyFinish(action) {
  const { psyAnswer, cb } = action
  const answer = JSON.stringify(psyAnswer)
  const result = yield fetchWithPost(`user/psychotest/submit`, {id: 419, token: `Gn16w8aKsKef6SUUnUfG`, answer: answer})
  if (result.success) {
    console.log(result)
    if (cb) {
      cb(true)
    }
  }
}

export const sagas = [
  function* (): any { yield takeEvery(REQ_QUIZ_START, rqQuizStart) },
  function* (): any { yield takeEvery(REQ_QUIZ_ANSWER, rqQuizAnswer) },
  function* (): any { yield takeEvery(REQ_QUIZ_COMPLETE, rqQuizComplete) },
  function* (): any { yield takeEvery(REQ_PSY_LIST, rqPsyList) },
  function* (): any { yield takeEvery(REQ_PSY_FINISH, rqPsyFinish) },
]
