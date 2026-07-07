import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import uiReducer from "./uiSlice";
import ordersReducer from "./ordersSlice";
import rootSaga from "../sagas";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    orders: ordersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
