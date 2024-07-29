export const showDialogDetails = (task) => {
  const dialog = document.querySelector(".dialog-details");
  const project = document.querySelector("#details-project");
  const date = document.querySelector("#details-date");
  const priority = document.querySelector("#details-priority");
  const text = document.querySelector("#details-text");
  const dialogTitle = document.querySelector(
    ".dialog-details > .dialog-header > h4",
  );
  const buttonClose = document.querySelector(
    ".dialog-details > .dialog-header > span",
  );
  buttonClose.onclick = () => dialog.close();

  dialog.showModal();
  dialogTitle.textContent = task.title;
  project.textContent = task.project;
  task.dueDate != ""
    ? (date.textContent = format(task.dueDate, "dd.LL.yyyy"))
    : (date.textContent = "no date");

  task.priority
    ? (priority.textContent = "high")
    : (priority.textContent = "normal");

  task.details != ""
    ? (text.textContent = task.details)
    : (text.textContent = "no additional details");

  dialog.addEventListener("click", (e) => {
    const dialogDimensions = dialog.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      dialog.close();
    }
  });
};
