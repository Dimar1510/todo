import { compareAsc, format } from "date-fns";
import { createDiv } from "../utils";
import { checkTask, deleteTask } from "../functions";
import { showDialog } from "./showDialog";
import { showDialogDetails } from "./showDialogDetails";
import Task from "../classes/Task";
import Project from "../classes/Project";

export const createCard = (task: Task, project: Project) => {
  const card = createDiv("task-card");
  const divLeft = createDiv("card-left");
  const divRight = createDiv("card-right");

  divLeft.append(createCardCheckbox(task), createCardTitle(task));
  divRight.append(
    createCardDetailsBtn(task),
    createCardEditBtn(task),
    createCardRemoveBtn(task, project),
  );
  card.append(divLeft, createCardDate(task), divRight);
  if (task.done) card.classList.add("done");
  else card.classList.remove("done");
  card.style.borderLeftColor = project.color;
  card.onmouseover = () => {
    card.style.boxShadow = `0 0px 1px 1px ${project.color}`;
  };
  card.onmouseout = () => {
    card.style.boxShadow = `0 0px 0px 0px ${project.color}`;
  };

  // for mobile
  const show = document.createElement("span");
  show.classList.add("material-symbols-outlined");
  show.innerHTML = "more_vert";
  show.classList.add("more-btn");
  card.append(show);
  show.onclick = () => {
    divRight.classList.toggle("visible");
  };
  window.addEventListener("click", (e) => {
    const dialogDimensions = divRight.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      divRight.classList.remove("visible");
    }
  });
  return card;
};

const createCardCheckbox = (task: Task) => {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.name = "card-checkbox";
  if (task.done) checkbox.checked = true;
  else checkbox.checked = false;
  checkbox.addEventListener("change", () => {
    checkTask(checkbox.checked, task);
  });
  return checkbox;
};

const createCardTitle = (task: Task) => {
  const title = document.createElement("span");
  if (task.priority)
    title.innerHTML = `<span class="material-symbols-outlined">Exclamation</span><span>${task.title}</span>`;
  else title.innerHTML = `<span>${task.title}</span>`;
  if (task.done && title.lastElementChild) {
    const lastChild = title.lastElementChild as HTMLSpanElement;
    lastChild.style.textDecoration = "line-through";
  }
  return title;
};

function createCardDetailsBtn(task: Task) {
  // const btnDetails = document.createElement('button');
  // btnDetails.textContent = 'details';
  const btnDetails = document.createElement("span");
  btnDetails.classList.add("material-symbols-outlined");
  btnDetails.innerHTML = "info";
  btnDetails.onclick = () => showDialogDetails(task);
  return btnDetails;
}

function createCardDate(task: Task) {
  const dueDate = createDiv("card-date");
  if (task.dueDate == "") {
    dueDate.textContent = "no date";
    return dueDate;
  }
  dueDate.textContent = format(task.dueDate, "dd LLL");
  if (compareAsc(task.dueDate, format(new Date(), "dd LLL yy")) < 0) {
    dueDate.style.color = "red";
  }
  if (task.done) dueDate.style.color = "#b5b5b5";
  return dueDate;
}

function createCardEditBtn(task: Task) {
  const edit = document.createElement("span");
  edit.classList.add("material-symbols-outlined");
  edit.innerHTML = "edit_square";
  edit.onclick = () => showDialog.edit(task);
  return edit;
}

function createCardRemoveBtn(task: Task, project: Project) {
  const remove = document.createElement("span");
  remove.classList.add("material-symbols-outlined");
  remove.innerHTML = "delete";
  remove.onclick = () => deleteTask(task, project);
  return remove;
}
