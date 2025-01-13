import moment from "moment";
import { uid } from "../utils/utils";
import { firebaseConfig } from "../firebase/firebase";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

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
    this.id = todo.id ?? uuidv4();
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

      if (key === "attachment") {
        if (oldValue === null)
          this.appendHistoryActivity(`you uploaded a file`);
        else this.appendHistoryActivity(`you updated the file to ${newValue}`);
      } else {
        this.appendHistoryActivity(
          `you updated the ${key} from ${oldValue} to ${newValue}`
        );
      }
    }
  }

  appendHistoryActivity(activityMsg: string) {
    this.historyActivity.push({
      status: activityMsg,
      at: new Date(),
    });
    this.updatedAt = new Date();
  }

  async uploadDataToFirebase(email: string) {
    try {
      const res = await addDoc(collection(db, email), {
        id: this.id,
        taskName: this.taskName,
        taskDescription: this.taskDescription ?? null,
        dueDate: this.dueDate,
        taskCategory: this.taskCategory,
        taskStatus: this.taskStatus,
        attachment: this.attachment ?? null,
        historyActivity: this.historyActivity,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
      });
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  }
}
