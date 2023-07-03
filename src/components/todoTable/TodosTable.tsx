import React, { useState, useRef, useEffect, RefObject } from "react";
import "../../scss/table.scss";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { getData, putData } from "../../services";
import { todoPage } from "../../store/todoPage";
import { useParams } from "react-router-dom";
import ColumnTable from "./ColumnTable";
type Task = {
  id: number;
  content: string;
};

type Column = {
  id: string;
  title: string;
  taskIds: string[];
};

interface Item {
  id: number | string;
  background: string;
  name: string;
  tasks: { [taskId: string]: Task };
  columns: { [columnId: string]: Column };
  columnOrder: string[];
}
interface SideBarProps {
  slidebarToTodos: boolean;
  setSlidebarToTodos: React.Dispatch<React.SetStateAction<boolean>>;
  stores: Item;
  setStores:any
}

function TodosTable({
  slidebarToTodos,
  setSlidebarToTodos,
  stores,
  setStores
}: SideBarProps) {
  const [toggle, setToggle] = useState<boolean>(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [textClumn, setTextClumn] = useState<string>("");
  const [activeTextArea, setActiveTextArea] = useState<any>(null);

  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  // <scroll-x>
  const { id } = useParams();
  const textareaRef = useRef<any>(null);

  useEffect(() => {
    setStores(stores);
  }, [stores]);

  // click outside add task
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!textareaRef.current?.contains(event.target as Node)) {
        setToggle(true);
        setTextClumn("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
    setStartX(event.pageX - (elementRef.current?.offsetLeft || 0));
    setScrollLeft(elementRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!isDragging) return;

    const scrollX = event.pageX - (elementRef.current?.offsetLeft || 0);
    const deltaScrollX = scrollX - startX;
    if (elementRef.current) {
      elementRef.current.scrollLeft = scrollLeft - deltaScrollX;
    }
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  //</scroll-x>

  //<scroll maximum bên phải>
  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      container.addEventListener("click", handleVisibleAddColumn);
    }

    return () => {
      if (container) {
        container.removeEventListener("click", handleVisibleAddColumn);
      }
    };
  }, []);
  const handleDragAndDrop = (results: any) => {
    const { source, destination, draggableId, type } = results;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
    if (type === "column") {
      const newColumnOrder = Array.from(stores?.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      const newState = {
        ...stores,
        columnOrder: newColumnOrder,
      };
      setStores(newState);
      putData(`/dataTable/${id}`, newState);

      return;
    }

    const start = stores.columns[source.droppableId];
    const finish = stores.columns[destination.droppableId];


    if (start === finish) {
      const newTaskIds = [...start?.taskIds];

      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };
      const newState = {
        ...stores,
        columns: {
          ...stores.columns,
          [newColumn.id]: newColumn,
        },
      };
      setStores(newState);
      putData(`/dataTable/${id}`, newState);

      return;
    }
    // chuyển task qua lại giữa các cột
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newState = {
      ...stores,
      columns: {
        ...stores.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };
    setStores(newState);
    putData(`/dataTable/${id}`, newState);
  };
  const handleVisibleAddColumn = () => {
    setTextClumn("");
    setTimeout(() => {
      const container = document.querySelector(".todos");

      setToggle(false);
      if (container) {
        container.scrollLeft = container.scrollWidth; // Kéo thanh cuộn ngang về bên phải
      }
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };
  const handleCloceAddColumn = () => {
    setToggle(true);
  };
  // const listColumn: ListColumn = {
  //   id: 0,
  //   background: "./imgtable/photo-1686903431112-9b426ee61dad.jpg",
  //   name: "fathin",
  //   tasks: {
  //     "task-0": { id: 0, content: "Rửa bát" },
  //     "task-1": { id: 1, content: "Quét nhà" },
  //     "task-2": { id: 2, content: "Gặt đồ" },
  //     "task-3": { id: 3, content: "Nấu cơm" },
  //     "task-4": { id: 4, content: "Chơi game" },
  //     "task-5": { id: 5, content: "Ăn cơm" },
  //     "task-6": { id: 6, content: "Nấu cơm" },
  //     "task-7": { id: 7, content: "Chơi game" },
  //     "task-8": { id: 8, content: "Ăn cơm" },
  //   },
  //   columns: {
  //     "column-1": {
  //       id: "column-1",
  //       title: "Todos",
  //       taskIds: ["task-0", "task-1", "task-2", "task-3"],
  //     },
  //     "column-2": {
  //       id: "column-2",
  //       title: "Doing",
  //       taskIds: ["task-4", "task-5"],
  //     }
  //   },
  //   columnOrder: ["column-1", "column-2"],
  // };
  function AddColumn() {
    if (textClumn) {
      getData(`/dataTable/${stores.id}`).then((data) => {
        let columnOrder = [
          ...data.columnOrder,
          `column-${Object.keys(data.columns).length}`,
        ];
        let newColumn = {
          ...data,
          columns: {
            ...data.columns,
            [`column-${Object.keys(data.columns).length}`]: {
              id: `column-${Object.keys(data.columns).length}`,
              title: textClumn,
              taskIds: [],
            },
          },
          columnOrder: columnOrder,
        };
        dispatch(todoPage.actions.updateTable(newColumn));
        putData(`/dataTable/${stores.id}`, newColumn).then((res) =>
          handleVisibleAddColumn()
        );
      });
    }
  }

  // lấy vị trí thẻ textarea
  const handleClickTextArea = (inputId: any) => {
    setActiveTextArea(inputId);
  };

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      AddColumn();
    }
  };

  return (
    <div className="column-table">
      <DragDropContext onDragEnd={handleDragAndDrop}>
        <Droppable
          droppableId="all-columns"
          direction="horizontal"
          type="column"
        >
          {(provided) => (
            <div
              className="list__table"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <div className="column-table__silebar">
                <div className="sile__40">Thẻ</div>
                <div className="sile__20">Danh sách</div>
                <div className="sile__20">Nhãn</div>
                <div className="sile__20">Thành viên</div>
                <div className="sile__20">Ngày hết hạn</div>
              </div>
              {stores.columnOrder.map((columnId, index) => {
                const column = stores.columns[columnId];
                const tasks = column.taskIds?.map(
                  (taskId) => stores.tasks[taskId]
                );

                return (
                  <ColumnTable
                    column={column}
                    tasks={tasks}
                    key={columnId}
                    index={index}
                    columnId={columnId}
                    active={activeTextArea === columnId}
                    onclick={() => handleClickTextArea(columnId)}
                  />
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default React.memo(TodosTable);
