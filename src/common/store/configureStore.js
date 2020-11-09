import { createStore, applyMiddleware } from "redux";

import promise from 'redux-promise-middleware';
import getRootReducer from '../reducers/index';

export default function getStore(navReducer) {
  const store = createStore(
    getRootReducer(navReducer),
    // undefined,
    applyMiddleware(promise)
  );

  return store;
}