export const createDiv = (className) => {
  const div = document.createElement("div");
  div.classList.add(className);
  return div;
};

export const checkValidity = (field) => {
  if (field.value.trim() === "") {
    field.placeholder = "Please enter name";
    field.classList.add("error");
    field.focus();
    field.oninput = () => {
      field.placeholder = "Name";
      field.classList.remove("error");
    };
    return false;
  }
  return true;
};
