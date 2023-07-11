import "../../scss/task.scss";
import { Draggable, DraggableProvided } from "react-beautiful-dnd";
import { CSSProperties } from "react";
import { useRef } from "react";
import layChuCaiDau from "../../utils/laychucaidau";
import { putData } from "../../services";
import { useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { todoPage } from "../../store/todoPage";

type TaskProps = {
  task: {
    id: number;
    content: string;
  };
  index: number;
  namecolumn: string;
};

function Task({ task, index, namecolumn ,stores,setStores}: any) {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  function handleCheckBox() {
    let newStore = {
      ...stores,
      tasks: {
        ...stores.tasks,
        [`task-${task.id}`]: {
          ...stores.tasks[`task-${task.id}`],
          date: {
            ...stores.tasks[`task-${task.id}`].date,
            status: !stores.tasks[`task-${task.id}`].date.status,
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
          style={{ wordWrap: "break-word" }}
          className={`taskTable ${snapshot.isDragging ? "moune" : ""}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="task__content">{task.content}</div>
          <div className="task__20">{namecolumn}</div>
          <div className="task__20">
            {task?.tags.map((item: any) =>
              item.status ? (
                <div
                  key={item.id}
                  style={{ backgroundColor: `${item.color}` }}
                  className="tag-top"
                ></div>
              ) : (
                ""
              )
            )}
          </div>
          <div className="task__20">
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
          <div className="task__20">
          {task.date?.time ? (
                <div className="task-date">
                  <div
                    className={`date-iid ${task.date?.status ? "done" : ""}`}
                  >
                    <i className="fa-regular fa-clock"></i>
                    <input
                      checked={task.date?.status}
                      className="input-check"
                      onChange={handleCheckBox}
                      type="checkbox"
                    />
                    <div onClick={()=>handleCheckBox()}  className="date-text">
                      {task.date.time.split(" ")[0]}
                    </div>
                  </div>
                  {task.direction ? (
                    <i className="fa-solid fa-align-right"></i>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                <div></div>
              )}
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default Task;
