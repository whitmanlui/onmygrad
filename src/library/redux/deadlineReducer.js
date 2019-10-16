import { takeEvery, put, all, select, call, cancel, fork, take } from 'redux-saga/effects'
import update from 'immutability-helper'
import { fetchWithGet, fetchWithPost } from '@lib/helpers'

const REQ_ALL_DEADLINE = 'REQ_ALL_DEADLINE'
const SET_ALL_DEADLINE = 'SET_ALL_DEADLINE'
const REQ_SINGLE_DEADLINE = 'REQ_SINGLE_DEADLINE'
const SET_SINGLE_DEADLINE = 'SET_SINGLE_DEADLINE'
const REQ_RECOMMENDATION = 'REQ_RECOMMENDATION'
const SET_RECOMMENDATION = 'SET_RECOMMENDATION'

type Action = {
  type: typeof REQ_ALL_DEADLINE,
} | {
  type: typeof SET_ALL_DEADLINE,
  allDeadline: any
} | {
  type: typeof REQ_SINGLE_DEADLINE,
} | {
  type: typeof SET_SINGLE_DEADLINE,
  singleDeadline: any
} | {
  type: typeof REQ_RECOMMENDATION,
} | {
  type: typeof SET_RECOMMENDATION,
  recommendation: any
}

type State = {
  allDeadline: any,
  recommendation: any,
  singleDeadline: any,
}
const initialState: State = {
  allDeadline: [],
  recommendation: [],
  singleDeadline: {},
}

const reqAllDeadline = (cb) => ({type: REQ_ALL_DEADLINE, cb})
const setAllDeadline = (allDeadline) => ({type: SET_ALL_DEADLINE, allDeadline})
const reqRecommendation = () => ({type: REQ_RECOMMENDATION})
const setRecommendation = (recommendation) => ({type: SET_RECOMMENDATION, recommendation})
const reqSingleDeadline = () => ({type: REQ_SINGLE_DEADLINE})
const setSingleDeadline = (singleDeadline) => ({type: SET_SINGLE_DEADLINE , singleDeadline})

export const actions = { reqAllDeadline, reqSingleDeadline, reqRecommendation }

export const reducer = function(state: State = initialState, action: Action): State {
  switch (action.type) {
    case SET_ALL_DEADLINE:
      return update(state, {allDeadline: {$set: action.allDeadline}})
    case SET_SINGLE_DEADLINE:
      return update(state, {singleDeadline: {$set: action.singleDeadline}})
    case SET_RECOMMENDATION:
      return update(state, {recommendation: {$set: action.recommendation}})
  }
  return state
}

