import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import React from 'react'

import "../../scss/silebar.scss";
import { Link, useParams } from "react-router-dom";
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
function SileBar({ slidebarToTodos, setSlidebarToTodos }: SideBarProps) {
  const {id} = useParams()
  const listTable = useSelector((state: RootState) => state.listTable);
  // const listMember = useSelector((state: any) => state.table.Table)
  // console.log(listMember);
  
  
  return (
    <div className={`slie-bar ${slidebarToTodos ? "fullscreen" : ""}`}>
      <div className="chevron">
        <i
          onClick={() => setSlidebarToTodos(!slidebarToTodos)}
          className={`fa-solid fa-circle-chevron-left  ${
            slidebarToTodos ? "fullscreen" : ""
          }`}
        ></i>
      </div>
      <a href="/home" className={`slie-bar__table`}>
        <i className="fa-brands fa-trello"></i>
        <div>Bảng</div>
      </a>

      <div className="slie-bar__member">
        <div className="slie-bar__member-left">
          <i className="fa-regular fa-user"></i>
          <div>Thành viên</div>
        </div>
        <i className="fa-solid fa-plus"></i>
      </div>
      <div className="list-manager">

      </div>

      <div className="slie-bar__yourtable">
        <div className="yourtb">
          <span>Các bảng của bạn</span>
          <i className="fa-solid fa-plus"></i>
        </div>

        <div className="list-yourtable">
          {listTable.table?.length
            ? listTable.table.map((item) => {
                return (
                  <Link
                    to={`table/${item.id}`}
                    key={item.id}
                    className={`table ${id == item.id ? "curent" : ""}`}
                  >
                    <img src={item.background} alt="" />
                    <span>{item.name}</span>
                  </Link>
                );
              })
            : ""}
        </div>
      </div>
    </div>
  );
}

export default React.memo(SileBar);
