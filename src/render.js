import { projectList, openProject, getUndoneTasks } from "./functions";
import { format, compareAsc } from "date-fns";
import { createProjectItem } from "./renderComponents/createProjectItem";
import { showDialog } from "./renderComponents/showDialog";
import { createCard } from "./renderComponents/createCard";
import { createSortSelector } from "./renderComponents/createSortSelector";
import { createDiv } from "./utils";
import { showConfirmDeleteProject } from "./renderComponents/showConfirmDeleteProject";
import { mobileMenu } from "./renderComponents/mobileMenu";

export const Render = (function () {
  const content = document.querySelector(".content");
  const createFirstCard = function () {
    if (typeof projectList.current === "string") return;
    const card = createDiv("task-card");
    const btnCreateTask = document.createElement("button");
    btnCreateTask.id = "btnCreate";
    btnCreateTask.onclick = () => {
      showDialog.create();
    };
    btnCreateTask.innerHTML =
      '<span class="material-symbols-outlined">add</span> <span>Add task</span>';
    card.append(btnCreateTask);

    const btnDeleteProject = document.createElement("button");
    btnDeleteProject.innerHTML =
      '<span class="material-symbols-outlined">delete</span> <span>Delete project</span>';
    btnDeleteProject.onclick = () => {
      for (let project of projectList.projects) {
        if (project === projectList.current) {
          showConfirmDeleteProject(project);
        }
      }
    };
    if (!isDefault()) card.append(btnDeleteProject);
    content.append(card);
    if (isDefault()) card.append(createSortSelector());
  };

  const projectTitle = function (title) {
    const titleDiv = document.querySelector(".project-title");
    const titleColor = document.querySelector(".title-color");
    if (!title) {
      titleDiv.textContent = projectList.current.name;
      titleColor.style.backgroundColor = projectList.current.color;
    } else {
      titleDiv.textContent = title;
      titleColor.style.backgroundColor = null;
    }
  };

  const updateCounter = function () {
    const counterHome = document.querySelector(".item-home > .item-counter");
    let total = 0;
    for (let project of projectList.projects) {
      total += getUndoneTasks(project);
    }
    total === 0
      ? counterHome.classList.remove("active")
      : counterHome.classList.add("active");
    counterHome.textContent = total;

    const counterToday = document.querySelector(".item-today > .item-counter");
    let countToday = 0;
    const today = format(new Date(), "dd/MM/yy");
    for (let project of projectList.projects) {
      for (let task of project.tasks) {
        if (task.dueDate == "") continue;
        if (format(task.dueDate, "dd/MM/yy") === today && !task.done) {
          countToday += 1;
        }
      }
    }
    countToday === 0
      ? counterToday.classList.remove("active")
      : counterToday.classList.add("active");
    counterToday.textContent = countToday;

    const counterWeek = document.querySelector(".item-week > .item-counter");
    let countWeek = 0;
    const thisWeek = format(new Date(), "w");
    for (let project of projectList.projects) {
      for (let task of project.tasks) {
        if (task.dueDate == "") continue;
        if (format(task.dueDate, "w") === thisWeek && !task.done) {
          countWeek += 1;
        }
      }
    }
    countWeek === 0
      ? counterWeek.classList.remove("active")
      : counterWeek.classList.add("active");
    counterWeek.textContent = countWeek;
  };

  const sidebar = function () {
    const menuProjects = document.querySelector(".menu-projects");
    const menuItemHome = document.querySelector(".item-home");
    const menuItemToday = document.querySelector(".item-today");
    const menuItemWeek = document.querySelector(".item-week");
    const items = document.querySelectorAll(".item-name");
    // const notes = document.querySelector('.item-notes')

    // implement notes later
    // notes.onclick = () => {
    //     projectList.current = 'notes'
    // }

    items.forEach((item) => {
      item.classList.remove("active");
    });

    if (typeof projectList.current === "string") {
      document
        .querySelector(`.item-${projectList.current} > .item-name`)
        .classList.add("active");
    }
    if (isDefault()) menuItemHome.firstElementChild.classList.add("active");

    menuItemHome.onclick = all;
    menuItemToday.onclick = today;
    menuItemWeek.onclick = week;
    menuProjects.innerHTML = "";

    for (let project of projectList.projects) {
      menuProjects.append(createProjectItem(project));
    }
    // hide the 'default' project
    menuProjects.removeChild(menuProjects.firstElementChild);

    // for mobile
    const itemsOnMobile = document.querySelectorAll(".nav");
    itemsOnMobile.forEach((item) => {
      item.addEventListener("click", () => {
        mobileMenu.hide();
      });
    });
  };

  const project = function () {
    content.innerHTML = "";
    const cards = [];
    createFirstCard();
    updateCounter();
    projectTitle();
    if (isDefault()) {
      projectTitle("TDL // All tasks");
      for (let project of projectList.projects) {
        for (let task of project.tasks) {
          cards.push({ task, project });
        }
      }
      // sorting
      // important first
      if (projectList.sorting === "important")
        cards.sort((a) => (a.task.priority ? -1 : 1));
      // upcoming
      if (projectList.sorting === "date")
        cards.sort((a, b) => {
          compareAsc(a.task.dueDate, b.task.dueDate) < 0 ? -1 : 1;
          if (a.task.dueDate === "") return -1;
        });
      // name
      if (projectList.sorting === "name")
        cards.sort((a, b) => (a.task.title < b.task.title ? -1 : 1));

      if (projectList.reverseOrder) cards.reverse();

      for (let card of cards) {
        content.append(createCard(card.task, card.project));
      }
      sidebar();
      return;
    }
    if (projectList.current === "today") {
      today();
      return;
    }
    if (projectList.current === "week") {
      week();
      return;
    }
    for (let task of projectList.current.tasks) {
      content.append(createCard(task, projectList.current));
    }
    if (content.childElementCount <= 1) {
      const noprojects = document.createElement("h3");
      noprojects.innerHTML = "There are no tasks here...<br>Lets add some!";
      content.appendChild(noprojects);
    }
    sidebar();
  };

  const all = function () {
    openProject(projectList.projects[0]);
  };

  const today = function () {
    projectList.current = "today";
    const today = format(new Date(), "dd/MM/yy");
    content.innerHTML = "";
    for (let project of projectList.projects) {
      for (let task of project.tasks) {
        if (task.dueDate == "") continue;
        if (format(task.dueDate, "dd/MM/yy") === today) {
          content.append(createCard(task, project));
        }
      }
    }
    if (content.innerHTML === "") {
      content.innerHTML = "<h3>Tasks for today will be here</h3>";
    }
    projectTitle(`${format(new Date(), "EEE, dd LLL yyyy")}`);
    sidebar();
  };

  const week = function () {
    projectList.current = "week";
    const thisWeek = format(new Date(), "w");
    content.innerHTML = "";
    for (let project of projectList.projects) {
      for (let task of project.tasks) {
        if (task.dueDate == "") continue;
        if (format(task.dueDate, "w") === thisWeek)
          content.append(createCard(task, project));
      }
    }
    if (content.innerHTML === "") {
      content.innerHTML = "<h3>Tasks for this week will be here</h3>";
    }
    projectTitle("Tasks for this week");
    sidebar();
  };

  const isDefault = function () {
    return projectList.current === projectList.projects[0];
  };

  return { project };
})();
