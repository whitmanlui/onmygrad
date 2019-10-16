import { takeEvery, put, all, select, call, cancel, fork, take } from 'redux-saga/effects'
import update from 'immutability-helper'
import { fetchWithGet, fetchWithPost } from '@lib/helpers'

const REQ_ALL_COURSE = 'REQ_ALL_COURSE'
const REQ_MY_COURSE = 'REQ_MY_COURSE'
const SET_MY_COURSE = 'SET_MY_COURSE'
const SET_HOT_COURSE = 'SET_HOT_COURSE'
const REQ_SINGLE_COURSE = 'REQ_SINGLE_COURSE'
const SET_SINGLE_COURSE = 'SET_SINGLE_COURSE'
const REQ_RECOMMENDATION = 'REQ_RECOMMENDATION'
const SET_RECOMMENDATION  = 'SET_RECOMMENDATION'
const REQ_COMMENTS = 'REQ_COMMENTS'
const SET_COMMENTS  = 'SET_COMMENTS'
const REQ_CHAPTER_LIST = 'REQ_CHAPTER_LIST'
const SET_CHAPTER_LIST  = 'SET_CHAPTER_LIST'
const REQ_CONTENT = 'REQ_CONTENT'
const SET_CONTENT  = 'SET_CONTENT'
const REQ_READ_CHAPTER = 'REQ_READ_CHAPTER'
const REQ_LIKE = 'REQ_LIKE'
const REQ_UNLIKE = 'REQ_UNLIKE'
const REQ_PURCHASE_COURSE = 'REQ_PURCHASE_COURSE'
const REQ_ADD_COMMENT = 'REQ_ADD_COMMENT'
// FOR DEVELOPMENT ONLY

type Action = {
  type: typeof REQ_ALL_COURSE,
} | {
  type: typeof REQ_MY_COURSE,
} | {
  type: typeof SET_MY_COURSE,
  allCourse: any
} | {
  type: typeof REQ_SINGLE_COURSE,
} | {
  type: typeof SET_SINGLE_COURSE,
  singleCourse: any
} |  {
  type: typeof REQ_HOT_COURSE,
} | {
  type: typeof SET_HOT_COURSE,
  hotCourse: any
} | {
  type: typeof REQ_RECOMMENDATION,
} | {
  type: typeof SET_RECOMMENDATION,
  recommendation: any
} | {
  type: typeof REQ_COMMENTS,
} | {
  type: typeof SET_COMMENTS,
  comments: any
} | {
  type: typeof REQ_CHAPTER_LIST,
} | {
  type: typeof SET_CHAPTER_LIST,
  chapter: any
} | {
  type: typeof REQ_CONTENT,
} | {
  type: typeof SET_CONTENT,
  content: any
} | {
  type: typeof REQ_READ_CHAPTER
} | {
  type: typeof REQ_LIKE,
} | {
  type: typeof REQ_UNLIKE,
} | {
  type: typeof REQ_PURCHASE_COURSE,
} | {
  type: typeof REQ_ADD_COMMENT
}

type State = {
  recommendation: any,
  singleCourse: any,
  hotCourse: any,
  myCourse: any,
  comments: any,
  chapter: any,
  content: any,
}
const initialState: State = {
  recommendation: [],
  singleCourse: {},
  hotCourse: [],
  myCourse: [],
  comments: [],
  chapter: [],
  content: {}
}

const reqAllCourse = () => ({type: REQ_ALL_COURSE})
const reqRecommendation = () => ({type: REQ_RECOMMENDATION})
const setRecommendation = (recommendation) => ({type: SET_RECOMMENDATION, recommendation})
const reqSingleCourse = (courseID, cb) => ({type: REQ_SINGLE_COURSE, courseID, cb})
const setSingleCourse = (singleCourse) => ({type: SET_SINGLE_COURSE , singleCourse})
const reqHotCourse = () => ({type: REQ_HOT_COURSE})
const setHotCourse = (hotCourse) => ({type: SET_HOT_COURSE , hotCourse})
const reqMyCourse = () => ({type: REQ_MY_COURSE})
const setMyCourse = (myCourse) => ({type: SET_MY_COURSE , myCourse})
const reqComments = () => ({type: REQ_COMMENTS})
const setComments = (comments) => ({type: SET_COMMENTS , comments})
const reqChapterList = (cb) => ({type: REQ_CHAPTER_LIST, cb})
const setChapterList = (chapter) => ({type: SET_CHAPTER_LIST , chapter})
const reqContent = (lectureID, cb) => ({type: REQ_CONTENT, lectureID, cb})
const setContent = (content) => ({type: SET_CONTENT , content})
const reqReadChapter = (lectureID) => ({type: REQ_READ_CHAPTER, lectureID})
const reqLike = (cb) => ({type: REQ_LIKE, cb})
const reqUnlike = (cb) => ({type: REQ_UNLIKE, cb})
const reqPurchaseCourse = (cb) => ({type: REQ_PURCHASE_COURSE, cb})
const reqAddComment = (comment, cb) => ({type: REQ_ADD_COMMENT, comment, cb})

