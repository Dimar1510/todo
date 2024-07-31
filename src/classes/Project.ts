import Task from "./Task";

export default class Project {
  public name: string;
  public tasks: Task[];
  public color: string;

  constructor(name: string, color: string) {
    this.name = name;
    this.tasks = [];
    this.color = color;
  }

  getName(): string {
    return this.name;
  }

  getTasks(): Task[] {
    return this.tasks;
  }

  addTask(task: Task) {
    this.tasks.push(task);
  }

  deleteTask(task: Task) {
    const index = this.tasks.indexOf(task);
    this.tasks.splice(index, 1);
  }
}
