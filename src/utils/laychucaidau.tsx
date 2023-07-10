function layChuCaiDau(ten: string) {
  if (ten && ten.trim() !== "") {
    const tenDaXuLi = ten.split(" ");
    const chuCaiCuoi = tenDaXuLi[tenDaXuLi.length - 1].charAt(0);

    const chuCaiDau = tenDaXuLi[0].charAt(0);
    if (tenDaXuLi.length > 1) {
      return chuCaiDau.toUpperCase() + chuCaiCuoi.toUpperCase();
    } else {
      return chuCaiDau.toUpperCase();
    }
  }
  return "";
}
export default layChuCaiDau