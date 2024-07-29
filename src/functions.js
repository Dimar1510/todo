import Project from "./classes/Project";
import ProjectList from "./classes/ProjectList";
import Task from "./classes/Task";
import { Render } from "./render";

const storage = (function () {
  const load = function () {
    const list = Object.assign(
      new ProjectList(),
      JSON.parse(localStorage.getItem("projects")),
    );
    for (let i = 0; i < list.projects.length; i++) {
      list.projects[i] = Object.assign(
        new Project(list.projects[i].name),
        list.projects[i],
      );
    }
    return list;
  };
  const save = function () {
    localStorage.setItem("projects", JSON.stringify(projectList));
  };
  return { load, save };
})();

export const projectList = (function () {
  if (localStorage.length === 0) {
    const list = new ProjectList();
    const color = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("--clr-dark");
    const home = new Project("Default", color);
    list.addProject(home);
    return list;
  }
  const list = storage.load();
  return list;
})();

export function clearAll() {
  projectList.projects = [];
  const home = new Project("Default");
  projectList.addProject(home);
  storage.save();
}

export function hasTask(task) {
  const newArr = projectList.projects.filter((project) =>
    project.tasks.includes(task),
  );
  return newArr[0];
}

export function createProject(name, color) {
  const newProject = new Project(name, color);
  projectList.addProject(newProject);
  storage.save();
  Render.project();
  const menuProjects = document.querySelector(".menu-projects");
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
  storage.save();
  Render.project();
}

export function createTask(title, dueDate, priority, details, project) {
  const newTask = new Task(title, dueDate, priority, details, false);
  if (!project) {
    projectList.current.addTask(newTask);
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
  checkbox.checked ? (task.done = true) : (task.done = false);
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
}
