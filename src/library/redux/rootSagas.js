// consolidate all reducers here
//import { sagas as userSagas } from './user/tempReducer';
import { sagas as appSagas } from './appReducer';
import { sagas as authSagas } from './authReducer';
import { sagas as questionSagas } from './questionReducer';
import { sagas as societySagas } from './societyReducer';
import { sagas as eventSagas } from './eventReducer';
import { sagas as deadlineSagas } from './deadlineReducer';
import { sagas as courseSagas } from './courseReducer';
import { sagas as quizSagas } from './quizReducer';
import { sagas as userSagas } from './userReducer';
import { sagas as meSagas } from './meReducer';

const rootSagas = [
  ...appSagas, ...authSagas,
  ...questionSagas, ...societySagas,
  ...eventSagas, ...deadlineSagas,
  ...courseSagas, ...quizSagas,
  ...userSagas,
  ...meSagas
]

export default rootSagas;
