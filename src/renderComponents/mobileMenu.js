export const mobileMenu = (function () {
  const menuBtn = document.querySelector(".hamburger");
  const container = document.querySelector(".main-container");
  const hide = function () {
    container.classList.remove("show");
  };

  menuBtn.onclick = () => {
    container.classList.toggle("show");
  };
  return { hide };
})();
