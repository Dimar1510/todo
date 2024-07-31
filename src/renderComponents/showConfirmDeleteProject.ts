import Project from "../classes/Project";
import { deleteProject } from "../functions";
import { getElement } from "../utils";
import { projectCreation } from "./projectCreation";

export const showConfirmDeleteProject = (project: Project) => {
  const btnDelete = getElement<HTMLButtonElement>("#btnDeleteProject");
  const btnCancel = getElement<HTMLButtonElement>("#btnCancelDeleteProject");
  const dialog = getElement<HTMLDialogElement>(".dialog-confirm");
  const projectName = getElement(".dialog-confirm > .confirm span");

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
