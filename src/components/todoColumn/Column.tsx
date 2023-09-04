import React from "react";
import Task from "./Task";
import { useState, useEffect, useRef, ChangeEvent } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { getData, putData } from "../../services";
import { useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { useParams } from "react-router-dom";
import { scrollToBottom } from "../../utils/scrollBottom";

import { todoPage } from "../../store/todoPage";

import "../../scss/column.scss";
type TaskItem = {
  id: number;
  content: string;
};
function Column({
  setStores,
  stores,
  column,
  tasks,
  index,
  columnId,
  active,
  onclick,
  btnShare,
  setDataTask,
  toggleTags,
  setToggleTags,
  listHide,
}: any) {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const textColumn = useRef<any>(null);

  const [toggle, setToggle] = useState<boolean>(false);
  const [toggleColumn, setToggleColumn] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const [valueInput, setValueInput] = useState(column.title);
  const [rows, setRows] = useState<number>(3);

  const { id } = useParams();

  // click outside add task
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!textareaRef.current?.contains(event.target as Node)) {
        setToggle(false);
        setValue("");
        setToggleColumn(false);
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
              tags: [
                { id: 0, color: "#4bce97", status: false, content: "" },
                { id: 1, color: "#e2b203", status: false, content: "" },
                { id: 2, color: "#faa53d", status: false, content: "" },
                { id: 3, color: "#f87462", status: false, content: "" },
                { id: 4, color: "#9f8fef", status: false, content: "" },
                { id: 5, color: "#579dff", status: false, content: "" },
              ],
              date: {
                time: "",
                status: 0,
              },
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
        setStores(newColumn);
        setValue("");
        handleVisibleAddTask(columnId);
        scrollToBottom(columnId, textareaRef, 0);
        putData(`/dataTable/${id}`, newColumn).then((res) => {
          dispatch(todoPage.actions.updateTable(newColumn));
        });
      });
    }
  }

  const handleVisibleAddTask = (columnId: string) => {
    setValue("");
    onclick();
    setToggle(true);
    scrollToBottom(columnId, textareaRef, 0);
  };
  const handleCloceAddTask = () => {
    setToggle(false);
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
    scrollToBottom(columnId, textareaRef, 1);
    setRows(textarea.rows);
  }, [value]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      AddTask();
    }
  };
  function visibleInputColumn() {
    onclick();
    setToggleColumn(true);
    setTimeout(() => {
      if (textColumn.current) {
        textColumn.current.focus();
      }
    }, 0);
  }
  function handleEnterColumn(e: any) {
    if (e === "Enter") {
      updateNameColumn();
    }
  }
  function updateNameColumn() {
    if (valueInput && valueInput != column.title) {
      setToggleColumn(false);

      let newStore = {
        ...stores,
        columns: {
          ...stores.columns,
          [`${columnId}`]: {
            ...stores.columns[`${columnId}`],
            title: valueInput,
          },
        },
      };
      dispatch(todoPage.actions.updateTable(newStore));
      setStores(newStore);
      putData(`/dataTable/${newStore.id}`, newStore);
    } else {
      setToggleColumn(false);

      setValueInput(column.title);
    }
  }
  return (
    <>
      <Draggable draggableId={column.id} index={index}>
        {(provided, snapshot) => (
          <div
            {...provided.draggableProps}
            ref={provided.innerRef}
            className="column-todo"
            onMouseDown={handleChildMouseDown}
          >
            <div className="fsfev">
              <i className="fa-solid fa-ellipsis-vertical"></i>
            </div>
            <div className="update-clumn">
              <input
                onKeyDown={(e) => handleEnterColumn(e.key)}
                value={valueInput}
                onChange={(e) => setValueInput(e.target.value)}
                className={`input__column input_in_column ${
                  toggleColumn && active ? "" : "hide"
                }`}
                onBlur={updateNameColumn}
                ref={textColumn}
                type="text"
              />
              <div
                onClick={() => visibleInputColumn()}
                {...provided.dragHandleProps}
                className="column-todo__name"
              >
                {column.title}
              </div>
            </div>
            <div
              className={`list__columns ${columnId}`}
              style={
                toggle && active ? { maxHeight: "calc(100vh - 200px)" } : {}
              }
            >
              <Droppable droppableId={column.id} type="task">
                {(provided, snapshot) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    <div style={{ paddingTop: "1px", width: "100%" }}></div>

                    {tasks.map((task: TaskItem, indextask: number) => (
                      <Task
                        setStores={setStores}
                        listHide={listHide}
                        stores={stores}
                        key={indextask}
                        task={task}
                        index={indextask}
                        btnShare={btnShare}
                        setDataTask={setDataTask}
                        toggleTags={toggleTags}
                        setToggleTags={setToggleTags}
                      />
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
                    </div>
                  </div>
                )}
              </Droppable>
            </div>
            <div className="options-add">
              <div
                onClick={() => handleVisibleAddTask(columnId)}
                className={`btn__add_task ${toggle && active ? "hide" : ""}`}
              >
                <div className="icon-plus">+</div>
                <div>Thêm thẻ</div>
              </div>
            </div>
          </div>
        )}
      </Draggable>
    </>
  );
}
export default React.memo(Column);
