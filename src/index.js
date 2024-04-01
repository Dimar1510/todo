import ProjectList from "./ProjectList";
import Project from "./Project";
import Task from "./Task";
import { Render } from "./render";
import { format } from "date-fns";
const VERSION = '1.2'

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
    const color = window.getComputedStyle(document.documentElement).getPropertyValue('--clr-dark');
    const home = new Project('Default', color);
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
  
export function hasTask(task) {
  const newArr = projectList.projects.filter((project) => project.tasks.includes(task))
  return newArr[0]
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

export function createTask(title, dueDate, priority, details, project) {
  const newTask = new Task(title, dueDate, priority, details, false);
  if (!project) {
    projectList.current.addTask(newTask)
    newTask.project = projectList.current.name;
  } else {
    project.addTask(newTask);
    newTask.project = project.name;
  }
  
  
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
  createTask('Look around', format(new Date(),'yyyy-LL-dd'), false, 'first time here?');
  createTask('Create a project', format(new Date(),'yyyy-LL-dd'), false, 'create a project and begin to track tasks or create a new task on a default page');
  createProject('Work', '#982cf1');
  createTask('Learn JavaScript','', true, 'need to keep grinding');
  createTask('Rethink your life choices', format(new Date(),'yyyy-LL-dd'), false, 'this one might take a while');
  createProject('Gym', '#ff564a');
  createTask('Leg day', format(today.setDate(today.getDate() + 1),'yyyy-LL-dd'), true, '');
  createTask('Chest day', format(today.setDate(today.getDate() + 2),'yyyy-LL-dd'), false, '');
  createTask('Back day', format(today.setDate(today.getDate() + 3),'yyyy-LL-dd'), false, '');
  createTask('Arms day', format(today.setDate(today.getDate() + 4),'yyyy-LL-dd'), true, '');
  projectList.current = projectList.projects[0];
}
