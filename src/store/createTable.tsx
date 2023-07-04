import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const createTable = createSlice({
  name: "table",
  initialState: { status: "loading", table: [] , users:[]},
  reducers:{
    addTable:(state : any , action: { payload: any }) => {
      state.table.push(action.payload)
      return state
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTable.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchTable.fulfilled, (state, action) => {
        state.table = action.payload;
        state.status = "idle";
      })
      .addCase(fetchUsers.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.status = "idle";
      })
  },
});

export const fetchTable = createAsyncThunk("table/fetchTable", async (iduser:string | number) => {

  
  const res = await fetch(`http://localhost:3000/users/${iduser}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Beaer ${localStorage.getItem("token")}`,
    }
  })
  let data = await res.json();
  return data.idTable;
});
export const fetchUsers = createAsyncThunk("table/fetchUsers", async () => {

  
  const res = await fetch(`http://localhost:3000/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Beaer ${localStorage.getItem("token")}`,
    }
  })
  let data = await res.json();
  return data;
});

