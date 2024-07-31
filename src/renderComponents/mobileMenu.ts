import { getElement } from "../utils";

export const mobileMenu = (function () {
  const menuBtn = getElement<HTMLButtonElement>(".hamburger");
  const container = getElement(".main-container");

  const hide = function () {
    container.classList.remove("show");
  };

  menuBtn.onclick = () => {
    container.classList.toggle("show");
  };
  return { hide };
})();
