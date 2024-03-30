import ProjectList from "./ProjectList";
import Project from "./Project";
import Task from "./Task";
import { format } from "date-fns";



const btnCreate = document.getElementById('btnCreate');
const dialogCreate = document.querySelector('.dialog-create');

const form = document.querySelector('form');
const title = document.getElementById('form-title');
const details = document.getElementById('form-details');
const dueDate = document.getElementById('form-date');
const priority = document.getElementById('priority-select');
const btnSubmit = document.getElementById('btnSubmit');
const content = document.querySelector('.content');
const menuProjects = document.querySelector('.menu-projects');

const btnAddProject = document.querySelector('.add-project');
const formAddProject = document.querySelector('.form-add-project');
const btnCancelCreateProject = document.querySelector('#btnCancelCreateProject');
const btnCreateProject = document.querySelector('#btnCreateProject');
const newProjectInput = document.querySelector('#newProjectInput');

const menuItemHome = document.querySelector('.item-home');
const menuItemToday = document.querySelector('.item-today');
const menuItemWeek = document.querySelector('.item-week');




// local storage magic 

const projectList = (function () {
  const list = Object.assign(new ProjectList() ,JSON.parse(localStorage.getItem('projects')));
  return list;
})();



renderSidebar();


function save() {
  localStorage.setItem('projects', JSON.stringify(projectList))
}

function createProject(name) {
  const newProject = new Project(name);
  projectList.addProject(newProject);
  currentProject = newProject;
  newProjectInput.value = '';
  cancelAddProject();
  save();
  renderSidebar();
}

function openProject(project) {
  currentProject = project;
  renderTasks();
}

function deleteProject(project) {
  projectList.deleteProject(project);
  currentProject = home;
  save();
  renderSidebar();
}

function createTask(title, dueDate, priority, details) {
  const newTask = new Task(title.trim(), dueDate, priority, details.trim(), false);
  currentProject.addTask(newTask);
  renderTasks();
}

function deleteTask(task) {
  currentProject.deleteTask(task);
  renderTasks();
}


// RENDER CONTENT --------------------------------

function renderAllTasks() {
  content.innerHTML = '';
  for (let task of home.tasks) {
      content.append(createCard(task));
  }
  for (let project of projectList.projects) {
      for (let task of project.tasks) {
          content.append(createCard(task));
      }
  }
}

function renderTodayTasks() {
  const today = format(new Date(), "dd/MM/yy")
  content.innerHTML = '';
  for (let task of home.tasks) {
      if (format(task.dueDate, "dd/MM/yy") == today) content.append(createCard(task));
  }
  for (let project of projectList.projects) {
      for (let task of project.tasks) {
        if (format(task.dueDate, "dd/MM/yy") == today) content.append(createCard(task));
      }
  }
}

function renderWeekTasks() {
  const today = format(new Date(), "w")
  content.innerHTML = '';
  for (let task of home.tasks) {
      if (format(task.dueDate, "w") == today) content.append(createCard(task));
  }
  for (let project of projectList.projects) {
      for (let task of project.tasks) {
        if (format(task.dueDate, "w") == today) content.append(createCard(task));
      }
  }
}

function renderTasks() {
  content.innerHTML = '';
  for (let task of currentProject.tasks) {
      content.append(createCard(task));
  }    
}

function createCard(task) {
  const card = createDiv('task-card');
  const divLeft = createDiv('card-left');
  const divRight = createDiv('card-right');
  divLeft.append(
    createCardCheckbox(), 
    createCardTitle(task)
  );
  divRight.append(
    createCardDetailsBtn(task), 
    createCardDate(task), 
    createCardEditBtn(task), 
    createCardRemoveBtn(task)
  );
  card.append(divLeft, divRight);
  card.classList.add(`${task.priority}`);
  return card;
}

function createCardCheckbox() {
const checkbox = document.createElement('input');
checkbox.type = 'checkbox';
checkbox.name = 'card-checkbox'
// function for checkbox;
return checkbox;
}

function createCardTitle(task) {
const title = document.createElement('span');
title.textContent = task.title;
return title;
}

function createCardDetailsBtn(task) {
const btnDetails = document.createElement('button');
btnDetails.textContent = 'details';
// function for button
return btnDetails;
}

function createCardDate(task) {
const dueDate = createDiv('card-date');
dueDate.textContent = format(task.dueDate, "dd LLL");
return dueDate;
}

function createCardEditBtn(task) {
const edit = document.createElement('span');
edit.classList.add('material-symbols-outlined')
edit.innerHTML = 'edit_square</span>';
// function for edit
return edit;
}

function createCardRemoveBtn(task) {
const remove = document.createElement('span');
remove.classList.add('material-symbols-outlined')
remove.innerHTML = 'delete';
remove.onclick = () => deleteTask(task);
return remove;
}

function showAddProject() {
  btnAddProject.classList.remove('active');
  formAddProject.classList.add('active');
}

function cancelAddProject() {
  btnAddProject.classList.add('active');
  formAddProject.classList.remove('active');
}

function createDiv(className) {
  const div = document.createElement('div');
  div.classList.add(className);
  return div;
}


// RENDER SIDEBAR --------------------------------

function renderSidebar() {
  menuProjects.innerHTML = '';
  for (let project of projectList.projects) {
    menuProjects.append(createProjectItem(project))
  }
}

function createProjectItem(project) {
  const projectItem = document.createElement('li');
  projectItem.classList.add('project-item');
  const divLeft = document.createElement('div');
  const divRight = document.createElement('div');
  const itemName = createDiv('item-name');
  itemName.textContent = project.name;
  const removeIcon = document.createElement('span');
  removeIcon.classList.add("material-symbols-outlined");
  removeIcon.textContent = 'delete';
  removeIcon.onclick = () => deleteProject(project);
  const itemCounter = createDiv('item-counter');
  divLeft.append(itemName, removeIcon);
  divRight.append(itemCounter);
  projectItem.append(divLeft, divRight);
  projectItem.onclick = () => openProject(project);
  return projectItem;
}


btnCreate.onclick = () => dialogCreate.showModal();
btnSubmit.onclick = () =>  createTask(title.value, dueDate.value, priority.value, details.value, false);

menuItemHome.onclick = renderAllTasks;
menuItemToday.onclick = renderTodayTasks;
menuItemWeek.onclick = renderWeekTasks;

btnAddProject.onclick = showAddProject;
btnCancelCreateProject.onclick = cancelAddProject;
btnCreateProject.onclick = () => createProject(newProjectInput.value);


//Test card
// for (let i = 0; i < 2; i++) {
//   createTask('task', '1', 'low', 'details', false, currentProject);
//   createTask('task2','1', 'high', 'details', false, currentProject);
  
//   }