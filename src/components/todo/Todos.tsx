import React, { useState, useRef, useEffect, RefObject } from "react";
import "../../scss/todo.scss";
import Column from "./Column";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { getData, putData } from "../../services";
import { fetchTableLess, todoPage } from "../../store/todoPage";
import { useParams } from "react-router-dom";
import TodosTable from "../todoTable/TodosTable";
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
  member: any;
  name: string;
  tasks: { [taskId: string]: Task };
  columns: { [columnId: string]: Column };
  columnOrder: string[];
}
interface SideBarProps {
  slidebarToTodos: boolean;
  setSlidebarToTodos: React.Dispatch<React.SetStateAction<boolean>>;
  table: Item;
}

function Todos({ slidebarToTodos, setSlidebarToTodos, table }: SideBarProps) {
  console.log(table);

  const [stores, setStores] = useState<Item>(table);
  const [toggle, setToggle] = useState<boolean>(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [textClumn, setTextClumn] = useState<string>("");
  const [activeTextArea, setActiveTextArea] = useState<any>(null);
  const [typeTable, setTypeTable] = useState<string>("table1");
  console.log(stores)
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  // <scroll-x>
  const { id } = useParams();
  const textareaRef = useRef<any>(null);

  useEffect(() => {
    setStores(table);
  }, [table]);

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
  function layChuCaiDau(ten: string) {
    if (ten && ten.trim() !== '') {

      const tenDaXuLi = ten.split(" ");
      const chuCaiCuoi = tenDaXuLi[tenDaXuLi.length - 1].charAt(0);

      const chuCaiDau = tenDaXuLi[0].charAt(0);
      if (tenDaXuLi.length > 1) {

        return chuCaiDau.toUpperCase() + chuCaiCuoi.toUpperCase();
      } else {
        return chuCaiDau.toUpperCase()

      }
    }
    return '';
  }

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
  function removeScreen() {
    setTypeTable("table2");
  }

  return (
    <div
      className={`todos ${slidebarToTodos ? "fullscreen" : ""}`}
      ref={elementRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className={`todo-slideBar ${slidebarToTodos ? "fullscreen" : ""}`}>
        <div className="todo-slideBar__left">
          <i
            onClick={() => setSlidebarToTodos(!slidebarToTodos)}
            className={`fa-solid fa-circle-chevron-left ${slidebarToTodos ? "hien" : ""
              }`}
          ></i>
          <div className="todo-slideBar__name">{stores.name}</div>
          <div
            onClick={() => setTypeTable("table1")}
            className={`todo-slideBar__table ${typeTable === "table1" ? "curent" : ""
              }`}
          >
            <i
              style={{ rotate: "180deg" }}
              className="fa-solid fa-chart-simple"
            ></i>
            <div>Bảng</div>
          </div>
          <div
            onClick={() => removeScreen()}
            className={`todo-slideBar__table ${typeTable === "table2" ? "curent" : ""
              }`}
          >
            <i className="fa-solid fa-table-cells"></i>
            <div>Bảng</div>
          </div>
        </div>




        <div className="todo-slideBar__right">
          <div className="todo-slideBar__filer">
            <i className="fa-solid fa-arrow-down-short-wide"></i>
            <div>Lọc</div>
          </div>
          <span></span>
          <div className="list__member">
            {stores.member.map((item: any) => <div className="member">
              {item.img ?
                <div className="wrapnt1">
                  <img className="pictureuser" src={item.img} alt="" />
                  <img className="icon__arrow-up" style={item.position === "boss" ? {} : { display: "none" }} src="https://trello.com/assets/88a4454280d68a816b89.png" alt="" />

                </div>
                :
                <div className="wrapnt1" >
                  <div className="wrapnt" style={{ backgroundColor: `${item.color}` }}>{layChuCaiDau(item.tk)}</div>
                  <img className="icon__arrow-up" style={item.position === "boss" ? {} : { display: "none" }} src="https://trello.com/assets/88a4454280d68a816b89.png" alt="" />
                </div>}
            </div>)}
          </div>
          <div className="btn__share">
            <img src="/add-contact.png" alt="" />
            <div>chia sẻ</div>
          </div>


        </div>

      </div>
      {typeTable === "table1" ? (
        <div  className="list-column">
          <DragDropContext  onDragEnd={handleDragAndDrop}>
            <Droppable
              droppableId="all-columns"
              direction="horizontal"
              type="column"
            >
              {(provided) => (
                <div
                  style={{ display: "flex" }}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {stores?.columnOrder?.map((columnId, index) => {
                    const column = stores.columns[columnId];
                    const tasks = column.taskIds?.map(
                      (taskId) => stores.tasks[taskId]
                    );

                    return (
                      <Column
                        setStores={setStores}
                        stores={stores}
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
          <div
            id="add-list"
            style={{ position: "relative", width: "max-content" }}
          >
            <div
              ref={textareaRef}
              className={`column-todo addtodo ${toggle ? "hide" : ""}`}
            >
              <input
                ref={inputRef}
                type="text"
                value={textClumn}
                placeholder="Nhập tiêu đề danh sách..."
                onChange={(e) => setTextClumn(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <div className="options">
                <div onClick={() => AddColumn()} className="btn-add">
                  Thêm danh sách
                </div>
                <img
                  onClick={() => handleCloceAddColumn()}
                  src="/close.png"
                  alt=""
                />
              </div>
            </div>
            <div
              ref={containerRef}
              className={`btn-tranfer ${toggle ? "" : "visible"}`}
              onClick={() => handleVisibleAddColumn()}
            >
              <div className="icon-plus">+</div>
              <div>Thêm vào danh sách</div>
            </div>
          </div>
        </div>
      ) : (
        <TodosTable
          slidebarToTodos={slidebarToTodos}
          setSlidebarToTodos={setSlidebarToTodos}
          setStores={setStores}
          stores={stores}
        />
      )}
    </div>
  );
}

export default React.memo(Todos);
