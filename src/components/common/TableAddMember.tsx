import "../../scss/tableAddMember.scss";
import { useRef, useEffect } from "react";
import layChuCaiDau from "../../utils/laychucaidau";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { todoPage } from "../../store/todoPage";
import { putData } from "../../services";
interface Boolean1 {
  tableAddMember: boolean;
  setTableAddMember: any;
  member: any;
  stores: any;
  idTask: number;
}
function TableAddMember({
  tableAddMember,
  setTableAddMember,
  member,
  stores,
  idTask,
}: Boolean1) {
  const refTableMenber = useRef<any>(null);
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!refTableMenber.current?.contains(event.target as Node)) {
        setTableAddMember(false);
        var div = document.getElementById("your-div");
        var div1 = document.getElementById("wrap__tb__share");

        if (div && div1) {
          div.style.pointerEvents = "";
          div1.style.pointerEvents = "";
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });
  function addMember(member: any) {
    if (stores.tasks[`task-${idTask}`].member) {
      let arrMember = stores.tasks[`task-${idTask}`].member.slice();
      arrMember.push(member);
      let newStore = {
        ...stores,
        tasks: {
          ...stores.tasks,
          [`task-${idTask}`]: {
            ...stores.tasks[`task-${idTask}`],
            member: arrMember,
          },
        },
      };
      putData(`/dataTable/${newStore.id}`, newStore).then((res) => {
        dispatch(todoPage.actions.updateTable(newStore));
      });
    } else {
      let arrMember = [member];
      let newStore = {
        ...stores,
        tasks: {
          ...stores.tasks,
          [`task-${idTask}`]: {
            ...stores.tasks[`task-${idTask}`],
            member: arrMember,
          },
        },
      };
      putData(`/dataTable/${newStore.id}`, newStore).then((res) => {
        dispatch(todoPage.actions.updateTable(newStore));
      });
    }
  }
  return (
    <>
      <div
        ref={refTableMenber}
        style={tableAddMember ? {} : { display: "none" }}
        className="Table_addmember"
      >
        <div className="Table_addmember__top">
          <div>Thành viên</div>
          <i
            onClick={() => setTableAddMember(false)}
            className="fa-solid fa-xmark"
          ></i>
        </div>
        <input
          className="search_member"
          type="text"
          placeholder="Tìm kiếm các thành viên"
        />

        <div className="text">Thành viên bảng</div>
        {member?.map((item: any) => (
          <div key={item.id} onClick={() => addMember(item)} className="member">
            {item.img ? (
              <img src={item.img} alt="" />
            ) : (
              <div
                style={{ backgroundColor: `${item.color}` }}
                className="wrap_img"
              >
                {layChuCaiDau(item.tk)}
              </div>
            )}

            <div className="info">Lê Văn đức (levanduc20)</div>
          </div>
        ))}
      </div>
    </>
  );
}

export default TableAddMember;
