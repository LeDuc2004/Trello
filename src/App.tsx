import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import TodoPage from "./pages/TodoPage";
import Signin from "./components/authen/Signin";
import { useEffect } from "react";
import Home from "./pages/Home";
function App() {
  useEffect(()=>{
   if (window.location.pathname == "/") {
    window.location.href = "/listTable"
   }
  },[])
    let arr = [
      { path: "/home", element: <Home></Home> },
      { path: "/listTable", element: <HomePage></HomePage> },
      { path: "/todo/:id", element: <TodoPage></TodoPage> },
      { path: "/signin", element:<Signin></Signin>},

    ];
  return (
    <>
      <Routes>
        {arr.map((item, index) => (
          <Route key={item.path} path={item.path} element={item.element} />
        ))}
      </Routes>
    </>
  );
}

export default App;
