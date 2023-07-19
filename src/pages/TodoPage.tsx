import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { fetchTableLess, todoPage } from "../store/todoPage";
import { useParams } from "react-router-dom";
import { SelectPosition, SelectPosition1 } from "../components/Select";
import { fetchUsers } from "../store/createTable";
import { getData, putData } from "../services";
import { productRemain } from "../selector/listTask";
import { ShowSuccessToast } from "../utils/toast";

import Header from "../components/common/Header";
import SileBar from "../components/SileBar";
import Todos from "../components/todoColumn/Todos";
import TableAddMember from "../components/common/TableAddMember";
import TableAddTags from "../components/common/TableAddTags";
import React from "react";
import DatePick from "../components/DatePicker";
import layChuCaiDau from "../utils/laychucaidau";


interface User {
  id: string | number;
  tk: string;
  color: any;
  email: string;
  img: any;
}
interface ListUser {
  listTable: {
    status: string;
    users: User[];
  };
}
function TodoPage({slidebarToTodos,setSlidebarToTodos}:any) {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const { id } = useParams();
  
  
  const refTextArea = useRef<any>(null);

  const [toggle, setToggle] = useState<boolean | string>(false);
  const [searchEmail, setSearchEmail] = useState<string>("");
  const [position, setPosition] = useState<string>("Thành viên");
  const [idUser, setIdUser] = useState<number | string>("");
  const [tableAddMember, setTableAddMember] = useState<boolean>(false);
  const [tableAddTags, setTableAddTags] = useState<boolean>(false);
  const [dataTask, setDataTask] = useState<any>({ id: 0 });
  const [textDescription, setTextDescription] = useState<string>("");
  const [toggleDesciption, setToggleDescription] = useState<boolean>(true);
  const [toggleTableDeleteTask, setToggleTableDeleteTask] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchTableLess(id));
    dispatch(fetchUsers());
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!refTextArea.current?.contains(event.target as Node)) {
        setToggleDescription(true);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const table1 = useSelector(productRemain);
  const table = table1.stores;

  const User = useSelector((state: ListUser) => state.listTable.users).filter(
    (user) => user.email === searchEmail
  );

  function hideWrapTb() {
    setToggle(false);
    setToggleTableDeleteTask(false)

  }
  function handleIdUser(user: any) {
    setSearchEmail(user[0].tk);
    setIdUser(user[0].id);
  }

  function handleAddMember() {
    getData(`/users/${idUser}`).then((data) => {
      let idTable1 = {
        id: table.Table.id,
        background: table.Table.background,
        name: table.Table.name,
      };
      data.idTable.push(idTable1);
      putData(`/users/${idUser}`, data).then((res) => {
        let newMember = {
          id: data.id,
          tk: data.tk,
          email: data.email,
          color: data.color ?? false,
          img: data.img ?? false,
          position: position,
        };

        let newTable = {
          ...table.Table,
          member: [...table.Table.member, newMember],
        };
        setSearchEmail("");
        setPosition("Thành viên");

        putData(`/dataTable/${table.Table.id}`, newTable).then((res) =>
          dispatch(fetchTableLess(id))
        );
      });
    });
  }

  function handleTableMember() {
    var div = document.getElementById("your-div");
    var div1 = document.getElementById("wrap__tb__share");

    if (div && div1) {
      div.style.pointerEvents = "none";
      div1.style.pointerEvents = "none";
    }
    setTableAddMember(true);
  }

  function handleTableTags() {
    var div = document.getElementById("your-div");
    var div1 = document.getElementById("wrap__tb__share");

    if (div && div1) {
      div.style.pointerEvents = "none";
      div1.style.pointerEvents = "none";
    }
    setTableAddTags(true);
  }

  function handleCheckBox() {
    const currentTime = new Date().getTime();
    const taskTime = new Date(
      table.Table?.tasks[`task-${dataTask?.id}`]?.date.time
    ).getTime();
    const statusDate = table.Table?.tasks[`task-${dataTask?.id}`]?.date.status;

    let newStore = {
      ...table.Table,
      tasks: {
        ...table.Table?.tasks,
        [`task-${dataTask?.id}`]: {
          ...table.Table?.tasks[`task-${dataTask?.id}`],
          date: {
            ...table.Table?.tasks[`task-${dataTask?.id}`]?.date,
            status:
              taskTime > currentTime ? !statusDate : statusDate ? null : true,
          },
        },
      },
    };

    putData(`/dataTable/${newStore.id}`, newStore).then((res) =>
      dispatch(todoPage.actions.updateTable(newStore))
    );
  }

  function handleKeyPress(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter") {
      setToggleDescription(true);
      let newStore = {
        ...table.Table,
        tasks: {
          ...table.Table?.tasks,
          [`task-${dataTask?.id}`]: {
            ...table.Table?.tasks[`task-${dataTask?.id}`],
            description: textDescription.trim(),
          },
        },
      };

      putData(`/dataTable/${newStore.id}`, newStore).then((res) =>
        dispatch(todoPage.actions.updateTable(newStore))
      );
    }
  }
  function visibleInputColumn() {
    setToggleDescription(false);
    setTimeout(() => {
      if (refTextArea.current) {
        refTextArea.current.focus();
        refTextArea.current.selectionStart = refTextArea.current.value.length;
        refTextArea.current.selectionEnd = refTextArea.current.value.length;
      }
    }, 0);
  }
  function deleteTask(idTask: number) {
    let listColumns = table.Table.columns;
    for (const key in listColumns) {
      let newTaskIds = listColumns[key].taskIds.filter((taskid: any) => {
        if (![`task-${idTask}`].includes(taskid)) {
          return taskid;
        }
      });

      listColumns = {
        ...listColumns,
        [key]: {
          ...listColumns[key],
          taskIds: newTaskIds,
        },
      };
    }
    let newStore = {
      ...table.Table,
      columns:{
        ...listColumns
      }
    }
    dispatch(todoPage.actions.updateTable(newStore))
    setToggleTableDeleteTask(false)
    setToggle(false)
    putData(`/dataTable/${newStore.id}`, newStore)
    ShowSuccessToast("Xóa thành công !")
  }
  
  return (
    <>
      <div
        onClick={() => hideWrapTb()}
        style={toggle ? {} : { display: "none" }}
        id="wrap__tb__share"
      ></div>

      <div
        style={toggle === "share" ? {} : { display: "none" }}
        className="tb__share"
      >
        <div className="tb__share_top">
          <div>chia sẻ bảng</div>
          <i onClick={() => hideWrapTb()} className="fa-solid fa-xmark"></i>
        </div>
        <div className="tb__share_middle">
          <div className="input">
            <input
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              type="text"
              placeholder="Địa chỉ email hoặc tài khoản"
            />
            {User.length > 0 ? (
              <div onClick={() => handleIdUser(User)} className="value_search">
                <div className="wrap_img">
                  {User[0].img ? (
                    <img src={User[0].img} alt="" />
                  ) : (
                    <div
                      className="name"
                      style={{ backgroundColor: User[0].color }}
                    >
                      {layChuCaiDau(User[0].tk)}
                    </div>
                  )}
                </div>
                <div className="value_search_info">
                  <div>{User[0].tk}</div>
                  <div className="email">{User[0].email}</div>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
          <SelectPosition
            setPosition={setPosition}
            position={"Thành viên"}
          ></SelectPosition>
          <div onClick={() => handleAddMember()} className="btn_share">
            chia sẻ
          </div>
        </div>
        <div className="member__inTable">Thành viên trong bảng</div>
        <div className="tb__share_bottom">
          {table.status === "idle" ? (
            <>
              {table.Table?.member?.map((member: any) => (
                <div key={member.id} className="sun__share">
                  <div className="img__name">
                    {member.img ? (
                      <img src={member.img} alt="" />
                    ) : (
                      <div
                        style={{ backgroundColor: member.color }}
                        className="name"
                      >
                        {layChuCaiDau(member.tk)}
                      </div>
                    )}

                    <div className="wrap_info">
                      <div>{member.tk}</div>
                      <div>{member.email}</div>
                    </div>
                  </div>
                  <SelectPosition1 position={member.position}></SelectPosition1>
                </div>
              ))}
            </>
          ) : (
            ""
          )}
        </div>
      </div>

      <div
        style={toggle === "task" ? {} : { display: "none" }}
        className="tb__share task"
      >
        <div className="tb__share_top">
          <div>{dataTask.content}</div>
          <i onClick={() => hideWrapTb()} className="fa-solid fa-xmark"></i>
        </div>
        <div className="wrap_left_right">
          {table.status === "idle" ? (
            <div className="tb__task_left">
              <div
                style={
                  table.Table?.tasks[`task-${dataTask?.id}`]?.member?.length > 0
                    ? {}
                    : { display: "none" }
                }
                className="thanh__fasolid"
              >
                <div className="text">Thành viên</div>

                <div className="add_member">
                  {table.Table?.tasks[`task-${dataTask?.id}`]?.member
                    ? table.Table?.tasks[`task-${dataTask?.id}`]?.member.map(
                        (item: any) => {
                          return item.img ? (
                            <img
                              key={item.id}
                              className="wrap_img"
                              src={item.img}
                              alt=""
                            />
                          ) : (
                            <div
                              key={item.id}
                              style={{ backgroundColor: `${item.color}` }}
                              className="wrap_img"
                            >
                              {layChuCaiDau(item.tk)}
                            </div>
                          );
                        }
                      )
                    : ""}

                  <div
                    onClick={() => handleTableMember()}
                    className="wrap_icon_plus"
                  >
                    <i className="fa-solid fa-plus"></i>
                  </div>
                </div>
              </div>

              <div className="tag_task">
                {table.Table?.tasks[`task-${dataTask?.id}`]?.tags.length > 0 ? (
                  <>
                    <div className="text">Nhãn</div>
                    <div className="list_tag">
                      {table.Table?.tasks[`task-${dataTask?.id}`]?.tags.map(
                        (item: any, index: number) =>
                          item.status ? (
                            <div
                              key={item.id}
                              style={{ backgroundColor: `${item.color}` }}
                              className="tag"
                            >
                              <div>{table.Table.tagsname[index]}</div>
                            </div>
                          ) : (
                            ""
                          )
                      )}
                      <div
                        onClick={() => handleTableTags()}
                        className="wrap_icon_plus"
                      >
                        <i className="fa-solid fa-plus"></i>
                      </div>
                    </div>
                  </>
                ) : (
                  ""
                )}
              </div>

              <div className="date_line">
                <div className="text">Ngày hết hạn</div>
                <div className="wrap_input_date">
                  {table.Table?.tasks[`task-${dataTask?.id}`]?.date?.time !=
                  "" ? (
                    <input
                      onChange={handleCheckBox}
                      checked={
                        table.Table?.tasks[`task-${dataTask?.id}`]?.date
                          ?.status != true
                          ? false
                          : true
                      }
                      type="checkbox"
                    />
                  ) : (
                    ""
                  )}

                  <DatePick
                    date={table.Table?.tasks[`task-${dataTask?.id}`]?.date}
                    stores={table.Table}
                    idTask={dataTask.id}
                  ></DatePick>
                  <div
                    className={
                      table.Table?.tasks[`task-${dataTask?.id}`]?.date?.status
                        ? "status_date"
                        : table.Table?.tasks[`task-${dataTask?.id}`]?.date
                            ?.status === null
                        ? "status_date late"
                        : ""
                    }
                  >
                    {table.Table?.tasks[`task-${dataTask?.id}`]?.date?.status
                      ? "Hoàn thành"
                      : table.Table?.tasks[`task-${dataTask?.id}`]?.date
                          ?.status === null
                      ? "Quá hạn"
                      : ""}
                  </div>
                </div>
              </div>

              <div className="discription">
                <div className="text">Mô tả</div>
                {table.Table?.tasks[`task-${dataTask?.id}`]?.description ? (
                  <div className="dcrt">
                    {toggleDesciption ? (
                      <div onClick={() => visibleInputColumn()}>
                        {
                          table.Table?.tasks[`task-${dataTask?.id}`]
                            ?.description
                        }
                      </div>
                    ) : (
                      <textarea
                        ref={refTextArea}
                        onKeyDown={handleKeyPress}
                        value={textDescription}
                        onChange={(e) => setTextDescription(e.target.value)}
                        className="discription_input"
                        name=""
                        id=""
                        cols={30}
                        rows={10}
                        placeholder="Thêm mô tả chi tiết hơn..."
                      ></textarea>
                    )}
                  </div>
                ) : (
                  <textarea
                    onKeyDown={handleKeyPress}
                    onChange={(e) => setTextDescription(e.target.value)}
                    className="discription_input"
                    name=""
                    id=""
                    cols={30}
                    rows={10}
                    placeholder="Thêm mô tả chi tiết hơn..."
                  ></textarea>
                )}
              </div>
            </div>
          ) : (
            ""
          )}

          <div className="tb_task_right">
            <div className="tb_task_right__top">Thêm vào thẻ</div>
            <div style={{ position: "relative" }}>
              <TableAddMember
                setTableAddMember={setTableAddMember}
                tableAddMember={tableAddMember}
                member={table.Table.member}
                stores={table.Table}
                idTask={dataTask.id}
              ></TableAddMember>
              <div onClick={() => handleTableMember()} className="btn_add user">
                <i className="fa-regular fa-user"></i>
                <div>Thành viên</div>
              </div>
            </div>

            <div style={{ position: "relative" }}>
              <TableAddTags
                setTableAddTags={setTableAddTags}
                hide={tableAddTags}
                stores={table.Table}
                idTask={dataTask.id}
              ></TableAddTags>
              <div onClick={() => handleTableTags()} className="btn_add tag">
                <i className="fa-solid fa-tags"></i>
                <div>Nhãn</div>
              </div>
            </div>

            <div
              onClick={() => setToggleTableDeleteTask(!toggleTableDeleteTask)}
              className="fsftc"
            >
              <i className="fa-solid fa-trash-can"></i>
            </div>
            {toggleTableDeleteTask ? (
              <div className="tb_delete">
                <div className="text">
                  Bạn có muốn xóa Task "{dataTask.content}" không ?
                </div>
                <div className="wrap_btn">
                  <button
                    onClick={() => setToggleTableDeleteTask(false)}
                    className="out"
                  >
                    Thoát
                  </button>
                  <button
                    onClick={() => deleteTask(dataTask.id)}
                    className="comform"
                  >
                    Xác nhận
                  </button>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>

      {/* <div
        id="your-div"
        style={{
          display: "flex",
          width: "100%",
          maxHeight: "calc(100vh - 50px)",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundImage: `url(${table.Table.background})`,
        }}
      > */}
        {table.status === "idle" ? (
          <Todos
            btnShare={setToggle}
            table={table.Table}
            slidebarToTodos={slidebarToTodos}
            setSlidebarToTodos={setSlidebarToTodos}
            setDataTask={setDataTask}
            listHide={table1.reset}
          ></Todos>
        ) : (
          ""
        )}
      {/* </div> */}
    </>
  );
}

export default React.memo(TodoPage);
