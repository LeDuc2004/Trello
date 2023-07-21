import React, { useState, useRef, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { SocketContext } from "../../context/SocketContext";

import { getData, putData } from "../../services";

import Column from "./Column";
import { todoPage } from "../../store/todoPage";
import TodosTable from "../todoTable/TodosTable";
import BarChartTaskOfMember, {
  BarChart,
  BarChartDate,
  BarChartTags,
} from "../todoChart/Chart";
import FilterTable from "../FilterTable";

import "../../scss/todo.scss";

type Task = {
  id: number;
  content: string;
  member: any[];
  tags: any[];
  date: any;
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
  btnShare: any;
  setDataTask: any;
  listHide: any;
}

function Todos({
  slidebarToTodos,
  setSlidebarToTodos,
  table,
  btnShare,
  setDataTask,
  listHide,
}: SideBarProps) {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<HTMLDivElement | null>(null);
  const refTableFilter = useRef<any>(null);

  const [stores, setStores] = useState<Item>(table);
  const [toggle, setToggle] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const [textClumn, setTextClumn] = useState<string>("");
  const [activeTextArea, setActiveTextArea] = useState<any>(null);
  const [typeTable, setTypeTable] = useState<string>("table1");
  const [position, setPosition] = useState<string>("");
  const [toggleFilter, setToggleFiler] = useState<boolean>(false);
  const [toggleTags, setToggleTags] = useState<boolean>(false);
  
  const API_DATA_NODEJS = process.env.REACT_APP_API_NODEJS;
  const socket: Socket = useContext(SocketContext)

  // <scroll-x>
  const { id } = useParams();
  useEffect(() => {
    if (id) {
      socket.emit("join_room", id);
    }
  }, [id, socket]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setStores(data.newState);
    });
  }, [socket]);

  const textareaRef = useRef<any>(null);

  useEffect(() => {
    setStores(table);
    if (localStorage.getItem("token") != null) {
      fetch(API_DATA_NODEJS+"/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Beaer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          let identifyPosition = table.member.find(
            (member: any) => member.id === data.user.id
          );
          if (identifyPosition) {
            setPosition(identifyPosition.position);
          }
        });
    }
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
    if (ten && ten.trim() !== "") {
      const tenDaXuLi = ten.split(" ");
      const chuCaiCuoi = tenDaXuLi[tenDaXuLi.length - 1].charAt(0);

      const chuCaiDau = tenDaXuLi[0].charAt(0);
      if (tenDaXuLi.length > 1) {
        return chuCaiDau.toUpperCase() + chuCaiCuoi.toUpperCase();
      } else {
        return chuCaiDau.toUpperCase();
      }
    }
    return "";
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
    if (position && position !== "Quan sát viên") {
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
        socket.emit("send_message", { id, newState });
        putData(`/dataTable/${id}`, newState).then((res) =>
          dispatch(todoPage.actions.updateTable(newState))
        );

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
        socket.emit("send_message", { id, newState });

        putData(`/dataTable/${id}`, newState).then((res) =>
          dispatch(todoPage.actions.updateTable(newState))
        );

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
      socket.emit("send_message", { id, newState });
      putData(`/dataTable/${id}`, newState).then((res) =>
        dispatch(todoPage.actions.updateTable(newState))
      );
    }
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
        setStores(newColumn);
        putData(`/dataTable/${stores.id}`, newColumn).then((res) => {
          dispatch(todoPage.actions.updateTable(newColumn));
          handleVisibleAddColumn();
        });
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
  function removeScreen(number: number) {
    setTypeTable(`table${number}`);
  }
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!refTableFilter.current?.contains(event.target as Node)) {
        setToggleFiler(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });
  function deleteListHide() {
    setToggleFiler(false);
    dispatch(todoPage.actions.refreshListHide());
  }
  return (
    <>
      <div
        className={`todos ${slidebarToTodos ? "fullscreen" : ""}`}
        style={{
          maxHeight: "calc(100vh - 50px)",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundImage: `url(${table.background})`,
        }}
        ref={elementRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div className={`todo-slideBar ${slidebarToTodos ? "fullscreen" : ""}`}>
          <div className="todo-slideBar__left">
            <i
              onClick={() => setSlidebarToTodos(!slidebarToTodos)}
              className={`fa-solid fa-circle-chevron-left ${
                slidebarToTodos ? "hien" : ""
              }`}
            ></i>
            <div className="todo-slideBar__name">{stores.name}</div>
            <div
              onClick={() => removeScreen(1)}
              className={`todo-slideBar__table ${
                typeTable === "table1" ? "curent" : ""
              }`}
            >
              <i
                style={{ rotate: "180deg" }}
                className="fa-solid fa-chart-simple"
              ></i>
              <div>Bảng</div>
            </div>
            <div
              onClick={() => removeScreen(2)}
              className={`todo-slideBar__table ${
                typeTable === "table2" ? "curent" : ""
              }`}
            >
              <i className="fa-solid fa-table-list"></i>
              <div>Bảng</div>
            </div>
            <div
              onClick={() => removeScreen(3)}
              className={`todo-slideBar__table ${
                typeTable === "table3" ? "curent" : ""
              }`}
            >
              <i className="fa-solid fa-chart-column"></i>

              <div>Biểu đồ</div>
            </div>
          </div>

          <div className="todo-slideBar__right">
            <div
              ref={refTableFilter}
              className={`todo-slideBar__filer ${
                toggleFilter || listHide.length > 0 ? "curent" : ""
              }`}
            >
              <FilterTable
                stores={table}
                setToggleFiler={setToggleFiler}
                toggleFilter={toggleFilter}
              ></FilterTable>
              <div
                data-filter={listHide.includes("nodata") ? 0 : listHide.length}
                className={`iloc ${listHide.length > 0 ? "hide" : ""}`}
                onClick={() => setToggleFiler(!toggleFilter)}
              >
                <i className="fa-solid fa-arrow-down-short-wide"></i>
                <div>Lọc</div>
              </div>

              <i
                onClick={() => deleteListHide()}
                className={`fa-solid fa-xmark ${
                  listHide.length > 0 ? "" : "hide"
                }`}
              ></i>
            </div>
            <span></span>
            <div className="list__member">
              {stores.member.map((item: any) => (
                <div key={item.id} className="member">
                  {item.img ? (
                    <div className="wrapnt1">
                      <img className="pictureuser" src={item.img} alt="" />
                      <img
                        className="icon__arrow-up"
                        style={
                          item.position === "Quản trị viên"
                            ? {}
                            : { display: "none" }
                        }
                        src="https://trello.com/assets/88a4454280d68a816b89.png"
                        alt=""
                      />
                    </div>
                  ) : (
                    <div className="wrapnt1">
                      <div
                        className="wrapnt"
                        style={{ backgroundColor: `${item.color}` }}
                      >
                        {layChuCaiDau(item.tk)}
                      </div>
                      <img
                        className="icon__arrow-up"
                        style={
                          item.position === "Quản trị viên"
                            ? {}
                            : { display: "none" }
                        }
                        src="https://trello.com/assets/88a4454280d68a816b89.png"
                        alt=""
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div onClick={() => btnShare("share")} className="btn__share">
              <img src="/add-contact.png" alt="" />
              <div>chia sẻ</div>
            </div>
          </div>
        </div>
        {typeTable === "table1" ? (
          <div className="list-column">
            <DragDropContext onDragEnd={handleDragAndDrop}>
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
                          listHide={listHide}
                          setStores={setStores}
                          stores={stores}
                          column={column}
                          tasks={tasks}
                          key={columnId}
                          index={index}
                          columnId={columnId}
                          active={activeTextArea === columnId}
                          onclick={() => handleClickTextArea(columnId)}
                          btnShare={btnShare}
                          setDataTask={setDataTask}
                          toggleTags={toggleTags}
                          setToggleTags={setToggleTags}
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
                  className="input_in_column"
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
          ""
        )}
        {typeTable === "table2" ? (
          <TodosTable
            slidebarToTodos={slidebarToTodos}
            setSlidebarToTodos={setSlidebarToTodos}
            setStores={setStores}
            stores={stores}
            btnShare={btnShare}
            setDataTask={setDataTask}
          />
        ) : (
          ""
        )}
        {typeTable === "table3" ? (
          <div className="todo_chart">
            <BarChart columns={stores.columns}></BarChart>
            <BarChartDate tasks={stores.tasks}></BarChartDate>
            <BarChartTaskOfMember tasks={Object.values(stores.tasks)} />
            <BarChartTags tasks={stores.tasks}></BarChartTags>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default React.memo(Todos);
