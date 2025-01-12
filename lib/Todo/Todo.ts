import moment from "moment";
import { uid } from "../utils/utils";

export interface iTodo {
  id: string;
  taskName: string;
  taskDescription: string;
  dueDate: Date;
  taskCategory: "work" | "personal";
  taskStatus: "todo" | "inprogress" | "completed";
  historyActivity: Array<{ status: string; at: Date }>;
  attachment?: any;
  createdAt: Date;
  updatedAt: Date;
}

export class Todo {
  id: string;
  taskName: string;
  taskDescription?: string;
  dueDate: Date;
  taskCategory: "work" | "personal";
  taskStatus: "todo" | "inprogress" | "completed";
  historyActivity: Array<{ status: string; at: Date }>;
  attachment?: any;
  createdAt: Date;
  updatedAt: Date;

  constructor(todo: iTodo) {
    this.id = todo.id ?? uid();
    this.taskName = todo.taskName;
    this.taskDescription = todo.taskDescription ?? null;
    this.dueDate = todo.dueDate;
    this.taskCategory = todo.taskCategory;
    this.taskStatus = todo.taskStatus;
    this.attachment = todo.attachment ?? null;
    this.historyActivity =
      todo.historyActivity?.length > 0
        ? [...todo.historyActivity]
        : [
            {
              status: "created the task",
              at: new Date(),
            },
          ];
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  updateHistoryActivity(oldTask: iTodo) {
    const parameters = [
      "taskName",
      "taskDescription",
      "dueDate",
      "taskCategory",
      "taskStatus",
      "attachment",
    ];

    for (const key of parameters) {
      const oldValue = this[key as keyof Todo];
      const newValue = oldTask[key as keyof iTodo];

      if (JSON.stringify(oldValue) === JSON.stringify(newValue)) {
        continue;
      }

      this.appendHistoryActivity(`you updated the ${key} from ${oldValue} to ${newValue}`)
    }
  }

  appendHistoryActivity(activityMsg: string) {
    this.historyActivity.push({
      status: activityMsg,
      at: new Date(),
    });
    this.updatedAt = new Date();
  }
}
