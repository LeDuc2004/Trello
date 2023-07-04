import { useEffect, useState } from "react";
import Header from "../components/common/header/Header";
import SileBar from "../components/todo/SileBar";
import Todos from "../components/todo/Todos";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { fetchTableLess } from "../store/todoPage";
import { useParams } from "react-router-dom";
import { SelectPosition } from "../components/Select";
import { fetchUsers } from "../store/createTable";
import { getData, putData } from "../services";
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
interface User {
  id: string | number,
  tk: string,
  color: string,
  email: string,
  img: string,
}
interface RootState {
  table: {
    status: string;
    Table: Item;
  };
}
interface ListUser {
  listTable: {
    status: string,
    users: User[]
  }
}
function TodoPage() {
  const { id } = useParams();
  const [toggle, setToggle] = useState<boolean>(false);
  const [slidebarToTodos, setSlidebarToTodos] = useState<boolean>(false);
  const [searchEmail, setSearchEmail] = useState<string>("")
  const [position, setPosition] = useState<string>("Thành viên")
  const [idUser, setIdUser] = useState<number | string>("")

  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();


  useEffect(() => {
    dispatch(fetchTableLess(id));
    dispatch(fetchUsers())
  }, []);
  const table = useSelector((state: RootState) => state.table);
  const User = useSelector((state: ListUser) => state.listTable.users).filter(user => user.email === searchEmail)

  function hideWrapTb() {
    setToggle(false)
  }
  function layChuCaiDau(ten: string) {
    if (ten && ten.trim() !== '') {

      const tenDaXuLi = ten.split(" ");
      const chuCaiCuoi = tenDaXuLi[tenDaXuLi.length - 1].charAt(0);

      const chuCaiDau = tenDaXuLi[0].charAt(0);
      if (tenDaXuLi.length > 1) {

        return chuCaiDau.toUpperCase() + chuCaiCuoi.toUpperCase();
      } else {
        return chuCaiDau.toUpperCase()

      }
    }
    return '';
  }

  function handleIdUser(user:any) {
    setSearchEmail(user.tk)
  }
  function handleAddMember() {
    getData(`/users/${idUser}`)
    .then((data)=>{
      let idTable1 = {
        id:table.Table.id,
        background:table.Table.background,
        name:table.Table.name
      }
      data.idTable.push(idTable1)
      putData(`/users/${idUser}`, data)
      .then(res=>{
        let newMember = {
          id:idUser,
          tk:searchEmail
        }

        let newTable = {
        ...table.Table,


       }
      })
      

    })
    
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
          <div className="input">
            <input value={searchEmail} onChange={(e) => setSearchEmail(e.target.value)} type="text" placeholder="Địa chỉ email hoặc tài khoản" />
            {User.length > 0 ? <div onClick={() => handleIdUser(User)} className="value_search">
              <div className="wrap_img">
                {User[0].img ?
                  <img src={User[0].img} alt="" />
                  : <div className="name" style={{ backgroundColor: User[0].color }}>{layChuCaiDau(User[0].tk)}</div>}
              </div>
              <div className="value_search_info">
                <div >{User[0].tk}</div>
                <div className="email">{User[0].email}</div>
              </div>
            </div> : ""}

          </div>
          <SelectPosition setPosition={setPosition} position={"Thành viên"}></SelectPosition>
          <div onClick={()=>handleAddMember()} className="btn_share">
            chia sẻ
          </div>
        </div>
        <div className="member__inTable">Thành viên trong bảng</div>
        <div className="tb__share_bottom">
          {table.status === "idle" ?
            <>
              {table.Table.member.map((member: any) =>
                <div className="sun__share">
                  <div className="img__name">
                    {member.img ? <img src={member.img} alt="" /> :
                      <div style={{backgroundColor:member.color}} className="name">{layChuCaiDau(member.tk)}</div>}


                    <div className="wrap_info">
                      <div>{member.tk}</div>
                      <div>{member.email}</div>
                    </div>
                  </div>
                  <SelectPosition position={member.position}></SelectPosition>
                </div>)}
            </>
            : ""}
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
