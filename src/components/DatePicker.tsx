import React from "react";
import { DatePicker, Space } from "antd";
import type { DatePickerProps, RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
import { putData } from "../services";
import { useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { todoPage } from "../store/todoPage";

const dateTimeFormat = "YYYY-MM-DD HH:mm:ss";

const onOk = (
  value: DatePickerProps["value"] | RangePickerProps["value"]
) => {};

function DatePick({date, stores, idTask}: any) {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

  function onChange(value: any, dateString: [string, string] | string) {
    const currentTime = new Date().getTime();
    const taskTime = new Date(dateString.toString()).getTime();
    let newStore = { 
        ...stores,
        tasks: {
          ...stores.tasks,
          [`task-${idTask}`]: {   
            ...stores.tasks[`task-${idTask}`],
            date:{
              time:dateString,
              status:currentTime > taskTime ? null : false
            }
          },
        },
      };
      putData(`/dataTable/${newStore.id}`, newStore).then((res) => {
        dispatch(todoPage.actions.updateTable(newStore));
      });
  }
  

  if (date?.time) {
    
    return (
      <Space direction="vertical" size={12}>
        <DatePicker
          value={dayjs(date.time, dateTimeFormat)}
          showTime
          onChange={onChange}
          onOk={onOk}
        />
      </Space>
    );
  } else {
    return (
      <Space direction="vertical" size={12}>
        <DatePicker showTime onChange={onChange} />
      </Space>
    );
  }
}

export default DatePick;
