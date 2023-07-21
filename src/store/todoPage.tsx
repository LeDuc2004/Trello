import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const todoPage = createSlice({
  name: "todo",
  initialState: {
    status: "loading",
    Table: {},
    member: [],
    tags: [],
    date: [],
    listHide:[]
  },
  reducers: {
    updateTable: (state: any, action: { payload: any }) => {
      state.Table = action.payload;
    },
    filterMember: (state: any, action: { payload: any }) => {
      const existingIndex = state.member.findIndex(
        (item: any) => item === action.payload
      );

      if (existingIndex !== -1) {
        state.member = state.member.filter(
          (item: any) => item !== action.payload
        );
      } else {
        state.member.push(action.payload);
      }
    },
    filterTags: (state: any, action: { payload: any }) => {
      const existingIndex = state.tags.findIndex(
        (item: any) => item === action.payload
      );

      if (existingIndex !== -1) {
        state.tags = state.tags.filter(
          (item: any) => item !== action.payload
        );
      } else {
        state.tags.push(action.payload);
      }
    },
    filterDate: (state: any, action: { payload: any }) => {
      const existingIndex = state.date.findIndex(
        (item: any) => item === action.payload
      );
  
      if (existingIndex !== -1) {
        state.date = state.date.filter(
          (item: any) => item !== action.payload
        );
      } else {
        state.date.push(action.payload);
      }
    },
    refreshListHide: (state: any) => {
       state.listHide = []
       state.tags = []
       state.member = []
       state.date = []
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
