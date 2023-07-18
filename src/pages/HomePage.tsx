import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Header from "../components/common/Header";
import SileBar from "../components/todoColumn/SileBar";
import Home from "../components/Home";

function HomePage({ slidebarToTodos, setSlidebarToTodos }: any) {
  useEffect(() => {}, []);

  return (
    <>
      <Header></Header>

      <div
        style={{
          display: "flex",
          width: "100%",
          maxHeight: "calc(100vh - 50px)",
        }}
      >
        <SileBar
          slidebarToTodos={slidebarToTodos}
          setSlidebarToTodos={setSlidebarToTodos}
        ></SileBar>

        <Outlet />
      </div>
    </>
  );
}

export default HomePage;
