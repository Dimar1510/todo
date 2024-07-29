import { deleteProject } from "../functions";
import { projectCreation } from "./projectCreation";

export const showConfirmDeleteProject = (project) => {
  const btnDelete = document.getElementById("btnDeleteProject");
  const btnCancel = document.getElementById("btnCancelDeleteProject");
  const dialog = document.querySelector(".dialog-confirm");
  const projectName = document.querySelector(".dialog-confirm > .confirm span");

  btnCancel.onclick = () => dialog.close();
  btnDelete.onclick = () => {
    deleteProject(project);
    dialog.close();
    projectCreation.cancel();
  };

  dialog.showModal();
  projectName.textContent = project.name;

  dialog.addEventListener("click", (e) => {
    const dialogDimensions = dialog.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      dialog.close();
    }
  });
};
