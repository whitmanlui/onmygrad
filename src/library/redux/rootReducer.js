// consolidate all reducers here
import { combineReducers } from 'redux';

//import { reducer as tempReducer} from './user/tempReducer';
import { reducer as appReducer} from './appReducer';
import { reducer as authReducer} from './authReducer';
import { reducer as questionReducer} from './questionReducer';
import { reducer as societyReducer} from './societyReducer';
import { reducer as eventReducer} from './eventReducer';
import { reducer as deadlineReducer} from './deadlineReducer';
import { reducer as courseReducer} from './courseReducer';
import { reducer as quizReducer } from './quizReducer';
import { reducer as userReducer } from './userReducer';
import { reducer as meReducer } from './meReducer';

const rootReducer = combineReducers({
  app: appReducer, auth: authReducer, 
  question: questionReducer, society: societyReducer,
  event: eventReducer, deadline: deadlineReducer,
  course: courseReducer, quiz: quizReducer,
  user: userReducer,
  me: meReducer
});

export default rootReducer;
