import "../scss/toast.scss"
function toast({ title = "", message = "", type = "", duration = 3000 }) {
    const main = document.getElementById("toast");
    if (main) {
        const autoRemoveId = setTimeout(() => {
            main.removeChild( toast)
        }, duration);
      const toast = document.createElement("div");
      toast.onclick = function (e) {
        if (e.target.closest(".toast__close")){
            main.removeChild(toast)
            clearTimeout(autoRemoveId)
        }
        
      }
      const icons = {
        success:"fa-solid fa-circle-check",
        info:"fa-solid fa-circle-info",
        error:"fa-solid fa-circle-exclamation"
      }
      const icon = icons[type]
    //   const delay = (duration / 1000).toFixed(2)
      toast.classList.add("toast" , `toast--${type}`);
    //   toast.style.animation =` slideInLeft ease .3s ,fadeout linear 1s ${delay}s forwards`;
      toast.innerHTML = `
        
    <div class="toast__icon">
      <i class="${icon}"></i>
    </div>
    <div class="toast__body">
      <h3 class="toast__title">${title}</h3>
      <p class="toast__msg">${message}</p>
    </div>
    <div class="toast__close">
      <i class="fa-solid fa-xmark"></i>
    </div>
  
        `;
        main.appendChild(toast);
       
    }
  }


 export function ShowSuccessToast(text) {
    toast({
    title: "Success",
    message: text,
    type: "success",
    duration: 4000,
  });
  }
  export  function ShowErrorToast(text) {
    toast({
    title: "Error",
    message: text,
    type: "error",
    duration: 4000,
  });
  }
  export function ShowInfoToast(text) {
    toast({
    title: "Thông báo",
    message: text,
    type: "info",
    duration: 4000,
  });
  }