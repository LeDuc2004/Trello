import { useEffect, useState } from "react";
import Header from "../components/common/header/Header";
import SileBar from "../components/todo/SileBar";
import Todos from "../components/todo/Todos";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { fetchTableLess } from "../store/todoPage";
import { useParams } from "react-router-dom";
import { SelectPosition } from "../components/Select";
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
interface RootState {

  table: {
    status: string;
    Table: Item;
  };
}
function TodoPage() {
  const { id } = useParams();
  const [toggle, setToggle] = useState<boolean>(false);
  const [slidebarToTodos, setSlidebarToTodos] = useState<boolean>(false);
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();



  useEffect(() => {
    dispatch(fetchTableLess(id));
  }, []);
  const table = useSelector((state: RootState) => state.table);

  function hideWrapTb() {
    setToggle(false)
  }

  return (
    <>
      <div onClick={() => hideWrapTb()} style={toggle ? {} : { display: "none" }} className="wrap__tb__share">


      </div>
      <div style={toggle ? {} : { display: "none" }} className="tb__share">
        <div className="tb__share_top">
          <div>chia sẻ bảng</div>
          <i onClick={() => hideWrapTb()} className="fa-solid fa-xmark"></i>
        </div>
        <div className="tb__share_middle">
          <input type="text" placeholder="Địa chỉ email hoặc tên" />
          <SelectPosition position={"Thành viên"}></SelectPosition>
          <div className="btn_share">
            chia sẻ
          </div>
        </div>

        <div className="tb__share_bottom">
          <div className="sun__share">
            <div className="img__name">
              <img src="https://lh3.googleusercontent.com/a/AAcHTtcpadAkUAMhP8PABYqkxXe_GiYJuOznhIpkfo1z=s96-c" alt="" />
              <div>Lê Đức</div>
            </div>
            <SelectPosition></SelectPosition>
          </div>
          <div className="sun__share">
            <div className="img__name">
              <img src="https://lh3.googleusercontent.com/a/AAcHTtcpadAkUAMhP8PABYqkxXe_GiYJuOznhIpkfo1z=s96-c" alt="" />
              <div>Lê Đức</div>
            </div>
            <SelectPosition></SelectPosition>
          </div>
          <div className="sun__share">
            <div className="img__name">
              <img src="https://lh3.googleusercontent.com/a/AAcHTtcpadAkUAMhP8PABYqkxXe_GiYJuOznhIpkfo1z=s96-c" alt="" />
              <div>Lê Đức</div>
            </div>
            <SelectPosition></SelectPosition>
          </div>
        </div>

      </div>
      <Header></Header>

      <div
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
          ></Todos>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default TodoPage;
