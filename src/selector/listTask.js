import { createSelector } from "@reduxjs/toolkit";
const table = (state) => state.table;
const members = (state) => state.table.member;
const tags = (state) => state.table.tags;
const date = (state) => state.table.date;


export const productRemain = createSelector(
  [table, members, tags, date],
  (product, membersAccept, tagsAccept, dateAccept) => {
    let stores = product;
    let listResolve = [];
    let listTasks = stores.Table.tasks;
    let listColumns = stores.Table.columns;
    if (
      membersAccept.length > 0 ||
      tagsAccept.length > 0 ||
      dateAccept.length > 0
    ) {
      // lọc members
      if (membersAccept.includes(-1) && membersAccept.length > 1) {
        // chưa giao + giao rồi
        for (const key in listTasks) {
          if (listTasks[key]?.member?.length == 0 || !listTasks[key].member) {
            listResolve.push(listTasks[key].id);
          } else {
            listTasks[key].member.forEach((user) => {
              if (membersAccept.includes(user.id)) {
                listResolve.push(listTasks[key].id);
              }
            });
          }
        }
        // giao rồi
      } else if (!membersAccept.includes(-1)) {
        for (const key in listTasks) {
          listTasks[key]?.member?.forEach((user) => {
            if (membersAccept.includes(user.id)) {
              listResolve.push(listTasks[key].id);
            }
          });
        }
        // chưa giao
      } else if (membersAccept.includes(-1) && membersAccept.length == 1) {
        for (const key in listTasks) {
          if (listTasks[key]?.member?.length == 0 || !listTasks[key].member) {
            listResolve.push(listTasks[key].id);
          }
        }
      }
      // lọc tasks
      if (tagsAccept.length > 0) {
        for (const key in listTasks) {
          listTasks[key].tags.forEach((tag) => {
            if (tagsAccept.includes(tag.id) && tag.status) {
              listResolve.push(listTasks[key].id);
            }
          });
        }
      }
      // lọc date
      console.log(dateAccept);
      if (dateAccept.length > 0) {
        for (const key in listTasks) {
          if (dateAccept.includes("nodate")) {
            if (listTasks[key].date.status == 0) {
              listResolve.push(listTasks[key].id);
            }
          }
          if (dateAccept.includes("late")) {

            if (listTasks[key].date.status == null) {
              listResolve.push(listTasks[key].id);
            }
          }
          if (dateAccept.includes("doing")) {
            if (listTasks[key].date.status === false) {
              console.log(listTasks[key].date.status);
              listResolve.push(listTasks[key].id);
            }
          }
          if (dateAccept.includes("done")) {
            if (listTasks[key].date.status == true) {
              listResolve.push(listTasks[key].id);
            }
          }
          
          
          // listTasks[key].date.forEach((tag) => {
          //   if (tagsAccept.includes(tag.id) && tag.status) {
          //     console.log(tag.id);
          //     listResolve.push(listTasks[key].id);
          //   }
          // });
        }
      }
console.log(membersAccept);
      // lọc những task trùng nhau
      let reset = [...new Set(listResolve)];
      // dữ liệu sau khi lọc xong
      
      let objStore ={
        stores,
        reset: reset.length == 0 ? ["nodata"] : reset
      }
      return  objStore;
    } else {
      let objStore ={
        stores,
        reset:[]
      }
      return objStore;
    }
  }
);
