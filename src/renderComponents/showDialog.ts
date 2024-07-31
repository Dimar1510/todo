import Task from "../classes/Task";
import { createTask, editTask, hasTask, projectList } from "../functions";
import { checkValidity, getElement } from "../utils";

export const showDialog = (function () {
  const dialogCreateTask = getElement<HTMLDialogElement>(".dialog-create");
  const formCreateTask = getElement<HTMLFormElement>("form");
  const title = getElement<HTMLInputElement>("#form-title");
  const details = getElement<HTMLInputElement>("#form-details");
  const dueDate = getElement<HTMLInputElement>("#form-date");
  const priority = getElement<HTMLInputElement>("#priority-select");
  const btnSubmit = getElement<HTMLInputElement>("#btnSubmit");
  const dialogTitle = getElement<HTMLHeadingElement>(
    ".dialog-create > .dialog-header > h2",
  );
  const buttonClose = getElement<HTMLButtonElement>(
    ".dialog-create > .dialog-header > button",
  );
  buttonClose.onclick = () => {
    dialogCreateTask.close();
    formCreateTask.reset();
  };
  priority.onclick = () => {
    priority.classList.toggle("checked");
  };

  const create = function () {
    dialogCreateTask.showModal();
    priority.classList.remove("checked");
    dialogTitle.textContent = "New task";
    btnSubmit.textContent = "Create task";
    formCreateTask.reset();
    createList();
    btnSubmit.onclick = (e) => {
      if (!checkValidity(title)) {
        e.preventDefault();
        return;
      }
      const project = selectProject();
      createTask(
        title.value.trim(),
        dueDate.value,
        priority.classList.contains("checked"),
        details.value.trim(),
        project,
      );
      formCreateTask.reset();
    };
  };

  const edit = function (task: Task) {
    dialogCreateTask.showModal();
    dialogTitle.textContent = "Edit task";
    btnSubmit.textContent = "Confirm edit";
    title.value = task.title;
    details.value = task.details;
    dueDate.value = task.dueDate;
    if (task.priority) priority.classList.add("checked");
    else priority.classList.remove("checked");
    priority.checked = task.priority;
    createList(task);
    btnSubmit.onclick = () => {
      const newProject = selectProject();
      const project = hasTask(task);
      task.title = title.value;
      task.details = details.value;
      task.dueDate = dueDate.value;
      task.priority = priority.classList.contains("checked");
      if (newProject !== project) {
        project.deleteTask(task);
        newProject.addTask(task);
        task.project = newProject.name;
      }
      editTask();
    };
  };

  dialogCreateTask.addEventListener("click", (e) => {
    const dialogDimensions = dialogCreateTask.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      dialogCreateTask.close();
    }
  });
  return { create, edit };
})();

function createList(task?: Task) {
  const projectSelect = getElement<HTMLSelectElement>("#task-projects");
  projectSelect.innerHTML = "";
  for (const project of projectList.projects) {
    const option: HTMLOptionElement = document.createElement("option");
    option.value = project.name;
    option.text = project.name;
    option.style.color = project.color;
    projectSelect.add(option);
    if (
      project === projectList.current ||
      (task && project.tasks.includes(task))
    )
      option.selected = true;
  }
}

function selectProject() {
  const projectSelect = getElement<HTMLSelectElement>("#task-projects");
  let selectedProjectIndex = 0;
  for (let i = 0; i < projectSelect.options.length; i++) {
    if (projectSelect.options[i].selected) selectedProjectIndex = i;
  }
  const project = projectList.projects[selectedProjectIndex];
  return project;
}
