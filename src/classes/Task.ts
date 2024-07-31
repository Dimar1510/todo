export default class Task {
  public title: string;
  public dueDate: string;
  public priority: boolean;
  public details: string;
  public done: boolean;
  public project: string;

  constructor(
    title: string,
    dueDate = "No date",
    priority: boolean,
    details = "No additional details.",
    done: boolean,
  ) {
    this.title = title;
    this.dueDate = dueDate;
    this.priority = priority;
    this.details = details;
    this.done = done;
    this.project = "";
  }
}
