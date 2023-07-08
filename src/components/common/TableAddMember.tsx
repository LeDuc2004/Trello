import "../../scss/tableAddMember.scss";
import { useRef , useEffect } from "react";
interface Boolean1 {
    tableAddMember:boolean,
    setTableAddMember:any,
    setTextTime:any

}
function TableAddMember({tableAddMember , setTableAddMember , setTextTime}:Boolean1) {
  const refTableMenber = useRef<any>(null)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!refTableMenber.current?.contains(event.target as Node)) {
        setTableAddMember(false);
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
      <div style={tableAddMember ? {}: {display:"none"}} className="Table_addmember">
        <div className="Table_addmember__top">
            <div>Thành viên</div>
            <i onClick={()=>setTableAddMember(false)} className="fa-solid fa-xmark"></i>
        </div>
        <input className="search_member" type="text" placeholder="Tìm kiếm các thành viên" />
        <div className="text">Thành viên bảng</div>
        <div className="member">
            <div className="wrap_img">LD</div>
            <div className="info">
                Lê Văn đức (levanduc20)
            </div>
        </div>

        <div className="member">
            <div className="wrap_img">LD</div>
            <div className="info">
                Lê Văn đức (levanduc20)
            </div>
        </div>
        
      </div>
    </>
  );
}

export default TableAddMember;