export const actions = { reqAllCourse, reqSingleCourse, reqRecommendation, reqHotCourse, reqMyCourse, reqComments, reqChapterList, reqContent, reqReadChapter, reqLike, reqUnlike, reqPurchaseCourse, reqAddComment }

export const reducer = function(state: State = initialState, action: Action): State {
  switch (action.type) {
    case SET_SINGLE_COURSE:
      return update(state, {singleCourse: {$set: action.singleCourse}})
    case SET_RECOMMENDATION:
      return update(state, {recommendation: {$set: action.recommendation}})
    case SET_HOT_COURSE:
      return update(state, {hotCourse: {$set: action.hotCourse}})
    case SET_MY_COURSE:
      return update(state, {myCourse: {$set: action.myCourse}})
    case SET_COMMENTS:
      return update(state, {comments: {$set: action.comments}})
    case SET_CHAPTER_LIST:
      return update(state, {chapter: {$set: action.chapter}})
    case SET_CONTENT:
      return update(state, {content: {$set: action.content}})
  }
  return state
}

function* rqAllCourse(action) {
  //fetch api here
  const result = yield fetchWithPost(`user/course/init`)
  if((result || {}).success){
    const { content } = result
    yield put(setHotCourse(content.hot))
    yield put(setMyCourse(content.course))
  }
  //yield put(setUserList(user))
}

function* rqMyCourse(action) {
  //fetch api here
  const result = yield fetchWithPost(`user/course/read`)
  if((result || {}).success){
    const { content } = result
    yield put(setMyCourse(content.hot))
  }
  //yield put(setUserList(user))
}

function* rqSingleCourse(action) {
  const { courseID, cb } = action;
  const result = yield fetchWithPost(`user/course/${courseID}` );
  if ((result || {}).success) {
    const { course, comment_list } = result.content;
    yield put(setSingleCourse(course));
    if (cb) {
      cb(true)
    }
  }
}

function* rqRecommendation(action) {
  const recommendationData = [
    {index: 0, image: 'https://images.pexels.com/photos/207708/pexels-photo-207708.jpeg', title: '國際商務與行銷', content: '手把手教你六種國際商務與行銷的技巧。你永遠不會知道對手對一手牌是什麼?', level: '高級', view: '3023', time: '1時20分'},
    {index: 1, image: 'https://images.pexels.com/photos/207708/pexels-photo-207708.jpeg', title: '管理技巧的三個絕招', content: '手把手教你三種大公司都在使用的管理絕招！', level: '高級', view: '3023', time: '1時20分'},
    {index: 2, image: 'https://images.pexels.com/photos/207708/pexels-photo-207708.jpeg', title: '演講也是一門藝術！', content: '手把手教你六種國際商務與行銷的技巧。你永遠不會知道對手對一手牌是什麼?', level: '高級', view: '3023', time: '1時20分'},
    {index: 3, image: 'https://images.pexels.com/photos/207708/pexels-photo-207708.jpeg', title: '國際商務與行銷', content: '邀請來自美國哈佛知名講師教你如何運用技巧說出藝術!', level: '高級', view: '3023', time: '1時20分'},
    {index: 4, image: 'https://images.pexels.com/photos/207708/pexels-photo-207708.jpeg', title: '國際商務與行銷', content: '手把手教你六種國際商務與行銷的技巧。你永遠不會知道對手對一手牌是什麼?', level: '高級', view: '3023', time: '1時20分'},
    {index: 5, image: 'https://images.pexels.com/photos/207708/pexels-photo-207708.jpeg', title: '國際商務與行銷', content: '手把手教你六種國際商務與行銷的技巧。你永遠不會知道對手對一手牌是什麼?', level: '高級', view: '3023', time: '1時20分'},
    {index: 7, image: 'https://images.pexels.com/photos/207708/pexels-photo-207708.jpeg', title: '國際商務與行銷', content: '手把手教你六種國際商務與行銷的技巧。你永遠不會知道對手對一手牌是什麼?', level: '高級', view: '3023', time: '1時20分'},
  ]

  yield put(setRecommendation(recommendationData))
  //fetch api here
  /* const prevToken = yield select(state=>state.auth.token)
  const result = yield fetchWithPost(`user/autologin`, prevToken )
  if(result.success){
    console.log(result)
  } */
}

