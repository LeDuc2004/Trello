import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import "../scss/home.scss";

interface SideBarProps {
  slidebarToTodos: boolean;
  setSlidebarToTodos: React.Dispatch<React.SetStateAction<boolean>>;
}
interface Item {
  id:string | number,
  background:string,
  name:string
}
interface RootState {
  listTable: {
    status: string;
    table: Item[]
  };
}

function Home({ slidebarToTodos, setSlidebarToTodos }: SideBarProps) {
  const listTable = useSelector((state: RootState) => state.listTable);



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
            <input type="text" placeholder="Tìm kiếm các bảng" />
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
        </div>
      </div>

      <div className="home__creacttb">
        <div className="btn__creacttb tb">tạo bảng mới</div>
        {listTable.table?.length 
          ? listTable.table.map((item) => {
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
