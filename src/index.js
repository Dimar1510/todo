import ProjectList from "./ProjectList";
import Project from "./Project";
import Task from "./Task";
import { Render } from "./render";

const VERSION = '1.1'

const storage = function() {
  const load = function() {
    const list = Object.assign(new ProjectList(), JSON.parse(localStorage.getItem('projects')));
    for (let i = 0; i < list.projects.length; i++) {
      list.projects[i] = Object.assign(new Project(list.projects[i].name), list.projects[i]);
    }
    return list;
  };
  const save = function() {
    localStorage.setItem('projects', JSON.stringify(projectList))
  }
  return {load, save}
}();

export const projectList = function () {
  if (localStorage.length === 0) {
    const list = new ProjectList();
    const home = new Project('Default');
    list.addProject(home);
    return list;
  }
  const list = storage.load();
  return list;
}();


// inintialize page

projectList.init();
if (localStorage.length === 0) {
  localStorage.setItem('version', VERSION);
  testContent();
} else {
  if (localStorage.getItem('version') !== VERSION) {
    localStorage.setItem('version', VERSION);
    clearAll();
    testContent();
  } 
}
Render.project();


function clearAll() {
  projectList.projects = [];
  const home = new Project('Default');
  projectList.addProject(home);
  storage.save();
}
  


export function createProject(name, color) {
  const newProject = new Project(name, color);
  projectList.addProject(newProject);
  storage.save();
  Render.project();
  const menuProjects = document.querySelector('.menu-projects');
  menuProjects.scrollTop = menuProjects.scrollHeight;
}

export function openProject(project) {
  projectList.current = project;
  Render.project();
}

export function editProject(project, name, color) {
  project.name = name;
  project.color = color;
  storage.save();
  Render.project();
}

export function deleteProject(project) {
  projectList.deleteProject(project);
  storage.save()
  Render.project();
}

export function createTask(title, dueDate, priority, details) {
  const newTask = new Task(title, dueDate, priority, details, false);
  projectList.current.addTask(newTask);
  newTask.project = projectList.current.name;
  storage.save();
  Render.project();
}

export function editTask() {
  storage.save();
  Render.project();
}

export function checkTask(checkbox, task) {
  checkbox.checked ? task.done = true : task.done = false;
  storage.save();
  Render.project();
}

export function deleteTask(task, project) {
  console.log(`deleting task "${task.title}"`)
  project.deleteTask(task);
  storage.save();
  Render.project();
}

export function getUndoneTasks(project) {
  let count = 0;
    for (let task of project.tasks) {
      if (!task.done) count++;
    }
  return count;
};

function testContent() {
  const today = new Date()
  createTask('Look around', new Date(), false, 'first time here?');
  createTask('Create a project', new Date(), false, 'create a project and begin to track tasks or create a new task on a default page');
  createProject('Work', 'blue');
  createTask('Learn JavaScript','', true, 'need to keep grinding');
  createTask('Quit your job', new Date(1711560618000), false, 'how else would you learn');
  createProject('Gym', 'orange');
  createTask('Leg day', today.setDate(today.getDate() + 1), true, '');
  createTask('Chest day', today.setDate(today.getDate() + 2), false, '');
  createTask('Back day', today.setDate(today.getDate() + 3), false, '');
  createTask('Arms day', today.setDate(today.getDate() + 4), true, '');
  projectList.current = projectList.projects[0];
}
