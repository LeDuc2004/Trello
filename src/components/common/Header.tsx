import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { createTable } from "../../store/createTable";

import "../../scss/header.scss";
import { postData } from "../../services";
import { fetchTable } from "../../store/createTable";

function Header({ sign }: any) {
  const [tblVisible, setTblVisible] = useState<boolean>(false);
  const [color , setColor] = useState<string>("")
  const [user, setUser] = useState<boolean>(false);
  const [info, setInfor] = useState<string>("");
  const [iduser, setIduser] = useState<string>("");
  const [imguser, setImg] = useState<string>("");
  const [toggle, setToggle] = useState<boolean>(false);
  const [fontBackground, setFontBackground] = useState<number[]>([1, 0, 0, 0]);
  const [defaultImg, setDefaultImg] = useState<string>(
    "/imgtable/photo-1685625762287-5d08e37d5292.jpg"
  );
  const [textNameTable, setTextNameTable] = useState<string>("");
  const [toggleCreateTable, setToggleCreateTable] = useState<boolean>(false);
  const refCreateTable = useRef<any>(null);
  const refInput = useRef<any>(null);
  const refTbl = useRef<any>(null);

  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!refTbl.current?.contains(event.target as Node)) {
        setTblVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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

  // iduser
  useEffect(() => {
    if (localStorage.getItem("token") != null) {
      fetch("http://localhost:5000/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Beaer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          if (res.status === 404 && !sign) {
            window.location.href = "/home";
          } else {
            return res.json();
          }
        })
        .then((data) => {
          
          dispatch(fetchTable(data.user.id));
          setUser(true);
          setInfor(data.user.tk);
          setIduser(data.user.id);
          if (data.user.img) {
            setImg(data.user.img);
          }else{
             setColor(data.user.color)
          }
        });
    }
  }, []);

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

  // Hàm lấy chữ cái đầu của tên 
  function layChuCaiDau(ten:string) {
    if (ten && ten.trim() !== '') {

      const tenDaXuLi = ten.split(" ");
      const chuCaiCuoi = tenDaXuLi[tenDaXuLi.length - 1].charAt(0);
      
      const chuCaiDau = tenDaXuLi[0].charAt(0);
      if (tenDaXuLi.length > 1) {
        
        return chuCaiDau.toUpperCase() + chuCaiCuoi.toUpperCase();
      }else{
        return chuCaiDau.toUpperCase()

      }
    }
    return '';
  }

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
          let data = data1.user
          
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
              member: [{
                id: data.id,
                tk: data.tk,
                img: data.img,
                email:data.email,
                position: "Quản trị viên"
              }],
              tasks: {},
              columns: {},
              columnOrder: [],
            };
            let TableToDataBase2 = {
              id: idTable,
              background: defaultImg,
              name: textNameTable,
              member: [{
                id: data.id,
                tk: data.tk,
                email:data.email,
                color: data.color,
                position: "Quản trị viên"
              }],
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
              }
            });
          }
        });
    }

  }
  function handleTable() {
    setToggleCreateTable(!toggleCreateTable);
    setTimeout(() => {
      if (refInput.current) {
        refInput.current.focus();
      }
    }, 0);
  }
  function logout() {
    let token = localStorage.getItem("token");
    fetch(`http://localhost:5000/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Beaer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ token, iduser }),
    }).then((res) => {
      if (res.status == 200) {
        localStorage.setItem("token", "null");
        setUser(false);
        window.location.href = "http://localhost:3001/signin";
      }
    });
  }
  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      handlecreatTable()
    }
  };
  return (
    <div
      style={sign ? { backgroundColor: "white", height: "60px" } : {}}
      className="header"
    >
      <div className="header__left">
        <a
          style={sign ? { width: "153px", height: "61px" } : {}}
          href={`${sign ? "/home" : "/listTable"}`}
        >
          <img
            className="logo"
            src={`${
              sign
                ? "/logonot.png"
                : "https://trello.com/assets/d947df93bc055849898e.gif"
            }`}
            alt=""
          />
        </a>
        {sign ? (
          ""
        ) : (
          <div className="navigation">
            <div className="nearly mgl">
              Gần đây<i className="fa-solid fa-chevron-down"></i>
            </div>
            <div className="voted mgl">
              Đã đánh dấu sao<i className="fa-solid fa-chevron-down"></i>
            </div>
            <div className="mgl" ref={refCreateTable}>
              <div onClick={() => handleTable()} className="btn-new">
                Tạo mới
              </div>
              <div
                className={`header__table ${toggleCreateTable ? "" : "hide"}`}
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
                      <span
                        onClick={() => setFontBackground([1, 0, 0, 0])}
                      ></span>
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
                      <span
                        onClick={() => setFontBackground([0, 1, 0, 0])}
                      ></span>
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
                      <span
                        onClick={() => setFontBackground([0, 0, 1, 0])}
                      ></span>
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
                      <span
                        onClick={() => setFontBackground([0, 0, 0, 1])}
                      ></span>
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
          </div>
        )}
      </div>
      {sign ? (
        ""
      ) : (
        <div className="header__right">
          <div className="warap__input">
            <input type="text" placeholder="Tìm kiếm" />
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
          <div
            ref={refTbl}
            onClick={() => setTblVisible(!tblVisible)}
            style={{ position: "relative" }}
          >
            {imguser === "" ? (
              <div style={{backgroundColor:`${color}`}} className="imguser">{layChuCaiDau(info)}</div>
            ) : (
              <img id="imguser" src={imguser} alt="" />
            )}
            <div className={`menu__user ${tblVisible ? "" : "hide"}`}>
              <div className="account">Tài khoản</div>
              <div className="wrap__user">
                <div className="wrap__img">
                  {imguser === "" ? (
                    <div style={{backgroundColor:`${color}`}} className="imguser">{layChuCaiDau(info)}</div>
                  ) : (
                    <img id="imguser" src={imguser} alt="" />
                  )}
                </div>
                <div className="name">{info}</div>
              </div>
              <div onClick={() => logout()} className="signout btn">
                Đăng xuất
              </div>
            </div>
          </div>
        </div>
      )}
      {sign ? (
        <div className="btn__dkdn">
          <a href="/signin" className="btn__dn">
            Đăng nhập
          </a>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default Header;
