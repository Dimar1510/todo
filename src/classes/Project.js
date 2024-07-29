export default class Project {
  constructor(name, color) {
    this.name = name;
    this.tasks = [];
    this.color = color;
  }

  getName() {
    return this.name;
  }

  getTasks() {
    return this.tasks;
  }

  addTask(task) {
    this.tasks.push(task);
  }

  deleteTask(task) {
    const index = this.tasks.indexOf(task);
    this.tasks.splice(index, 1);
  }
}
