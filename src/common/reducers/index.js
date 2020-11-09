import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import user from './user';

export default function getRootReducer(navReducer) {
  return combineReducers({
    nav: navReducer,
    user: user,
    form: formReducer
  });
}

