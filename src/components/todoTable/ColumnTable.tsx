import React from "react";
import "../../scss/column.scss";
import { useState, useEffect, useRef, ChangeEvent } from "react";
import { Droppable, DragDropContext, Draggable } from "react-beautiful-dnd";
import { getData, putData } from "../../services";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { useParams } from "react-router-dom";
import { todoPage } from "../../store/todoPage";
import { scrollToBottom } from "../../utils/scrollBottom";
import TaskTable from "./TaskTable";

type TaskItem = {
  id: number;
  content: string;
};

function ColumnTable({ column, tasks, index, columnId, active, onclick }: any) {
  const [toggle, setToggle] = useState<boolean>(false);
  const [value, setValue] = useState("");
  const [rows, setRows] = useState(3);
  const { id } = useParams();
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // click outside add task

  function AddTask() {
    if (value) {
      getData(`/dataTable/${id}`).then((data) => {
        let curentColumn = data.columns[columnId].taskIds;
        curentColumn.push(`task-${Object.keys(data.tasks).length}`);

        let newColumn = {
          ...data,
          tasks: {
            ...data.tasks,
            [`task-${Object.keys(data.tasks).length}`]: {
              id: Object.keys(data.tasks).length,
              content: value,
            },
          },
          columns: {
            ...data.columns,
            [columnId]: {
              ...data.columns[columnId],
              taskIds: curentColumn,
            },
          },
        };
        putData(`/dataTable/${id}`, newColumn).then((res) => {
          setValue("");
          handleVisibleAddTask(columnId);
          dispatch(todoPage.actions.updateTable(newColumn));
          scrollToBottom(columnId, textareaRef, 0);
        });
      });
    }
  }

  const handleVisibleAddTask = (columnId: string) => {
    setValue("");
    onclick();
    setToggle(true);
  };

  /// resize TextArea

  return (
    <>
      <Draggable draggableId={column.id} index={index}>
        {(provided, snapshot) => (
          <div
            {...provided.draggableProps}
            ref={provided.innerRef}
            className="column-todo table"
          >
            <div className={`list__columns table ${columnId}`}>
              <Droppable droppableId={column.id} type="task">
                {(provided, snapshot) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    <div style={{ paddingTop: 0, width: "100%" }}></div>
                    {tasks.map((task: TaskItem, indextask: number) => (
                      <TaskTable
                        key={indextask}
                        task={task}
                        index={indextask}
                        namecolumn={column.title}
                      />
                    ))}
                    {provided.placeholder}
                    <div style={{paddingBottom:"1px", width:"100%"}}></div>
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        )}
      </Draggable>
    </>
  );
}

export default ColumnTable;
