import "../../scss/task.scss";
import {
  Droppable,
  DroppableProvided,
  Draggable,
  DraggableProvided,
  DraggingStyle,
  NotDraggingStyle,
} from "react-beautiful-dnd";
import React, { CSSProperties, useState, useEffect } from "react";
import { useRef } from "react";
import { getData, putData } from "../../services";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { todoPage } from "../../store/todoPage";
import layChuCaiDau from "../../utils/laychucaidau";

type TaskProps = {
  task: any;
  index: number;
  setStores: any;
  stores: any;
  btnShare: any;
  setDataTask: any;
};

function Task({
  task,
  index,
  setStores,
  stores,
  btnShare,
  setDataTask,
  toggleTags,
  setToggleTags
}: any) {
  const [stateTask, setStateTask] = useState(task);
  const [textArea, setTextArea] = useState<string>(task.content);
  const [toggleTextArea, setToggleTextArea] = useState<boolean>(false);
  const refTextArea = useRef<any>(null);
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

  useEffect(() => {
    if (task?.date?.time) {
      const currentTime = new Date().getTime();
      const taskTime = new Date(task.date.time).getTime();

      if (taskTime < currentTime && task.date.status == false) {
        let newStore = {
          ...stores,
          tasks: {
            ...stores.tasks,
            [`task-${task.id}`]: {
              ...stores.tasks[`task-${task.id}`],
              date: {
                ...stores.tasks[`task-${task.id}`].date,
                status: null,
              },
            },
          },
        };

        putData(`/dataTable/${newStore.id}`, newStore).then((res) => {
          dispatch(todoPage.actions.updateTable(newStore));
        });
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!refTextArea.current?.contains(event.target as Node)) {
        setToggleTextArea(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });
  
  function handleUpdateTask() {
    setToggleTextArea(true);
    setTimeout(() => {
      if (refTextArea.current) {
        const input = refTextArea.current;
        input.focus();
        input.selectionStart = input.value.length;
        input.selectionEnd = input.value.length;
      }
    }, 0);
  }
  function handleEnter(e: any) {
    if (e === "Enter") {
      onblurTextArea();
    }
  }
  function onblurTextArea() {
    if (textArea && textArea != task.content) {
      setToggleTextArea(false);

      let newStore = {
        ...stores,
        tasks: {
          ...stores.tasks,
          [`task-${task.id}`]: {
            ...stores.tasks[`task-${task.id}`],
            content: textArea,
          },
        },
      };

      setStores(newStore);
      putData(`/dataTable/${newStore.id}`, newStore).then((res) =>
        dispatch(todoPage.actions.updateTable(newStore))
      );
    } else {
      setTextArea(task.content);
    }
  }
  function handleTask(dataTask: any) {
    setDataTask(dataTask);
    btnShare("task");
  }
  function handleCheckBox() {
    const currentTime = new Date().getTime();
    const taskTime = new Date(task.date.time).getTime();
    const statusDate = stores.tasks[`task-${task.id}`].date.status;
    let newStore = {
      ...stores,
      tasks: {
        ...stores.tasks,
        [`task-${task.id}`]: {
          ...stores.tasks[`task-${task.id}`],
          date: {
            ...stores.tasks[`task-${task.id}`].date,
            status:
              taskTime > currentTime ? !statusDate : statusDate ? null : true,
          },
        },
      },
    };

    setStores(newStore);
    putData(`/dataTable/${newStore.id}`, newStore).then((res) =>
      dispatch(todoPage.actions.updateTable(newStore))
    );
  }
  

  return (
    <Draggable key={task.id} draggableId={`task-${task.id}`} index={index}>
      {(provided: DraggableProvided, snapshot) => (
        <div
          draggable={false}
          style={{ wordWrap: "break-word" }}
          className={`task-todo ${snapshot.isDragging ? "moune" : ""}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div
            className={`wrap__fa-pen-to-square ${toggleTextArea ? "" : "hide"}`}
          >
            <textarea
              onKeyDown={(e) => handleEnter(e.key)}
              onChange={(e) => setTextArea(e.target.value)}
              onBlur={() => onblurTextArea()}
              ref={refTextArea}
              className={`text__area ${toggleTextArea ? "" : "hide"}`}
              value={textArea}
              name=""
              id=""
              cols={30}
              rows={10}
            ></textarea>
            <div className="update-content" onClick={() => handleUpdateTask()}>
              <i className="fa-solid fa-pen-to-square"></i>
            </div>
            {task?.tags ? (
              <div className={`task-top `}>
                {task?.tags.map((item: any,index:number) =>
                  item.status ? (
                    <div
                      key={item.id}
                      style={{ backgroundColor: `${item.color}` }}
                      className={`tag-top ${toggleTags ? "content" : ""}`}
                      onClick={()=>setToggleTags(!toggleTags)}
                    >{toggleTags ? stores.tagsname[index] :""}</div>
                  ) : (
                    ""
                  )
                )}
              </div>
            ) : (
              ""
            )}

            <div onClick={() => handleTask(task)} className="task-text">
              {task.content}
            </div>
            <div className="task-bottom">
              <div className="task-date">
                {task.date?.time ? (
                  <div className="task-date">
                    <div
                      className={`date-iid ${
                        task.date?.status
                          ? "done"
                          : task.date?.status == null
                          ? "late"
                          : ""
                      }`}
                    >
                      <i className="fa-regular fa-clock"></i>
                      <input
                        checked={task.date?.status}
                        className="input-check"
                        onChange={handleCheckBox}
                        type="checkbox"
                      />
                      <div
                        onClick={() => handleCheckBox()}
                        className="date-text"
                      >
                        {task.date.time.split(" ")[0]}
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {task.description ? (
                  <i className="fa-solid fa-align-right"></i>
                ) : (
                  ""
                )}
              </div>

              <div className="task-member">
                {task?.member?.length > 0
                  ? task.member.map((item: any) => {
                      return item.img ? (
                        <img
                          key={item.id}
                          className="wrap-img"
                          src={item.img}
                          alt=""
                        />
                      ) : (
                        <div
                          key={item.id}
                          className="wrap-img"
                          style={{ backgroundColor: `${item.color}` }}
                        >
                          {layChuCaiDau(item.tk)}
                        </div>
                      );
                    })
                  : ""}
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default React.memo(Task);
