import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import "../scss/home.scss";
import { getData, postData, putData } from "../services";
import { createTable, fetchTable } from "../store/createTable";

interface SideBarProps {
  slidebarToTodos: boolean;
  setSlidebarToTodos: React.Dispatch<React.SetStateAction<boolean>>;
}
interface Item {
  id: string | number;
  background: string;
  name: string;
}
interface RootState {
  listTable: {
    status: string;
    table: Item[];
  };
}

function Home({ slidebarToTodos, setSlidebarToTodos }: SideBarProps) {
  const [user, setUser] = useState<boolean>(false);
  const [info, setInfor] = useState<string>("");
  const [iduser, setIduser] = useState<string>("");
  const [imguser, setImg] = useState<string>("");
  const [toggle, setToggle] = useState<boolean>(false);
  const [fontBackground, setFontBackground] = useState<number[]>([1, 0, 0, 0]);
  const [textSearch, setTextSearch] = useState<string>("");
  const [defaultImg, setDefaultImg] = useState<string>(
    "/imgtable/photo-1685625762287-5d08e37d5292.jpg"
  );
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const refInput = useRef<any>(null);
  const [textNameTable, setTextNameTable] = useState<string>("");
  const [toggleCreateTable, setToggleCreateTable] = useState<boolean>(false);
  const refCreateTable = useRef<any>(null);
  const listTable = useSelector((state: RootState) => {
    return state.listTable.table.filter((item) => {
      return item.name.includes(textSearch);
    });
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!refCreateTable.current?.contains(event.target as Node)) {
        setToggleCreateTable(false);
        setTextNameTable("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });
  useEffect(() => {
    if (fontBackground[0] === 1) {
      setDefaultImg("/imgtable/photo-1685625762287-5d08e37d5292.jpg");
    }
    if (fontBackground[1] === 1) {
      setDefaultImg("/imgtable/photo-1686903431112-9b426ee61dad.jpg");
    }
    if (fontBackground[2] === 1) {
      setDefaultImg("/imgtable/photo-1686995309003-9a141da8a6e6.jpg");
    }
    if (fontBackground[3] === 1) {
      setDefaultImg("/imgtable/photo-1687220297381-f8fddaa09163.jpg");
    }
  }, [fontBackground]);

  function handlecreatTable() {
    if (localStorage.getItem("token") != null) {
      fetch("http://localhost:5000/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Beaer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data1) => {
          let data = data1.user;
          getData(`/users/${data.id}`).then((data) => {
            if (textNameTable) {
              let idTable = Math.random();
              let TableToUser = {
                id: idTable,
                background: defaultImg,
                name: textNameTable,
              };
              let TableToDataBase1 = {
                id: idTable,
                background: defaultImg,
                name: textNameTable,
                member: [
                  {
                    id: data.id,
                    tk: data.tk,
                    email: data.email,
                    img: data.img,
                    position: "Quản trị viên",
                  },
                ],
                tagsname: ["", "", "", "", "", ""],
                tasks: {},
                columns: {},
                columnOrder: [],
              };
              let TableToDataBase2 = {
                id: idTable,
                background: defaultImg,
                name: textNameTable,
                member: [
                  {
                    id: data.id,
                    tk: data.tk,
                    email: data.email,
                    color: data.color,
                    position: "Quản trị viên",
                  },
                ],
                tagsname: ["", "", "", "", "", ""],
                tasks: {},
                columns: {},
                columnOrder: [],
              };
              if (data.img) {
                postData("/dataTable", TableToDataBase1);
              } else {
                postData("/dataTable", TableToDataBase2);
              }
              fetch("http://localhost:5000/addTable", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  authorization: `Beaer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(TableToUser),
              }).then((res) => {
                if (res.status == 200) {
                  dispatch(createTable.actions.addTable(TableToUser));
                  setToggleCreateTable(false);
                  setTextNameTable("");
                  setTimeout(() => {
                    window.location.href = `/todo/${idTable}`;
                  }, 0);
                }
              });
            }
          });
        });
    }
  }
  function handleTable() {
    setToggleCreateTable(true);
    setTimeout(() => {
      if (refInput.current) {
        refInput.current.focus();
      }
    }, 0);
  }
  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      handlecreatTable();
    }
  };
  return (
    <div className="home">
      <div className="home__table">
        <i
          onClick={() => setSlidebarToTodos(!slidebarToTodos)}
          className={`fa-solid fa-circle-chevron-left ${
            slidebarToTodos ? "hien" : ""
          }`}
        ></i>
        <div>Bảng</div>
      </div>
      <div className="home__filter-option">
        <div className="filter__search">
          <div className="search__text">Tìm kiếm</div>
          <div className="wrapp-input-search">
            <input
              onChange={(e) => setTextSearch(e.target.value)}
              type="text"
              placeholder="Tìm kiếm các bảng"
            />
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
        </div>
      </div>

      <div className="home__creacttb">
        <div
          onClick={() => handleTable()}
          ref={refCreateTable}
          className="btn__creacttb tb"
        >
          <div>tạo bảng mới</div>
          <div
            className={`header__table home1 ${toggleCreateTable ? "" : "hide"}`}
          >
            <div className="table__top">
              <div className="text__tb">Tạo bảng</div>
              <i
                onClick={() => setToggleCreateTable(false)}
                className="fa-solid fa-xmark"
              ></i>
            </div>
            <div
              className="table__fontimg"
              style={{
                backgroundImage: `url(${defaultImg})`,
              }}
            >
              <img
                src="https://trello.com/assets/14cda5dc635d1f13bc48.svg"
                alt=""
              />
            </div>
            <div className="background__font">
              <p className="text">Phông nền</p>
              <div className="list__font">
                <div
                  style={{
                    backgroundImage: `url(/imgtable/photo-1685625762287-5d08e37d5292.jpg)`,
                  }}
                >
                  <span onClick={() => setFontBackground([1, 0, 0, 0])}></span>
                  <i
                    className={`fa-solid fa-check ${
                      fontBackground[0] === 1 ? "cr" : ""
                    }`}
                  ></i>
                </div>
                <div
                  style={{
                    backgroundImage: `url(/imgtable/photo-1686903431112-9b426ee61dad.jpg)`,
                  }}
                >
                  <span onClick={() => setFontBackground([0, 1, 0, 0])}></span>
                  <i
                    className={`fa-solid fa-check ${
                      fontBackground[1] === 1 ? "cr" : ""
                    }`}
                  ></i>
                </div>
                <div
                  style={{
                    backgroundImage: `url(/imgtable/photo-1686995309003-9a141da8a6e6.jpg)`,
                  }}
                >
                  <span onClick={() => setFontBackground([0, 0, 1, 0])}></span>
                  <i
                    className={`fa-solid fa-check ${
                      fontBackground[2] === 1 ? "cr" : ""
                    }`}
                  ></i>
                </div>
                <div
                  style={{
                    backgroundImage: `url(/imgtable/photo-1687220297381-f8fddaa09163.jpg)`,
                  }}
                >
                  <span onClick={() => setFontBackground([0, 0, 0, 1])}></span>
                  <i
                    className={`fa-solid fa-check ${
                      fontBackground[3] === 1 ? "cr" : ""
                    }`}
                  ></i>
                </div>
              </div>
            </div>
            <div className="topic__table">
              <div className="text">Tiêu đề bảng</div>
              <input
                ref={refInput}
                value={textNameTable}
                onChange={(e) => setTextNameTable(e.target.value)}
                type="text"
                onKeyDown={handleKeyPress}
              />
            </div>
            <div
              onClick={() => handlecreatTable()}
              className={`btn__newcreate ${
                textNameTable === "" ? "white" : ""
              }`}
            >
              Tạo mới
            </div>
          </div>
        </div>
        {listTable?.length > 0
          ? listTable.map((item) => {
              return (
                <a
                  href={`http://localhost:3001/todo/${item.id}`}
                  key={item.id}
                  className="tb"
                  style={{
                    backgroundImage: `url(${item.background})`,
                  }}
                >
                  <div className="background__blur"></div>
                  <div className="tb__text">{item.name}</div>
                </a>
              );
            })
          : ""}
      </div>
    </div>
  );
}

export default Home;
