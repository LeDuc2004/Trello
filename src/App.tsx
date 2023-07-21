import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import { useState } from "react";

import HomePage from "./pages/HomePage";
import TodoPage from "./pages/TodoPage";
import Signin from "./components/authen/Signin";
import HomeBD from "./pages/HomeBD";
import Home from "./components/Home";

import "./index.scss"
import RegisterForm from "./components/signin";
function App() {

  const [slidebarToTodos, setSlidebarToTodos] = useState<boolean>(false);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route index element={<HomeBD />} />
        
        <Route path="home" element={<HomePage slidebarToTodos={slidebarToTodos} setSlidebarToTodos={setSlidebarToTodos}/>}>
          <Route index element={<Home slidebarToTodos={slidebarToTodos} setSlidebarToTodos={setSlidebarToTodos}></Home>}/>
          <Route path="table/:id" element={<TodoPage slidebarToTodos={slidebarToTodos} setSlidebarToTodos={setSlidebarToTodos} ></TodoPage>}/>
        </Route>
        <Route path="signin" element={<Signin></Signin>} />
        <Route path="test" element={<RegisterForm/>}/>
      </Route>
    )
  );
  return <RouterProvider router={router} />;
}

export default App;
