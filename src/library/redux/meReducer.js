import { takeEvery, put, all, select, call, cancel, fork, take } from 'redux-saga/effects'
import update from 'immutability-helper'
import { fetchWithGet, fetchWithPost } from '@lib/helpers'
import { actions as authActions } from '@reducer/authReducer'

const REQ_RESUME = 'REQ_RESUME'
const SET_RESUME = 'SET_RESUME'
const REQ_UPDATE_RESUME = 'REQ_UPDATE_RESUME'
const REQ_CHECKIN = 'REQ_CHECKIN'
const REQ_HISTORY = 'REQ_HISTORY'
const SET_HISTORY = 'SET_HISTORY'
const REQ_UPDATE_ME = 'REQ_UPDATE_ME'
const REQ_ANALYSIS = 'REQ_ANALYSIS'
const REQ_UPDATE_ME_THUMBNAIL = 'REQ_UPDATE_ME_THUMBNAIL'
const REQ_UPDATE_PW = 'REQ_UPDATE_PW'
const REQ_SAVED = 'RED_SAVED'
const REQ_NOTIFICATION = 'REQ_NOTIFICATION'
const SET_NOTIFICATION = 'SET_NOTIFICATION'

type Action = {
  type: typeof REQ_RESUME,
} | {
  type: typeof SET_RESUME,
  resume: any
} | {
  type: typeof REQ_UPDATE_RESUME,
} | {
  type: typeof REQ_CHECKIN
} | {
  type: typeof REQ_HISTORY
} | {
  type: typeof SET_HISTORY,
  history: any
} | {
  type: typeof REQ_UPDATE_ME
} | {
  type: typeof REQ_ANALYSIS
} | {
  type: typeof REQ_UPDATE_ME_THUMBNAIL
} | {
  type: typeof REQ_UPDATE_PW
} | {
  type: typeof REQ_SAVED
} | {
  type: typeof REQ_NOTIFICATION
} | {
  type: typeof SET_NOTIFICATION,
  notification: any
}

type State = {
  resume: any,
  history: any,
  notification: any,
}
const initialState: State = {
  resume: {},
  history: {},
  notification:[]
}

const reqResume = (cb) => ({type: REQ_RESUME, cb})
const setResume = (resume) => ({type: SET_RESUME, resume})
const reqUpdateResume = (item, cb) => ({type: REQ_UPDATE_RESUME, item, cb})
const reqCheckin = (cb) => ({type: REQ_CHECKIN, cb})
const reqHistory = (cb) => ({type: REQ_HISTORY, cb})
const reqUpdateMe = (name, headline, cb) => ({type: REQ_UPDATE_ME, name, headline, cb})
const reqUpdateMeThumbnail = (thumbnail_base64, cb) => ({type: REQ_UPDATE_ME_THUMBNAIL, thumbnail_base64, cb})
const reqUpdatePw = (old_password, password, cb) => ({type: REQ_UPDATE_PW, old_password, password, cb})
const reqAnalysis  = (cb) => ({type: REQ_ANALYSIS, cb})
const reqSaved = (cb) => ({type: REQ_SAVED, cb})
const reqNotification = () => ({type: REQ_NOTIFICATION})
const setNotification = (notification) => ({type: SET_NOTIFICATION, notification})

export const actions = { reqResume, reqUpdateResume, reqCheckin, reqHistory, reqUpdateMe, reqUpdateMeThumbnail, reqUpdatePw, reqAnalysis, reqSaved, reqNotification }

export const reducer = function(state: State = initialState, action: Action): State {
  switch (action.type) {
    case SET_RESUME:
      return update(state, {resume: {$set: action.resume}})
    case SET_NOTIFICATION:
      return update(state, {notification: {$set: action.notification}})
  }
  return state
}

function* rqResume(action) {
  //fetch api here
  const {cb} = action
  const result = yield fetchWithPost(`user/resume`)
  if(result.success){
    const { content } = result 
    yield put(setResume(content))
    if (cb) {
      cb(true)
    }
  }
  // yield put(setResume(temp_resume))
}

function* rqUpdateResume(action) {
  const { item, cb } = action
  let type;
  console.log(item)
  if (item.profile) {
    type = 'profile'
  } else if (item.education) {
    type = 'education'
  } else if (item.professional) {
    type = 'professional'
  } else if (item.working_experience) {
    type = 'working_experience'
  } else if (item.experience) {
    type = 'experience'
  } else {
    type = ''
  }

  const data = JSON.stringify(item[type])
  const result = yield fetchWithPost(`user/resume/update`, {field: type, resume_content: data })
  if ((result||{}).success) {
    const { content } = result;
    if (cb) {
      cb('done')
    }
  } else {
    console.log(result)
    if (cb) {
      cb(result.content);
    }
  }
}

function* rqCheckin(action) {
  const { cb } = action
  const result = yield fetchWithPost(`user/checkin`)
  if (result) {
    if (cb) {
      cb(result.content)
    }
  }
}


function* rqHistory(action) {
  const { cb } = action
  const result = yield fetchWithPost(`user/me/history`)
  if ((result||{}).success) {
    if (cb) cb(result.content)
  }
}

function* rqUpdateMe(action) {
  const { name, headline, cb } = action
  const result = yield fetchWithPost(`user/me/update-profile`, {name, headline})
  console.log(result)
  if ((result||{}).success) {
    yield put(authActions.reqUser())
  }
  if (cb) cb(result.success)
}

function* rqUpdateMeThumbnail(action) {
  const { thumbnail_base64, cb } = action
  const result = yield fetchWithPost(`user/me/update-thumbnail`, {thumbnail_base64})
  console.log(result)
  if ((result||{}).success) {
    yield put(authActions.reqUser())
  }
  if (cb) cb(result.success)
}

function* rqUpdatePw(action) {
  const { old_password, password, cb } = action
  const result = yield fetchWithPost(`user/me/update-password`, {old_password, password})
  //console.log(result)
  if (cb) cb((result||{}).success)
}

function* rqAnalysis(action) {
  const { cb } = action
  const result = yield fetchWithPost(`user/me/analysis`)
  if (cb) cb((result||{}).content)
}

function* rqSaved(action) {
  const { cb } = action
  const result = yield fetchWithPost(`user/me/saved`)
  if (cb) cb((result||{}).content)
}

function* rqNotification(action) {
  const result = yield fetchWithPost(`user/notification`)
  if ((result||{}).success) {
    yield put(setNotification((result||{}).content.notification))
  }

}

export const sagas = [
  function* (): any { yield takeEvery(REQ_RESUME, rqResume) },
  function* (): any { yield takeEvery(REQ_UPDATE_RESUME, rqUpdateResume) },
  function* (): any { yield takeEvery(REQ_CHECKIN, rqCheckin) },
  function* (): any { yield takeEvery(REQ_HISTORY, rqHistory) },
  function* (): any { yield takeEvery(REQ_UPDATE_ME, rqUpdateMe) },
  function* (): any { yield takeEvery(REQ_ANALYSIS, rqAnalysis) },
  function* (): any { yield takeEvery(REQ_UPDATE_ME_THUMBNAIL, rqUpdateMeThumbnail) },
  function* (): any { yield takeEvery(REQ_UPDATE_PW, rqUpdatePw) },
  function* (): any { yield takeEvery(REQ_SAVED, rqSaved) },
  function* (): any { yield takeEvery(REQ_NOTIFICATION, rqNotification) },
]
