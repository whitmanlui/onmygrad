import { takeEvery, put, all, select, call, cancel, fork, take } from 'redux-saga/effects'
import update from 'immutability-helper'
import DeviceInfo from 'react-native-device-info'
import _ from 'lodash'
import dbstore from 'react-native-simple-store'
import { fetchWithGet, fetchWithPost } from '@lib/helpers'

const REQ_SET_LANG = 'REQ_SET_LANG'
const SET_LANG = 'SET_LANG'
const REQ_INIT_APP = 'REQ_INIT_APP'
const SET_INIT_APP = 'SET_INIT_APP'
const REQ_START_APP = 'REQ_START_APP'
const SET_START_APP = 'SET_START_APP'

type Action = {
	type: typeof REQ_SET_LANG,
	lang: any
} | {
	type: typeof SET_LANG,
	lang: any
} | {
	type: typeof REQ_INIT_APP,
} | {
	type: typeof SET_INIT_APP,
	university_hk: any,
	university_intl: any,
	university_program_hk: any,
	industry: any,
	nationality: any,
	country: any
} | {
	type: typeof REQ_START_APP,
} | {
	type: typeof SET_START_APP,
	ads: any
}

type State = {
	lang: string,
	university_hk: any,
	university_intl: any,
	university_program_hk: any,
	industry: any,
	nationality: any,
	country: any,
	ads: any
}
const initialState: State = {
	lang: "zh_tw",
	university_hk: {},
	university_intl: {},
	university_program_hk: {},
	industry: {},
	nationality: {},
	country: {},
	ads: []
}

const reqSetAppLang = (lang) => ({type: REQ_SET_LANG, lang})
const setAppLang = (lang) => ({ type: SET_LANG, lang })
const reqInitApp = () => ({ type: REQ_INIT_APP })
const setInitApp = (university_hk, university_intl, university_program_hk, industry, nationality, country) => ({ type: SET_INIT_APP, university_hk, university_intl, university_program_hk, industry, nationality, country })
const reqStartApp = () => ({ type: REQ_START_APP })
const setStartApp = (ads) => ({ type: SET_START_APP, ads })

export const actions = { reqSetAppLang, reqInitApp, reqStartApp }

export const reducer = function (state: State = initialState, action: Action): State {
	switch (action.type) {
		case SET_LANG:
			return update(state, { lang: { $set: action.lang } })
		case SET_INIT_APP:
			return update(state, { 
				university_hk: { $set: action.university_hk }, 
				university_intl: { $set: action.university_intl }, 
				university_program_hk: { $set: action.university_program_hk }, 
				industry: { $set: action.industry }, 
				nationality: { $set: action.nationality }, 
				country: { $set: action.country } })
		case SET_START_APP:
			return update(state, { ads: { $set: action.ads } })
	}
	return state
}

function* rqSetLang(action) {
	//fetch api here
	const { lang } = action
	const supportLang = ["zh_tw", "zh_cn", "en"]
	if (_.includes(supportLang, lang)) {
		yield put(setAppLang(lang))
	} else {
		const lawLocale = DeviceInfo.getDeviceLocale()
		switch (true) {
			case /(\ZH.*?\HK)/.test(lawLocale.toUpperCase()):
				yield put(setAppLang("zh_tw"))
				break
			case /\ZH.*?\CN/.test(lawLocale.toUpperCase()):
				yield put(setAppLang("zh_cn"))
				break
			default:
				yield put(setAppLang("en"))
				break
		}
	}
}

function* rqInitApp(action) {
	//fetch api here
	const initApp = yield dbstore.get('initApp')

	if(initApp){
		const { university_hk, university_intl, university_program_hk, industry, nationality, country } = initApp
		yield put(setInitApp(university_hk, university_intl, university_program_hk, industry, nationality, country))
	} else {
		const result = yield fetchWithPost(`user/init-app`)
		if((result||{}).success){
			const { content } = result 
			const { university_hk, university_intl, university_program_hk, industry, nationality, country } = content
			dbstore.save('initApp', content)
			yield put(setInitApp(university_hk, university_intl, university_program_hk, industry, nationality, country))
		}
	}

}

function* rqStartApp(action) {
	const startApp = yield dbstore.get('startApp')
	if(startApp){
		const { ads } = startApp
		yield put(setStartApp(ads))
	}
	const result = yield fetchWithPost(`user/start-app`)
	if((result||{}).success){
		const { content } = result 
		const { ads } = content
		dbstore.save('startApp', content)
		yield put(setStartApp(ads))
	}
}

export const sagas = [
	function* (): any { yield takeEvery(REQ_SET_LANG, rqSetLang) },
	function* (): any { yield takeEvery(REQ_INIT_APP, rqInitApp) },
	function* (): any { yield takeEvery(REQ_START_APP, rqStartApp) },
]