export function scrollToBottom(columnId:string, textareaRef:any ,time:number) {
  if (time == 0) {
    setTimeout(() => {
      const container = document.querySelector(`.list__columns.${columnId}`);
      if (container) {
        container.scrollTop = container.scrollHeight;
      }

      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 0);
  }else{
      const container = document.querySelector(`.list__columns.${columnId}`);
      if (container) {
        container.scrollTop = container.scrollHeight;
      }

      if (textareaRef.current) {
        textareaRef.current.focus();
      }
  }
  }
  