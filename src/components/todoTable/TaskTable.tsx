import "../../scss/task.scss";
import {
  Draggable,
  DraggableProvided,
} from "react-beautiful-dnd";
import { CSSProperties } from "react";
import { useRef } from "react";

type TaskProps = {
  task: {
    id: number;
    content: string;
  };
  index: number;
  namecolumn:string
};

function Task({ task, index, namecolumn }: TaskProps) {

  return (
    <Draggable key={task.id} draggableId={`task-${task.id}`} index={index}>
      {(provided: DraggableProvided, snapshot) => (
        <div
          style={{ wordWrap: "break-word" }}
          className={`taskTable ${
            snapshot.isDragging ? "moune" : ""
          }`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="task__content">{task.content}</div>
          <div className="task__20">{namecolumn}</div>
          <div className="task__20"></div>
          <div className="task__20"></div>
          <div className="task__20"></div>
        </div>
      )}
    </Draggable>
  );
}

export default Task;
