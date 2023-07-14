import { createSelector } from "@reduxjs/toolkit";
const table = (state) => state.table;
const members = (state) => state.table.member;
const tags = (state) => state.table.tags;
const date = (state) => state.table.date;

export const productRemain = createSelector(
  [table, members, tags, date],
  (product, members, tags, date) => {
    console.log(members);  
    let stores = product
    let listResolve = []
    let listTasks = stores.Table.tasks
    let listColumns = stores.Table.columns
    
    if (members.length > 0 && members.includes(-1)) {
        for (const key in listTasks) {
            if (listTasks[key]?.member?.length == 0 || !listTasks[key].member) {
                listResolve.push(key)
            }
        }
       let reset = [...new Set(listResolve)]
    for (const key in listColumns) {
      let newTaskIds = listColumns[key].taskIds.filter((taskid) => {
        console.log(reset.includes(taskid));
        if (reset.includes(taskid)) {
            return taskid
        }
      })
      listColumns = {
        ...listColumns,
        [key]:{
            ...listColumns[key],
            taskIds:newTaskIds
        }
      }
    }
    console.log(listColumns);
    }else if (members.length > 0 && members.includes(-1)){

    }
    return stores
  }
);
