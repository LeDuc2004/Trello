import React from "react";
import "../../scss/column.scss";
import Task from "./Task";
import { useState, useEffect, useRef, ChangeEvent } from "react";
import { Droppable, DragDropContext, Draggable } from "react-beautiful-dnd";
import { getData, putData } from "../../services";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { useParams } from "react-router-dom";
import { todoPage } from "../../store/todoPage";

type TaskItem = {
  id: number;
  content: string;
};

function Column({ column, tasks, index, columnId, active, onclick }: any) {
  const [toggle, setToggle] = useState<boolean>(false);
  const [value, setValue] = useState("");
  const [indexColumn, setIndexColumn] = useState<string>("");
  const [rows, setRows] = useState(1);
  const { id } = useParams();
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // click outside add task
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!textareaRef.current?.contains(event.target as Node)) {
        setToggle(false);
        setValue("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const handleChildMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };
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
          handleVisibleAddTask(index);
          dispatch(todoPage.actions.updateTable(newColumn));
          setTimeout(() => {
            const container = document.querySelector(".list__columns");

            if (container) {
              console.log(container.scrollTop);
              console.log(container.scrollHeight);

              container.scrollTop = container.scrollHeight;
            }
          }, 0);
        });
      });
    }
  }

  const handleVisibleAddTask = (columnId: string) => {
    onclick();
    setIndexColumn(columnId);
    setToggle(true);
    setTimeout(() => {
      const container = document.querySelector(".list__columns");

      if (container) {
        console.log(container.scrollTop);
        console.log(container.scrollHeight);

        container.scrollTop = container.scrollHeight;
      }
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 0);
  };
  const handleCloceAddTask = () => {
    setToggle(false);
    setValue("");
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
  };
  /// resize TextArea
  useEffect(() => {
    const textarea = document.getElementById(
      `auto-resizable-textarea${index}`
    ) as HTMLTextAreaElement;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;

    const container = document.querySelector(".list__columns");

    if (container) {
      console.log(container.scrollTop);
      console.log(container.scrollHeight);

      container.scrollTop = container.scrollHeight;
    }
    setRows(textarea.rows);
  }, [value]);
  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      AddTask();
    }
  };

  return (
    <>
      <Draggable draggableId={column.id} index={index}>
        {(provided, snapshot) => (
          <div
            {...provided.draggableProps}
            ref={provided.innerRef}
            className="column-todo drag-ignore-events"
            onMouseDown={handleChildMouseDown}
          >
            <div {...provided.dragHandleProps} className="column-todo__name">
              {column.title}
            </div>
            <div className="list__columns">
              <Droppable droppableId={column.id} type="task">
                {(provided, snapshot) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {tasks.map((task: TaskItem, indextask: number) => (
                      <Task key={indextask} task={task} index={indextask} />
                    ))}
                    {provided.placeholder}

                    <div className="options-add">
                      <div
                        className={`add__task ${
                          toggle && active ? "" : "hide"
                        }`}
                      >
                        <textarea
                          ref={textareaRef}
                          id={`auto-resizable-textarea${index}`}
                          value={value}
                          onChange={handleChange}
                          rows={rows}
                          cols={30}
                          placeholder="Nhập tiêu đề cho thẻ này"
                          required
                          onKeyDown={handleKeyPress}
                          // onKeyPress={}
                        ></textarea>
                        <div className="options task">
                          <div onClick={() => AddTask()} className="btn-add">
                            Thêm thẻ
                          </div>
                          <img
                            onClick={() => handleCloceAddTask()}
                            src="/close.png"
                            alt=""
                          />
                        </div>
                      </div>
                      <div
                        onClick={() => handleVisibleAddTask(columnId)}
                        className={`btn__add_task ${
                          toggle && active ? "hide" : ""
                        }`}
                      >
                        <div className="icon-plus">+</div>
                        <div>Thêm thẻ</div>
                      </div>
                    </div>
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

export default Column;
