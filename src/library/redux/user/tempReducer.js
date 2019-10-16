import { takeEvery, put, all, select, call, cancel, fork, take } from 'redux-saga/effects'
import update from 'immutability-helper'
import { fetchWithPost } from '@lib/helpers'

const REQ_USER_LIST = 'REQ_USER_LIST'
const SET_USER_LIST = 'SET_USER_LIST'

type Action = {
  type: typeof REQ_USER_LIST,
} | {
  type: typeof SET_USER_LIST,
  user: any
} 

type State = {
	user: any,
}
const initialState: State = {
	user: []
}

const reqUserList = () => ({type: REQ_USER_LIST})
const setUserList = (user) => ({type: SET_USER_LIST, user})

export const actions = { reqUserList }

export const reducer = function(state: State = initialState, action: Action): State {
  switch (action.type) {
    case SET_USER_LIST:
      return update(state, {user: {$set: action.user}})
  }
  return state
}

function* rqUserList(action) {
  //fetch api here
  //const language = yield select(state=>state.settings.locale)
  //const accounts = yield fetchWithPost(`user/checkemail`, {email: "jimlai@ongrad.com"})
  const user = [
    {name: "user1"},
    {name: "user2"},
  ]
  yield put(setUserList(user))
}

export const sagas = [
  function* (): any { yield takeEvery(REQ_USER_LIST, rqUserList) },
]