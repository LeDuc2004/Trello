import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import TodoPage from "./pages/TodoPage";
import "../src/scss/zroot.scss"
import Signin from "./components/authen/Signin";
function App() {
    let arr = [
      { path: "/home", element: <HomePage></HomePage> },
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
