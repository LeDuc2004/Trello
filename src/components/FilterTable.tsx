import layChuCaiDau from "../utils/laychucaidau";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";

import { todoPage } from "../store/todoPage";

import "../scss/filterTable.scss";

function FilterTable({  toggleFilter, stores }: any) {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

  const listColor = [
    { color: "#4bce97", status: false },
    { color: "#e2b203", status: false },
    { color: "#faa53d", status: false },
    { color: "#f87462", status: false },
    { color: "#9f8fef", status: false },
    { color: "#579dff", status: false },
  ];

  function pushIdMemberToFilter(idMember:number | string) {
       dispatch(todoPage.actions.filterMember(idMember))
  }
  function pushIdTagsToFilter(id:number) {
    dispatch(todoPage.actions.filterTags(id))
  }
  function pushIdDateToFilter(id:string) {
    dispatch(todoPage.actions.filterDate(id))
  }
  let membersFilter = useSelector((state:any)=> state.table.member)
  let tagsFilter = useSelector((state:any)=> state.table.tags)
  let dateFilter = useSelector((state:any)=> state.table.date)

  
  return (
    <>
      {toggleFilter ? (
        <div  className="filter-table">
          <div className="Table_addmember__top">
            <div>lọc</div>
            <i className="fa-solid fa-xmark"></i>
          </div>
          <div className="text">Thành viên bảng</div>
          <div key={-1} className="member">
              <input checked={membersFilter.includes(-1)} onClick={()=>pushIdMemberToFilter(-1)} type="checkbox" />
                <img src="/user.png" alt="" />
              <div className="info">
                Không có thành viên
              </div>
            </div>
          {stores.member?.map((item: any) => (
            <div key={item.id} className="member">
              <input checked={membersFilter.includes(item.id)} onClick={()=>pushIdMemberToFilter(item.id)} type="checkbox" />
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

              <div className="info">
                {item.tk} ({item.email})
              </div>
            </div>
          ))}
          <div className="text">Nhãn</div>
          {stores?.tasks[`task-0`]?.tags.map((item: any, index: number) => (
            <div key={item.color} className="Tag_color">
              <input checked={tagsFilter.includes(index)} onClick={()=>pushIdTagsToFilter(item.id)} className="type_check" type="checkbox" />
              <div className="color_content1">
                <div
                  style={{ backgroundColor: `${listColor[index].color}` }}
                  className="color_content"
                >
                  <div>{stores.tagsname[index]}</div>
                </div>
              </div>
            </div>
          ))}
          <div className="text">Ngày hết hạn</div>
          <div  className="filer_date">
            <input checked={dateFilter.includes("nodate")} onClick={()=>pushIdDateToFilter("nodate")}  type="checkbox" />
            <div style={{backgroundColor:"#d5d9df",color:"black"}} className="filter-date-i">
              <i className="fa-regular fa-clock"></i>
            </div>
            <div className="filer-date_text">Không có ngày hết hạn</div>
          </div>
          <div  className="filer_date">
            <input checked={dateFilter.includes("late")} onClick={()=>pushIdDateToFilter("late")}  type="checkbox" />
            <div style={{backgroundColor:"#ca3521"}} className="filter-date-i">
              <i className="fa-regular fa-clock"></i>
            </div>
            <div className="filer-date_text">Quá hạn</div>
          </div>
          <div  className="filer_date">
            <input checked={dateFilter.includes("doing")} onClick={()=>pushIdDateToFilter("doing")}  type="checkbox" />
            <div style={{backgroundColor:"#e2b203"}} className="filter-date-i">
              <i className="fa-regular fa-clock"></i>
            </div>
            <div className="filer-date_text">Đang làm</div>
          </div>
          <div  className="filer_date">
            <input checked={dateFilter.includes("done")} onClick={()=>pushIdDateToFilter("done")}  type="checkbox" />
            <div style={{backgroundColor:"#22a06b"}} className="filter-date-i">
              <i className="fa-regular fa-clock"></i>
            </div>
            <div className="filer-date_text">Hoàn thành</div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default FilterTable;