function* rqComments(action) {
  const { id } = yield select(state=>state.course.singleCourse);
  const result = yield fetchWithPost(`user/course/comment`, {id: '491', token: 'Gn16w8aKsKef6SUUnUfG', course_id: id })
  if((result || {}).success){
    const { content } = result 
    yield put(setComments(content))
    if(cb)
      cb(true)
  }
}

function* rqLike(action) {
  const { cb } = action;
  const { id } = yield select(state=>state.course.singleCourse);
  console.log(cb);
  const result = yield fetchWithPost(`user/course/like`, {course_id: id})
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
  const { id } = yield select(state=>state.course.singleCourse);
  console.log(cb);
  const result = yield fetchWithPost(`user/course/unlike`, {course_id: id})
  if ((result || {}).success) {
    if (result.content === 'success') {
      if (cb) {
        cb()
      }
    }
  }
}

function* rqChapterList(action) {
  const { cb } = action;
  const { id } = yield select(state=>state.course.singleCourse);
  console.log(`inside chapter ${id}`);
  const result = yield fetchWithPost(`user/course/lecture`, {course_id: id})
  
  if ((result || {}).success){
    console.log(result);
    const { content } = result;
    yield put(setChapterList(content));
    if (cb) {
      cb(true)
    }
  }
}

function* rqContent(action) {

  const { lectureID, cb } = action

  const result = yield fetchWithPost(`user/course/lecture/${lectureID}`)
  
  if ((result || {}).success) {
    console.log(result);
    const { lecture } = result.content;
    yield put(setContent(lecture));
    if (cb) {
      cb(true)
    }
  }
  
  //fetch api here
  /* const prevToken = yield select(state=>state.auth.token)
  const result = yield fetchWithPost(`user/autologin`, prevToken )
  if(result.success){
    console.log(result)
  } */
}

function* rqReadChapter(action) {
  const { lectureID } = action
  const result = yield fetchWithPost(`user/course/lecture/read`, {lecture_id: lectureID})
  if ((result || {}).success){
  }
}

function* rqPurchaseCourse(action) {
  const { id } = yield select(state=>state.course.singleCourse);
  const { cb } = action
  const result = yield fetchWithPost(`user/course/purchase`, {course_id: id})
  if (result.success) {
    if (cb) {
      cb(result.content)
    }
  } else {
    if (cb) {
      cb(result.content)
    }
    
  }
}

function* rqAddComment(action) {
  const { comment, cb } = action
  const course_id = yield select(state=>state.course.singleCourse.id);
  const result = yield fetchWithPost(`user/course/comment/add`, {course_id, comment})
  if (cb) {
    cb(result)
  }
}

export const sagas = [
  function* (): any { yield takeEvery(REQ_ALL_COURSE, rqAllCourse) },
  function* (): any { yield takeEvery(REQ_SINGLE_COURSE, rqSingleCourse) },
  function* (): any { yield takeEvery(REQ_RECOMMENDATION, rqRecommendation) },
  function* (): any { yield takeEvery(REQ_COMMENTS, rqComments) },
  function* (): any { yield takeEvery(REQ_CHAPTER_LIST, rqChapterList) },
  function* (): any { yield takeEvery(REQ_CONTENT, rqContent) },
  function* (): any { yield takeEvery(REQ_READ_CHAPTER, rqReadChapter) },
  function* (): any { yield takeEvery(REQ_LIKE, rqLike) },
  function* (): any { yield takeEvery(REQ_UNLIKE, rqUnlike) },
  function* (): any { yield takeEvery(REQ_PURCHASE_COURSE, rqPurchaseCourse) },
  function* (): any { yield takeEvery(REQ_ADD_COMMENT, rqAddComment)}
]
