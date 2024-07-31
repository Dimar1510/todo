import Project from "../classes/Project";
import { createProject, editProject } from "../functions";
import { checkValidity, createDiv, getElement } from "../utils";
import { mobileMenu } from "./mobileMenu";

export const projectCreation = (function () {
  const btnAddProject = getElement<HTMLButtonElement>(".add-project");
  const btnCancelCreateProject = getElement<HTMLButtonElement>(
    "#btnCancelCreateProject",
  );
  const formAddProject = getElement(".form-add-project");
  const newProjectInput = getElement<HTMLInputElement>("#newProjectInput");
  const btnCreateProject = getElement<HTMLButtonElement>("#btnCreateProject");

  let projectColor = "white";
  const iconChecked = `<span class="material-symbols-outlined">done</span>`;

  const show = function (project?: Project) {
    btnAddProject.classList.remove("active");
    formAddProject.classList.add("active");
    colorPalette();
    newProjectInput?.focus();
    if (project) {
      edit(project);
    } else create();
  };
  const cancel = function () {
    btnAddProject.classList.add("active");
    formAddProject.classList.remove("active");
    resetInput();
  };

  const edit = function (project: Project) {
    btnCreateProject.textContent = "Confirm";
    const formFirstChild = formAddProject.firstElementChild;
    if (formFirstChild)
      formFirstChild.textContent = `Edit project "${project.name}"`;
    newProjectInput.value = project.name;
    const colorCard = document.getElementById(project.color);
    clearCheck();
    if (colorCard) colorCard.innerHTML = iconChecked;
    btnCreateProject.onclick = () => {
      if (!checkValidity(newProjectInput)) return;
      editProject(project, newProjectInput.value.trim(), projectColor);
      mobileMenu.hide();
      cancel();
    };
  };

  const create = function () {
    btnCreateProject.textContent = "Add";
    const formFirstChild = formAddProject?.firstElementChild;
    if (formFirstChild) formFirstChild.textContent = "Add new project";
    btnCreateProject.onclick = () => {
      if (!checkValidity(newProjectInput)) return;
      createProject(newProjectInput.value.trim(), projectColor);
      mobileMenu.hide();
      cancel();
    };
  };

  const resetInput = function () {
    if (newProjectInput) newProjectInput.value = "";
  };

  function colorPalette() {
    const colorArray = [
      "white",
      "#ff564a",
      "#0043a8",
      "#026134",
      "#f4884d",
      "#982cf1",
      "#c3066e",
    ];
    const colorSelector = getElement<HTMLButtonElement>(".color-selector");
    colorSelector.innerHTML = "";
    for (const color of colorArray) {
      const colorCard = createDiv("color-card");
      colorCard.id = color;
      colorCard.style.backgroundColor = color;
      if (color === colorArray[0]) colorCard.innerHTML = iconChecked;
      colorCard.onclick = (e) => {
        checkColor(e.target as HTMLElement);
      };
      colorSelector.appendChild(colorCard);
      colorSelector.onclick = (e) => {
        e.stopPropagation();
        newProjectInput.focus();
      };
    }
  }

  function clearCheck() {
    const colorCards = document.querySelectorAll(".color-card");
    colorCards.forEach((card) => {
      card.innerHTML = "";
    });
  }

  function checkColor(pickedCard: HTMLElement) {
    if (pickedCard.id === "") return;
    clearCheck();
    pickedCard.innerHTML = iconChecked;
    projectColor = pickedCard.id;
  }

  btnAddProject.onclick = () => show();
  btnCancelCreateProject.onclick = () => cancel();

  return { show, cancel };
})();
