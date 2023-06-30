import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import "../../scss/silebar.scss";
import { useParams } from "react-router-dom";
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
  const [curentChose , setCurentChose] = useState<number | string>("")
  const listTable = useSelector((state: RootState) => state.listTable);
  useEffect(()=>{
    setCurentChose(window.location.pathname)
  }, [])
  
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
      <a href="/listTable" className={`slie-bar__table ${curentChose == "/listTable" ? "curent": ""}`}>
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
      <div className="slie-bar__yourtable">
        <div className="yourtb">
          <span>Các bảng của bạn</span>
          <i className="fa-solid fa-plus"></i>
        </div>

        <div className="list-yourtable">
          {listTable.table?.length
            ? listTable.table.map((item) => {
                return (
                  <a
                    href={`http://localhost:3001/todo/${item.id}`}
                    key={item.id}
                    className={`table ${id == item.id ? "curent" : ""}`}
                  >
                    <img src={item.background} alt="" />
                    <span>{item.name}</span>
                  </a>
                );
              })
            : ""}
        </div>
      </div>
    </div>
  );
}

export default SileBar;
