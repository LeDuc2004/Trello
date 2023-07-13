import "../../scss/tableAddTags.scss";
import "../../scss/tableAddMember.scss";
import { useRef, useEffect, useState } from "react";
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
  const [textTag, setTextTag] = useState<string>();
  const refTableTag = useRef<any>(null);
  const refTags = useRef<any>(null);
  const [curent, setCurent] = useState<number>(-1);
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
        setCurent(-1);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!refTags.current?.contains(event.target as Node)) {
        setCurent(-1)
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
        return item;
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
        return item;
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
  function handleFocusTag(index: number) {
    setCurent(index);
    setTimeout(() => {
      let refTags = document.querySelectorAll(".input-tags");

      if (refTags) {
        refTags.forEach((item: any) => {
          item.focus();
          item.selectionStart = item.value.length;
          item.selectionEnd = item.value.length;
        });
      }
    }, 0);
  }
  function handleNameTag(event: any) {
    if (event.key == "Enter") {
      setCurent(-1)
      let newTagsName = [...stores.tagsname];
      newTagsName[curent] = textTag;

      let newStore = {
        ...stores,
        tagsname: newTagsName,
      };
      putData(`/dataTable/${newStore.id}`, newStore).then((res) =>
        dispatch(todoPage.actions.updateTable(newStore))
      );
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
                    className="type_check"
                    checked={item.status}
                    type="checkbox"
                    onChange={(e) => handleChoseTags(item.status, index)}
                  />
                  <div className="color_content1">
                    <div
                      style={{ backgroundColor: `${listColor[index].color}` }}
                      className="color_content"
                      onClick={() => handleChoseTags(item.status, index)}
                    >
                      <div>{stores.tagsname[index]}</div>
                    </div>
                    <input
                      value={stores.tagsname[index]}
                      ref={refTags}
                      onKeyDown={handleNameTag}
                      onChange={(e) => setTextTag(e.target.value)}
                      className="input-tags"
                      style={curent == index ? {} : { display: "none" }}
                      type="text"
                      placeholder="Tiêu đề"
                    />
                  </div>

                  <i
                    onClick={() => handleFocusTag(index)}
                    className="fa-solid fa-pencil"
                  ></i>
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
