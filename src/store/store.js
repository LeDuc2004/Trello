import { configureStore } from "@reduxjs/toolkit";
import { createTable } from "./createTable";
import thunkMiddleware from 'redux-thunk';
import { todoPage } from "./todoPage";
const store = configureStore({
  reducer: {
    listTable:createTable.reducer,
    table:todoPage.reducer
  },
  middleware: [thunkMiddleware],
});

export default store;