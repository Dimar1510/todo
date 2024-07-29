import { createTask, projectList } from "../functions";
import { checkValidity } from "../utils";

export const showDialog = (function () {
  const dialogCreateTask = document.querySelector(".dialog-create");
  const formCreateTask = document.querySelector("form");
  const title = document.getElementById("form-title");
  const details = document.getElementById("form-details");
  const dueDate = document.getElementById("form-date");
  const priority = document.getElementById("priority-select");
  const btnSubmit = document.getElementById("btnSubmit");
  const dialogTitle = document.querySelector(
    ".dialog-create > .dialog-header > h2",
  );
  const buttonClose = document.querySelector(
    ".dialog-create > .dialog-header > span",
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
    createList(projectList);
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

  const edit = function (task) {
    dialogCreateTask.showModal();
    dialogTitle.textContent = "Edit task";
    btnSubmit.textContent = "Confirm edit";
    title.value = task.title;
    details.value = task.details;
    dueDate.value = task.dueDate;
    task.priority
      ? priority.classList.add("checked")
      : priority.classList.remove("checked");
    priority.checked = task.priority;
    createList(projectList, task);
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

function createList(task) {
  const projectSelect = document.getElementById("task-projects");
  projectSelect.innerHTML = "";
  for (let project of projectList.projects) {
    const option = document.createElement("option");
    option.value = project;
    option.text = project.name;
    option.style.color = project.color;
    projectSelect.add(option);
    if (project === projectList.current || project.tasks.includes(task))
      option.selected = true;
  }
}

function selectProject() {
  const projectSelect = document.getElementById("task-projects");
  let selectedProjectIndex = 0;
  for (let i = 0; i < projectSelect.options.length; i++) {
    if (projectSelect.options[i].selected) selectedProjectIndex = i;
  }
  const project = projectList.projects[selectedProjectIndex];
  return project;
}
