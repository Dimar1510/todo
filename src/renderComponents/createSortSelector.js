import { editTask, projectList } from "../functions";
import { createDiv } from "../utils";

export const createSortSelector = () => {
  const sort = createDiv("sortBtns");
  let method = "";
  const text = document.createElement("div");
  text.textContent = "Sort by:";

  const def = document.createElement("span");
  def.classList.add("material-symbols-outlined");
  def.textContent = "colors";
  if (projectList.sorting === "") def.classList.add("active");
  def.onclick = () => {
    method = "";
  };

  const name = document.createElement("span");
  name.classList.add("material-symbols-outlined");
  name.textContent = "Sort_By_Alpha";
  if (projectList.sorting === "name") name.classList.add("active");
  name.onclick = () => {
    method = "name";
  };

  const date = document.createElement("span");
  date.classList.add("material-symbols-outlined");
  date.textContent = "pending_actions";
  if (projectList.sorting === "date") date.classList.add("active");
  date.onclick = () => {
    method = "date";
  };

  const important = document.createElement("span");
  important.classList.add("material-symbols-outlined");
  important.textContent = "priority_high";
  if (projectList.sorting === "important") important.classList.add("active");
  important.onclick = () => {
    method = "important";
  };

  const btns = [def, name, important, date];

  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (projectList.sorting === method) {
        projectList.reverseOrder
          ? (projectList.reverseOrder = false)
          : (projectList.reverseOrder = true);
      } else {
        projectList.sorting = method;
        projectList.reverseOrder = false;
      }
      editTask();
    });
  });

  sort.append(text, def, name, important, date);
  return sort;
};
