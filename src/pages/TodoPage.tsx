import { useEffect, useState } from "react";
import Header from "../components/common/header/Header";
import SileBar from "../components/todo/SileBar";
import Todos from "../components/todo/Todos";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { fetchTableLess } from "../store/todoPage";
import { useParams } from "react-router-dom";
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
  const [updateScreen, setUpdateScreen] = useState<boolean>(true);
  const [slidebarToTodos, setSlidebarToTodos] = useState<boolean>(false);
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

 
  
  useEffect(() => {
    dispatch(fetchTableLess(id));
  }, []);
  const table = useSelector((state: RootState) => state.table);
 
  return (
    <>
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
