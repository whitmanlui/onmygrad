import { takeEvery, put, all, select, call, cancel, fork, take } from 'redux-saga/effects'
import update from 'immutability-helper'
import { fetchWithGet, fetchWithPost } from '@lib/helpers'
import dbstore from 'react-native-simple-store'
import { Platform } from 'react-native'
import { actions as meActions } from '@reducer/meReducer'

const REQ_LOGIN = 'REQ_LOGIN'
const REQ_AUTO_LOGIN = 'REQ_AUTO_LOGIN'
const SET_USER_TOKEN = 'SET_USER_TOKEN'
const SET_USER_INFO = 'SET_USER_INFO'
const REQ_USER = 'REQ_USER'
const REQ_FORGETPASSWORD = 'REQ_FORGETPASSWORD'
const REQ_REGISTER = 'REQ_REGISTER'
const REQ_CHECK_EMAIL = 'REQ_CHECK_EMAIL'
const REQ_LOGOUT = 'REQ_LOGOUT'
const REQ_CHECK_INVITATION_CODE = 'REQ_CHECK_INVITATION_CODE'

type Action = {
  type: typeof REQ_LOGIN,
} | {
  type: typeof REQ_AUTO_LOGIN,
} | {
  type: typeof SET_USER_TOKEN,
  token: any
} | {
  type: typeof SET_USER_INFO,
  user: any
} | {
  type: typeof REQ_USER,
} | {
  type: typeof REQ_FORGETPASSWORD,
} | {
  type: typeof REQ_REGISTER,
} | {
  type: typeof REQ_CHECK_EMAIL,
} | {
  type: typeof REQ_LOGOUT,
} | {
  type: typeof REQ_CHECK_INVITATION_CODE
}

type State = {
  token: any,
  user: any
}
const initialState: State = {
  token: {},
  user: {}
}

const reqLogin = (email, password, autoLogin, cb) => ({type: REQ_LOGIN, email, password, autoLogin, cb})
const reqAutoLogin = () => ({type: REQ_AUTO_LOGIN})
const setUserToken = (token) => ({type: SET_USER_TOKEN, token})
const setUserInfo = (user) => ({type: SET_USER_INFO, user})
const reqUser = () => ({type: REQ_USER})
const reqForgetPw = (login) => ({type: REQ_FORGETPASSWORD, login})
const reqRegister = (code, username, email, password) => ({type: REQ_REGISTER, code, username, email, password})

const reqCheckEmail = (email, cb) => ({type: REQ_CHECK_EMAIL, email, cb})
const reqCheckInvitationCode = (code, cb) => ({type: REQ_CHECK_INVITATION_CODE, code, cb})

const reqLogout = () => ({type: REQ_LOGOUT})
export const actions = { reqLogin, reqAutoLogin, reqUser, reqForgetPw, reqRegister, reqCheckEmail, reqLogout, reqCheckInvitationCode }

export const reducer = function(state: State = initialState, action: Action): State {
  switch (action.type) {
    case SET_USER_TOKEN:
      return update(state, {token: {$set: action.token}})
    case SET_USER_INFO:
      return update(state, {user: {$set: action.user}})
  }
  return state
}

function* rqLogin(action) {
  const { email, password, autoLogin, cb } = action
  //fetch api here
  //const language = yield select(state=>state.settings.locale)
  /* app_version (float)
  firebase_key (String)
  device (String) */
  const pushKey = yield dbstore.get('pushKey')
  const appIntro = yield dbstore.get('appIntro')
  const result = yield fetchWithPost(`user/login`, { email, password, app_version: "v1.0.0", firebase_key: pushKey, device: Platform.OS === 'ios' ? 'ios' : 'android',})

  if((result||{}).success){
    const { content } = result 
    yield put(setUserToken(content))
    yield put(reqUser())
    yield put(meActions.reqNotification())
    if(autoLogin){
      //if true save to db store
      yield dbstore.save('login', content)
    }
    if(!appIntro){
      yield dbstore.save('appIntro', true)
    }
    if(cb)
      cb(true, appIntro)
  } else {
    if(cb)
      cb(false, false)
  }
  //yield put(setUserList(user))
}

function* rqAutoLogin(action) {
  //fetch api here
  const loginInfo = yield dbstore.get('login')
  if(loginInfo){
    console.log("auto login")
    yield put(setUserToken(loginInfo))
    yield put(reqUser())
    yield put(meActions.reqNotification())
    /* const prevToken = yield select(state=>state.auth.token)
    const result = yield fetchWithPost(`user/autologin`, prevToken )
    if(result.success){
      console.log("auto login")
      console.log(result)
    } */
  }

}

function* rqForgetPassword(action) {
  const { email } = action
  //fetch api here
  const result = yield fetchWithPost(`user/password/forget`, {email} )
  if(result.success){
    console.log(result)
  }
}

function* rqUser(action) {
  //fetch api here
  const result = yield fetchWithPost(`user/me` )
  console.log("rqUser", result)
  if(result.success){
    yield put(setUserInfo(result.content))
  }
}

function* rqRegister(action){
  const { code, username, email, password, industry, university, faculty, degree, start_year, grad_year } = action
  //username, email, password, firstname, lastname, industry. university, faculty, degree, start_year, grad_year
  //fetch api here
  //const language = yield select(state=>state.settings.locale)
  const data = {
    code,
    username,
    email,
    password,
    name, username,
    industry: null,
    university: null,
    faculty: null,
    degree: null,
    start_year: 0,
    grad_year: 0
  }
  const result = yield fetchWithPost(`user/register`, data )
  console.log(result)
}

function* rqCheckEmail(action){
  const { email, cb } = action
  //https://api.onmygrad.com/app/user/check-email
  const result = yield fetchWithPost(`user/check-email`, {email} )
  if(result){
    if(cb)
      cb(result.success)
  }
}

function* rqCheckInvitationCode(action){
  const { code, cb } = action
  //https://api.onmygrad.com/app/user/check-email
  const result = yield fetchWithPost(`user/check-invitation-code`, {code} )
  console.log(result)
  if(result){
    if(cb) cb(result.success)
  }
}

function* rqLogout(action){
  const prevToken = yield select(state=>state.auth.token)
  //const result = yield fetchWithPost(`user/logout`, prevToken )
  //console.log(result)
  yield put(setUserToken({}))
  yield put(setUserInfo({}))
  yield dbstore.delete('login')
}

export const sagas = [
  function* (): any { yield takeEvery(REQ_LOGIN, rqLogin) },
  function* (): any { yield takeEvery(REQ_AUTO_LOGIN, rqAutoLogin) },
  function* (): any { yield takeEvery(REQ_FORGETPASSWORD, rqForgetPassword) },
  function* (): any { yield takeEvery(REQ_USER, rqUser) },
  function* (): any { yield takeEvery(REQ_REGISTER, rqRegister) },
  function* (): any { yield takeEvery(REQ_CHECK_EMAIL, rqCheckEmail) },
  function* (): any { yield takeEvery(REQ_CHECK_INVITATION_CODE, rqCheckInvitationCode) },
  function* (): any { yield takeEvery(REQ_LOGOUT, rqLogout) },
]
