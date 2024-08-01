import { Render } from "./render";
import { getMockData } from "./getMockData";
import { clearAll, projectList } from "./functions";
import "./styles/index.scss";
const VERSION = "1.2";

projectList.init();
if (localStorage.length === 0) {
  localStorage.setItem("version", VERSION);
  getMockData();
} else {
  if (localStorage.getItem("version") !== VERSION) {
    localStorage.setItem("version", VERSION);
    clearAll();
    getMockData();
  }
}
Render.project();