function* rqAllDeadline(action) {
  const { cb } = action
  const alldeadlineData = [
    {
      id: '4',
      program: 'MT Good Programme 1',
      logo: 'https://scontent-hkg3-1.xx.fbcdn.net/v/t1.0-9/56968288_2499080016833274_3291818860147113984_n.png?_nc_cat=104&_nc_ht=scontent-hkg3-1.xx&oh=045ecbac127aff6ab2d1a36a04e3cf40&oe=5D3A1E38',
      company: 'Company Name',
      source: 'https://firebasestorage.googleapis.com/v0/b/og-trekker.appspot.com/o/Template%20Testing.jpg?alt=media&token=63f7e09f-56d2-4403-ad25-3085db1cfc6c',
      date: 'Apr 23'
    },
    {
      id: '2',
      program: 'MT Good Programme 2',
      logo: 'https://scontent-hkg3-1.xx.fbcdn.net/v/t1.0-9/56968288_2499080016833274_3291818860147113984_n.png?_nc_cat=104&_nc_ht=scontent-hkg3-1.xx&oh=045ecbac127aff6ab2d1a36a04e3cf40&oe=5D3A1E38',
      company: 'Company Name',
      source: 'https://i.prcdn.co/img?regionKey=492c5CnqajUHHD2F1bTSzw%3D%3D',
      date: 'Apr 23'
    },
    {
      id: '5',
      program: 'MT Good Programme 3',
      logo: 'https://scontent-hkg3-1.xx.fbcdn.net/v/t1.0-9/56968288_2499080016833274_3291818860147113984_n.png?_nc_cat=104&_nc_ht=scontent-hkg3-1.xx&oh=045ecbac127aff6ab2d1a36a04e3cf40&oe=5D3A1E38',
      company: 'Company Name',
      source: 'https://firebasestorage.googleapis.com/v0/b/og-trekker.appspot.com/o/JXAuHAm%20-%20Imgur.png?alt=media&token=541fd794-8c03-46ba-a9a8-596f4eb4723e',
      date: 'Apr 23',
      eventid: 999
    },
    {
      id: '3',
      program: 'MT Good Programme 4',
      logo: 'https://scontent-hkg3-1.xx.fbcdn.net/v/t1.0-9/56968288_2499080016833274_3291818860147113984_n.png?_nc_cat=104&_nc_ht=scontent-hkg3-1.xx&oh=045ecbac127aff6ab2d1a36a04e3cf40&oe=5D3A1E38',
      company: 'Company Name',
      source: 'https://firebasestorage.googleapis.com/v0/b/og-trekker.appspot.com/o/JXAuHAm%20-%20Imgur.png?alt=media&token=541fd794-8c03-46ba-a9a8-596f4eb4723e',
      date: 'May 5'
    },
    {
      id: '42',
      program: 'MT Good Programme 5',
      logo: 'https://scontent-hkg3-1.xx.fbcdn.net/v/t1.0-9/56968288_2499080016833274_3291818860147113984_n.png?_nc_cat=104&_nc_ht=scontent-hkg3-1.xx&oh=045ecbac127aff6ab2d1a36a04e3cf40&oe=5D3A1E38',
      user: 'Company Name',
      source: 'https://firebasestorage.googleapis.com/v0/b/og-trekker.appspot.com/o/JXAuHAm%20-%20Imgur.png?alt=media&token=541fd794-8c03-46ba-a9a8-596f4eb4723e',
      date: 'May 5',
      eventid: 122
    },
    {
      id: '25',
      program: 'MT Good Programme 6',
      logo: 'https://scontent-hkg3-1.xx.fbcdn.net/v/t1.0-9/56968288_2499080016833274_3291818860147113984_n.png?_nc_cat=104&_nc_ht=scontent-hkg3-1.xx&oh=045ecbac127aff6ab2d1a36a04e3cf40&oe=5D3A1E38',
      company: 'Company Name',
      source: 'https://firebasestorage.googleapis.com/v0/b/og-trekker.appspot.com/o/JXAuHAm%20-%20Imgur.png?alt=media&token=541fd794-8c03-46ba-a9a8-596f4eb4723e',
      date: 'May 13'
    },
    {
      id: '51',
      program: 'MT Good Programme 7',
      logo: 'https://scontent-hkg3-1.xx.fbcdn.net/v/t1.0-9/56968288_2499080016833274_3291818860147113984_n.png?_nc_cat=104&_nc_ht=scontent-hkg3-1.xx&oh=045ecbac127aff6ab2d1a36a04e3cf40&oe=5D3A1E38',
      company: 'Company Name',
      source: 'https://firebasestorage.googleapis.com/v0/b/og-trekker.appspot.com/o/JXAuHAm%20-%20Imgur.png?alt=media&token=541fd794-8c03-46ba-a9a8-596f4eb4723e',
      date: 'May 15'
    },
    {
      id: '39',
      program: 'MT Good Programme 8',
      logo: 'https://scontent-hkg3-1.xx.fbcdn.net/v/t1.0-9/56968288_2499080016833274_3291818860147113984_n.png?_nc_cat=104&_nc_ht=scontent-hkg3-1.xx&oh=045ecbac127aff6ab2d1a36a04e3cf40&oe=5D3A1E38',
      company: 'Company Name',
      source: 'https://firebasestorage.googleapis.com/v0/b/og-trekker.appspot.com/o/JXAuHAm%20-%20Imgur.png?alt=media&token=541fd794-8c03-46ba-a9a8-596f4eb4723e',
      date: 'May 20'
    }  
  ];
  const result = yield fetchWithPost(`user/deadline`, {id: 419, token: `Gn16w8aKsKef6SUUnUfG`})
  if ((result || {}).success) {
    const { content } = result;
    yield put(setAllDeadline(content.deadline))
    if (cb) {
      cb(true)
    }
  }
}

function* rqSingleDeadline(action) {
  const singledeadlineData = {
    icon: 'https://scontent-hkg3-1.xx.fbcdn.net/v/t1.0-9/56968288_2499080016833274_3291818860147113984_n.png?_nc_cat=104&_nc_ht=scontent-hkg3-1.xx&oh=045ecbac127aff6ab2d1a36a04e3cf40&oe=5D3A1E38',
    image:
      'https://originalshrewsbury.co.uk/sites/default/files/styles/original_square_thumb/public/21950749_10155805627431133_2176523688727472824_o_0.jpg',
    company: 'Company good',
    react_datetime: '2019-01-01T00:00:00Z',
    title: 'Recruitment',
    content: 'biggest recruitment deadline ever',
    tags: ['workshop', 'interview'],
    like: 10000,
    location: 'Kwun Tong',
    start: '2019-01-01',
    end: '2019-02-01',
  }

  yield put(setSingleDeadline(singledeadlineData))
  //fetch api here
  /* const prevToken = yield select(state=>state.auth.token)
  const result = yield fetchWithPost(`user/autologin`, prevToken )
  if(result.success){
    console.log(result)
  } */
}

function* rqRecommendation(action) {
  const recommendationData = [
    
  ]

  yield put(setRecommendation(recommendationData))
  //fetch api here
  /* const prevToken = yield select(state=>state.auth.token)
  const result = yield fetchWithPost(`user/autologin`, prevToken )
  if(result.success){
    console.log(result)
  } */
}

export const sagas = [
  function* (): any { yield takeEvery(REQ_ALL_DEADLINE, rqAllDeadline) },
  function* (): any { yield takeEvery(REQ_SINGLE_DEADLINE, rqSingleDeadline) },
  function* (): any { yield takeEvery(REQ_RECOMMENDATION, rqRecommendation) },
]
