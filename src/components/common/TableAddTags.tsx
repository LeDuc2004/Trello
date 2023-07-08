import "../../scss/tableAddTags.scss";
import "../../scss/tableAddMember.scss";
import { useRef, useEffect } from "react";
interface Boolean {
  hide: boolean;
  setTableAddTags: any;
  setTextTime: any;
}
function TableAddTags({ hide, setTableAddTags, setTextTime }: Boolean) {
  const refTableTag = useRef<any>(null);
  const listColor = [
    "#4bce97",
    "#e2b203",
    "#faa53d",
    "#f87462",
    "#9f8fef",
    "#579dff",
  ];
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!refTableTag.current?.contains(event.target as Node)) {
        setTableAddTags(false);
        var div = document.getElementById("your-div");
        var div1 = document.getElementById("wrap__tb__share");
    
        if (div && div1) {
          div.style.pointerEvents = ""
          div1.style.pointerEvents = ""
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

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
        {listColor.map((color) => (
          <div className="Tag_color">
            <input type="checkbox" />
            <div
              style={{ backgroundColor: `${color}` }}
              className="color_content"
            ></div>
            <i className="fa-solid fa-pencil"></i>
          </div>
        ))}
      </div>
    </>
  );
}

export default TableAddTags;
