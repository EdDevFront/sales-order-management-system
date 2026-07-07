import { all, fork } from "redux-saga/effects";
import { watchOrderSagas } from "./orderSaga";

export default function* rootSaga() {
  yield all([fork(watchOrderSagas)]);
}
