export const createDiv = (className: string) => {
  const div = document.createElement("div");
  div.classList.add(className);
  return div;
};

export const checkValidity = (field: HTMLInputElement) => {
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

export const getElement = <T extends Element>(selector: string): T => {
  const element = document.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Cannot find element with selector: ${selector}`);
  }
  return element;
};
