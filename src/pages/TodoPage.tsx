import { useEffect, useState } from "react";
import Header from "../components/common/Header";
import SileBar from "../components/todoColumn/SileBar";
import Todos from "../components/todoColumn/Todos";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { fetchTableLess } from "../store/todoPage";
import { useParams } from "react-router-dom";
import { SelectPosition, SelectPosition1 } from "../components/Select";
import { fetchUsers } from "../store/createTable";
import { getData, putData } from "../services";
import TableAddMember from "../components/common/TableAddMember";
import TableAddTags from "../components/common/TableAddTags";
import React from 'react'

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
  tasks: any;
  columns: { [columnId: string]: Column };
  columnOrder: string[];
}
interface User {
  id: string | number;
  tk: string;
  color: any;
  email: string;
  img: any;
}
interface RootState {
  table: {
    status: string;
    Table: Item;
  };
}
interface ListUser {
  listTable: {
    status: string;
    users: User[];
  };
}
function TodoPage() {
  const { id } = useParams();
  const [toggle, setToggle] = useState<boolean | string>(false);
  const [slidebarToTodos, setSlidebarToTodos] = useState<boolean>(false);
  const [searchEmail, setSearchEmail] = useState<string>("");
  const [position, setPosition] = useState<string>("Thành viên");
  const [idUser, setIdUser] = useState<number | string>("");
  const [tableAddMember, setTableAddMember] = useState<boolean>(false);
  const [tableAddTags, setTableAddTags] = useState<boolean>(false);
  const [textTime, setTextTime] = useState<string>("table0");
  const [dataTask, setDataTask] = useState<any>({ id: 0 });
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

  useEffect(() => {
    dispatch(fetchTableLess(id));
    dispatch(fetchUsers());
  }, []);

  const table = useSelector((state: RootState) => state.table);
  const User = useSelector((state: ListUser) => state.listTable.users).filter(
    (user) => user.email === searchEmail
  );

  function hideWrapTb() {
    setToggle(false);
  }
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
              {table.Table.member.map((member: any) => (
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
                  table.Table?.tasks[`task-${dataTask?.id}`].member?.length > 0
                    ? {}
                    : { display: "none" }
                }
                className="thanh__fasolid"
              >
                <div className="text">Thành viên</div>
                <div className="add_member">
                  {table.Table?.tasks[`task-${dataTask?.id}`].member
                    ? table.Table?.tasks[`task-${dataTask?.id}`].member.map(
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

                  <div className="wrap_icon_plus">
                    <i className="fa-solid fa-plus"></i>
                  </div>
                </div>
              </div>

              <div
                style={dataTask?.tags ? {} : { display: "none" }}
                className="tag_task"
              >
                <div className="text">Nhãn</div>
                <div className="list_tag">
                  <div className="tag"></div>
                  <div className="tag"></div>
                  <div className="tag"></div>
                  <div className="tag"></div>
                  <div className="wrap_icon_plus">
                    <i className="fa-solid fa-plus"></i>
                  </div>
                </div>
              </div>

              <div
                style={dataTask?.date ? {} : { display: "none" }}
                className="date_line"
              >
                <div className="text">Ngày hết hạn</div>
                <div className="wrap_input_date">
                  <input type="checkbox" />
                  <div>29 tháng 7 lúc 15:09</div>
                </div>
              </div>

              <div className="discription">
                <div className="text">Mô tả</div>
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
                setTextTime={setTextTime}
                hide={tableAddTags}
                setTableAddTags={setTableAddTags}
              ></TableAddTags>
              <div onClick={() => handleTableTags()} className="btn_add tag">
                <i className="fa-solid fa-tags"></i>
                <div>Nhãn</div>
              </div>
            </div>

            <div className="btn_add clock_date">
              <i className="fa-regular fa-clock"></i>
              <div>Ngày</div>
            </div>
          </div>
        </div>
      </div>

      <Header></Header>

      <div
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
      >
        <SileBar
          slidebarToTodos={slidebarToTodos}
          setSlidebarToTodos={setSlidebarToTodos}
        ></SileBar>
        {table.status === "idle" ? (
          <Todos
            btnShare={setToggle}
            table={table.Table}
            slidebarToTodos={slidebarToTodos}
            setSlidebarToTodos={setSlidebarToTodos}
            setDataTask={setDataTask}
          ></Todos>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default React.memo(TodoPage);
