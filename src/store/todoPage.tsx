import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const todoPage = createSlice({
  name: "todo",
  initialState: { status: "loading", Table: {} },
  reducers: {
    updateTable: (state: any, action: { payload: any }) => {
      state.Table = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTableLess.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchTableLess.fulfilled, (state, action) => {
        state.Table = action.payload;
        state.status = "idle";
      });
  },
});

export const fetchTableLess = createAsyncThunk(
  "todo/fetchTableLess",
  async (idtable: any) => {
    const res = await fetch(`http://localhost:3000/dataTable/${idtable}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Beaer ${localStorage.getItem("token")}`,
      },
    });
    let data = await res.json();
    return data;
  }
);
