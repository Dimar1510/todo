import Project from "./classes/Project";
import ProjectList from "./classes/ProjectList";
import Task from "./classes/Task";
import { Render } from "./render";

const storage = (function () {
  const load = function () {
    const list: ProjectList = Object.assign(
      new ProjectList(),
      JSON.parse(localStorage.getItem("projects") || ""),
    );
    for (let i = 0; i < list.projects.length; i++) {
      list.projects[i] = Object.assign(
        new Project(list.projects[i].name, list.projects[i].color),
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
  const home = new Project("Default", "white");
  projectList.addProject(home);
  storage.save();
}

export function hasTask(task: Task) {
  const newArr = projectList.projects.filter((project) =>
    project.tasks.includes(task),
  );
  return newArr[0];
}

export function createProject(name: string, color: string) {
  const newProject = new Project(name, color);
  projectList.addProject(newProject);
  storage.save();
  Render.project();
  const menuProjects = document.querySelector(".menu-projects");
  if (menuProjects) menuProjects.scrollTop = menuProjects.scrollHeight;
}

export function openProject(project: Project) {
  projectList.current = project;
  Render.project();
}

export function editProject(project: Project, name: string, color: string) {
  project.name = name;
  project.color = color;
  storage.save();
  Render.project();
}

export function deleteProject(project: Project) {
  projectList.deleteProject(project);
  storage.save();
  Render.project();
}

export function createTask(
  title: string,
  dueDate: string,
  priority: boolean,
  details: string,
  project?: Project,
) {
  const newTask = new Task(title, dueDate, priority, details, false);
  if (!project) {
    if (typeof projectList.current !== "string") {
      projectList.current.addTask(newTask);
      newTask.project = projectList.current.name;
    }
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

export function checkTask(isChecked: boolean, task: Task) {
  task.done = isChecked;
  storage.save();
  Render.project();
}

export function deleteTask(task: Task, project: Project) {
  project.deleteTask(task);
  storage.save();
  Render.project();
}

export function getUndoneTasks(project: Project) {
  let count = 0;
  for (const task of project.tasks) {
    if (!task.done) count++;
  }
  return count;
}
