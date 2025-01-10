import { iTodo } from "@/store/todoSlice";

export class Todo {
    id: number;
    taskName: string;
    taskDescription: string;
    dueDate: Date;
    taskCategory: 'work'|'personal';
    taskStatus: 'todo'|'inprogress'|'completed';
    historyActivity: Array<string>;
    attachment: any;

    constructor(todo: iTodo) {
        this.id = todo.id
        this.taskName = todo.taskName;
        this.taskDescription = todo.taskDescription
        this.dueDate = todo.dueDate
        this.taskCategory = todo.taskCategory
        this.taskStatus = todo.taskStatus
        this.historyActivity = JSON.parse(JSON.stringify(todo.historyActivity))
        this.attachment = todo.attachment
    }
}