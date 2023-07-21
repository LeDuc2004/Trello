import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import layChuCaiDau from "../utils/laychucaidau";

import "../scss/silebar.scss";

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
  const [toggle , setToggle] = useState<boolean>(false)
  const { id } = useParams();
  const listTable = useSelector((state: RootState) => state.listTable);
  const listMember = useSelector((state: any) => state.table.Table.member);
  console.log(listMember);

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

      <div onClick={()=>setToggle(!toggle)} className="slie-bar__member ">
        <div className="slie-bar__member-left">
          <i className="fa-regular fa-user"></i>
          <div>Thành viên</div>
        </div>
      </div>
      <div  className={`Table_addmember sidebar ${toggle ? "open" :""}`}>

        <div className="thep">
      {listMember?.map((item: any) => (
          <div key={item.id}  className="member">
            {item.img ? (
              <img src={item.img} alt="" />
            ) : (
              <div
                style={{ backgroundColor: `${item.color}` }}
                className="wrap_img"
              >
                {layChuCaiDau(item.tk)}
              </div>
            )}

            <div className="info">{item.tk} ({item.email})</div>
          </div>
        ))}
        </div>
      </div>

      <div className="list-manager"></div>

      <div className="slie-bar__yourtable">
        <div className="yourtb">
          <span>Các bảng của bạn</span>
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
