import { editProject } from "../functions";
import { checkValidity, createDiv } from "../utils";
import { mobileMenu } from "./mobileMenu";

export const projectCreation = (function () {
  const btnAddProject = document.querySelector(".add-project");
  const btnCancelCreateProject = document.querySelector(
    "#btnCancelCreateProject",
  );
  const formAddProject = document.querySelector(".form-add-project");
  const newProjectInput = document.querySelector("#newProjectInput");
  const btnCreateProject = document.querySelector("#btnCreateProject");
  let projectColor = "white";
  const iconChecked = `<span class="material-symbols-outlined">done</span>`;

  const show = function (project) {
    btnAddProject?.classList.remove("active");
    formAddProject?.classList.add("active");
    colorPalette();
    newProjectInput?.focus();
    if (project) {
      edit(project);
    } else create();
  };
  const cancel = function () {
    btnAddProject?.classList.add("active");
    formAddProject?.classList.remove("active");
    resetInput();
  };

  const edit = function (project) {
    btnCreateProject.textContent = "Confirm";
    formAddProject.firstElementChild.textContent = `Edit project "${project.name}"`;
    newProjectInput.value = project.name;
    const colorCard = document.getElementById(project.color);
    clearCheck();
    colorCard.innerHTML = iconChecked;
    btnCreateProject.onclick = () => {
      if (!checkValidity(newProjectInput)) return;
      editProject(project, newProjectInput.value.trim(), projectColor);
      mobileMenu.hide();
      cancel();
    };
  };

  const create = function () {
    btnCreateProject.textContent = "Add";
    formAddProject.firstElementChild.textContent = "Add new project";
    btnCreateProject.onclick = () => {
      if (!checkValidity(newProjectInput)) return;
      createProject(newProjectInput.value.trim(), projectColor);
      mobileMenu.hide();
      cancel();
    };
  };

  const resetInput = function () {
    newProjectInput.value = "";
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
    const colorSelector = document.querySelector(".color-selector");
    colorSelector.innerHTML = "";
    for (let color of colorArray) {
      const colorCard = createDiv("color-card");
      colorCard.id = color;
      colorCard.style.backgroundColor = color;
      if (color === colorArray[0]) colorCard.innerHTML = iconChecked;
      colorCard.onclick = (e) => {
        checkColor(e.target);
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

  function checkColor(pickedCard) {
    if (pickedCard.id === "") return;
    clearCheck();
    pickedCard.innerHTML = iconChecked;
    projectColor = pickedCard.id;
  }

  btnAddProject.onclick = () => show();
  btnCancelCreateProject.onclick = () => cancel();

  return { show, cancel };
})();
