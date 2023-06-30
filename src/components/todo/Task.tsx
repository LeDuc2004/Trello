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


type TaskProps = {
  task: {
    id: number;
    content: string;
  };
  index: number;
  setStores:any,
  stores:any
};

function Task({ task, index , setStores , stores }: TaskProps) {
  
  const [textArea, setTextArea] = useState<string>(task.content);
  const [toggleTextArea, setToggleTextArea] = useState<boolean>(false);
  const refTextArea = useRef<any>(null);
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();


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
        refTextArea.current.select();
      }
    }, 0);
  }
  function onblurTextArea() {
    if (textArea && textArea != task.content) {
      setToggleTextArea(false);

      let newStore = {
        ...stores,
        tasks:{
          ...stores.tasks,
          [`task-${task.id}`] : {
            id:task.id,
            content: textArea
          }

        }
      };

      dispatch(todoPage.actions.updateTable(newStore));
      setStores(newStore);
      putData(`/dataTable/${newStore.id}`, newStore);
    } else {
      setTextArea(task.content);
    }

    
  }
  return (
    <Draggable key={task.id} draggableId={`task-${task.id}`} index={index}>
      {(provided: DraggableProvided, snapshot) => (
        <div
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
            <div onClick={() => handleUpdateTask()}>
              <i className="fa-solid fa-pen-to-square"></i>
            </div>
            {task.content}
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default React.memo(Task);
