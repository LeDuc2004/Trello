import { useEffect, useState } from "react";
import Header from "../components/common/header/Header";
import SileBar from "../components/todoColumn/SileBar";
import Home from "../components/Home";

function HomePage() {
  const [slidebarToTodos, setSlidebarToTodos] = useState<boolean>(false);

  useEffect(() => {}, []);

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
        }}
      >
        <SileBar
          slidebarToTodos={slidebarToTodos}
          setSlidebarToTodos={setSlidebarToTodos}
        ></SileBar>

        <Home
          slidebarToTodos={slidebarToTodos}
          setSlidebarToTodos={setSlidebarToTodos}
        ></Home>
      </div>
    </>
  );
}

export default HomePage;
