export default class Task {
    constructor (title, dueDate = 'No date', priority, details = 'No additional details.', done) {
        this.title = title;
        this.dueDate = dueDate;
        this.priority = priority;
        this.details = details;
        this.done = done;
        this.project = "";
    }

}