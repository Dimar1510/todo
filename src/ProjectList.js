export default class ProjectList {
    constructor() {
      this.projects = [];
      this.current = {};
      this.totalTasks = [];
    }
  
    addProject(newProject) {
      this.projects.push(newProject);
      this.current = newProject;
    }
  
    deleteProject(newProject) {
      const index = this.projects.indexOf(newProject);
      this.projects.splice(index, 1);
      this.current = this.projects[0];
    }

    getProjects() {
        return this.projects;
    }

    init() {
      this.current = this.projects[0];
    }

  }