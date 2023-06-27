import "../../scss/task.scss";
import {
  Droppable,
  DroppableProvided,
  Draggable,
  DraggableProvided,
  DraggingStyle,
  NotDraggingStyle,
} from "react-beautiful-dnd";
import { CSSProperties } from "react";
import { useRef } from "react";

type TaskProps = {
  task: {
    id: number;
    content: string;
  };
  index: number;
};

function Task({ task, index }: TaskProps) {
  return (
    <Draggable key={task.id} draggableId={`task-${task.id}`} index={index}>
      {(provided: DraggableProvided, snapshot) => (
        <div
          className={`task-todo ${snapshot.isDragging ? "moune" : ""} `}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <span>{task.content}</span>
        </div>
      )}
    </Draggable>
  );
}

export default Task;
