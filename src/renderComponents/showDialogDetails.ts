import { format } from "date-fns";
import Task from "../classes/Task";
import { getElement } from "../utils";

export const showDialogDetails = (task: Task) => {
  const dialog = getElement<HTMLDialogElement>(".dialog-details");
  const project = getElement("#details-project");
  const date = getElement("#details-date");
  const priority = getElement("#details-priority");
  const text = getElement("#details-text");
  const dialogTitle = getElement<HTMLHeadingElement>(
    ".dialog-details > .dialog-header > h4",
  );
  const buttonClose = getElement<HTMLButtonElement>(
    ".dialog-details > .dialog-header > button",
  );
  buttonClose.onclick = () => dialog.close();

  dialog.showModal();
  dialogTitle.textContent = task.title;
  project.textContent = task.project;
  if (task.dueDate != "") date.textContent = format(task.dueDate, "dd.LL.yyyy");
  else date.textContent = "no date";

  if (task.priority) priority.textContent = "high";
  else priority.textContent = "normal";

  if (task.details != "") text.textContent = task.details;
  else text.textContent = "no additional details";

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
