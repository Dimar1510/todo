import { getUndoneTasks, openProject, projectList } from "../functions";
import { createDiv } from "../utils";
import { projectCreation } from "./projectCreation";

export const createProjectItem = (project) => {
  const projectItem = document.createElement("li");
  projectItem.classList.add("project-item");
  const divLeft = document.createElement("div");
  const divRight = document.createElement("div");
  const itemName = createDiv("item-name");

  itemName.textContent = project.name;
  project === projectList.current
    ? itemName.classList.add("active")
    : itemName.classList.remove("active");

  const editIcon = document.createElement("span");
  editIcon.classList.add("material-symbols-outlined");
  editIcon.textContent = "edit_square";

  const itemCounter = createDiv("item-counter");
  itemCounter.textContent = getUndoneTasks(project).toString();
  itemCounter.textContent == "0"
    ? itemCounter.classList.remove("active")
    : itemCounter.classList.add("active");
  divLeft.append(itemName, editIcon);
  divRight.append(itemCounter);
  projectItem.style.borderLeftColor = project.color;
  projectItem.append(divLeft, divRight);
  projectItem.addEventListener("click", () => {
    projectCreation.cancel();
    openProject(project);
  });
  editIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    projectCreation.show(project);
  });
  projectItem.classList.add("nav");
  projectItem.onmouseover = () => {
    projectItem.style.boxShadow = `0 1px 1px 0px ${project.color}`;
  };
  projectItem.onmouseout = () => {
    projectItem.style.boxShadow = `0 0px 0px 0px ${project.color}`;
  };
  return projectItem;
};
