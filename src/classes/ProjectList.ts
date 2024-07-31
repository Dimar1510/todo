import Project from "./Project";

export default class ProjectList {
  public projects: Project[];
  public current: Project | string;
  public sorting: string;
  public reverseOrder: boolean;

  constructor() {
    this.projects = [];
    this.current = "";
    this.sorting = "";
    this.reverseOrder = false;
  }

  addProject(newProject: Project) {
    this.projects.push(newProject);
    this.current = newProject;
  }

  deleteProject(newProject: Project) {
    const index = this.projects.indexOf(newProject);
    this.projects.splice(index, 1);
    this.current = this.projects[0];
  }

  getProjects(): Project[] {
    return this.projects;
  }

  init() {
    this.current = this.projects[0];
  }
}
