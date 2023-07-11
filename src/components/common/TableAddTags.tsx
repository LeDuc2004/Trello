import "../../scss/tableAddTags.scss";
import "../../scss/tableAddMember.scss";
import { useRef, useEffect } from "react";
import { putData } from "../../services";
import { useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { todoPage } from "../../store/todoPage";
interface Boolean {
  hide: boolean;
  setTableAddTags: any;
  stores: any;
  idTask: number;
}

function TableAddTags({ hide, setTableAddTags, stores, idTask }: Boolean) {
  const refTableTag = useRef<any>(null);
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const listColor = [
    { color: "#4bce97", status: false },
    { color: "#e2b203", status: false },
    { color: "#faa53d", status: false },
    { color: "#f87462", status: false },
    { color: "#9f8fef", status: false },
    { color: "#579dff", status: false },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!refTableTag.current?.contains(event.target as Node)) {
        setTableAddTags(false);
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
  function handleChoseTags(status: boolean, postion: number) {
    let currentTag = stores.tasks[`task-${idTask}`].tags[postion].status;
    if (currentTag) {
      let newTags = stores.tasks[`task-${idTask}`].tags.map((item: any) => {
        if (item.id == postion) {
          let newItem = {
            ...item,
            status: false,
          };
          return newItem;
        } 
        return item
      });
      

      let newStore = {
        ...stores,
        tasks: {
          ...stores.tasks,
          [`task-${idTask}`]: {
            ...stores.tasks[`task-${idTask}`],
            tags: newTags,
          },
        },
      };
      
      putData(`/dataTable/${newStore.id}`, newStore).then((res) => {
        dispatch(todoPage.actions.updateTable(newStore));
      });
    } else {
      let newTags = stores.tasks[`task-${idTask}`].tags.map((item: any) => {
        if (item.id == postion) {
          let newItem = {
            ...item,
            status: true,
          };
          return newItem;
        } 
        return item
      });
      

      let newStore = {
        ...stores,
        tasks: {
          ...stores.tasks,
          [`task-${idTask}`]: {
            ...stores.tasks[`task-${idTask}`],
            tags: newTags,
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
        ref={refTableTag}
        style={hide ? {} : { display: "none" }}
        className="Table_addmember"
      >
        <div className="Table_addmember__top">
          <div>Nhãn</div>
          <i
            onClick={() => setTableAddTags(false)}
            className="fa-solid fa-xmark"
          ></i>
        </div>
        <input
          className="search_member"
          type="text"
          placeholder="Tìm nhãn..."
        />
        <div className="text">Nhãn</div>
        {stores.tasks ? (
          <>
            {stores.tasks[`task-${idTask}`]?.tags.map(
              (item: any, index: number) => (
                <div key={item.color} className="Tag_color">
                  <input
                    checked={item.status}
                    type="checkbox"
                    onChange={(e) => handleChoseTags(item.status, index)}
                  />
                  <div
                    style={{ backgroundColor: `${listColor[index].color}` }}
                    className="color_content"
                    onClick={() => handleChoseTags(item.status, index)}
                  >
                    <div>{item.content}</div>
                  </div>
                  <i className="fa-solid fa-pencil"></i>
                </div>
              )
            )}
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default TableAddTags;
