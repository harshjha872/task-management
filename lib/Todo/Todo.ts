import moment from "moment";
// import { firebaseConfig } from "../firebase/firebase";
// import { initializeApp } from "firebase/app";
// import { getFirestore, Timestamp } from "firebase/firestore";
// import {
//   collection,
//   addDoc,
//   query,
//   getDocs,
//   doc,
//   updateDoc,
//   deleteDoc,
//   writeBatch 
// } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
// import { supabase } from "../supabase/supabase";
import { ConvertTimestampToDate } from "../utils/utils";

// const app = initializeApp(firebaseConfig);

// const db = getFirestore(app);

export interface iTodo {
  docId: string;
  id: string;
  taskName: string;
  taskDescription: string;
  dueDate: Date;
  taskCategory: "work" | "personal";
  taskStatus: "todo" | "inprogress" | "completed";
  historyActivity: Array<{ status: string; at: Date }>;
  attachment: string | null;
  createdAt: Date;
  updatedAt: Date;
  attachmentUrl: string | null;
}

export class Todo {
  docId: string;
  id: string;
  taskName: string;
  taskDescription: string;
  dueDate: Date;
  taskCategory: "work" | "personal";
  taskStatus: "todo" | "inprogress" | "completed";
  historyActivity: Array<{ status: string; at: Date }>;
  attachment: string | null;
  createdAt: Date;
  updatedAt: Date;
  attachmentUrl: string | null;

  constructor(todo: iTodo) {
    this.docId = todo.docId ?? "";
    this.id = todo.id ?? uuidv4();
    this.taskName = todo.taskName;
    this.taskDescription = todo.taskDescription ?? "";
    this.dueDate = todo.dueDate;
    this.taskCategory = todo.taskCategory;
    this.taskStatus = todo.taskStatus;
    this.attachment = todo.attachment ?? null;
    this.attachmentUrl = todo.attachmentUrl ?? null;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.historyActivity = todo.historyActivity || [
      {
        status: "created the task",
        at: new Date(),
      },
    ];
  }

  updateHistoryActivity(oldTask: iTodo, isFileUploaded: boolean) {
    const parameters = [
      "taskName",
      "taskDescription",
      "dueDate",
      "taskCategory",
      "taskStatus",
      "attachment",
    ];

    for (const key of parameters) {
      const oldValue = oldTask[key as keyof iTodo];
      const newValue = this[key as keyof Todo];

      if (JSON.stringify(oldValue) === JSON.stringify(newValue)) {
        continue;
      }

      if (key === "attachment") {
        const isFileBefore =
          oldTask?.attachment !== null && oldTask?.attachmentUrl !== null;

        const isFileRemoved =
          isFileBefore &&
          this.attachment === null &&
          this.attachmentUrl === null;

        if (isFileUploaded) {
          if (isFileBefore && oldTask.attachment) {
            this.appendHistoryActivity(`you updated the attachment`);
          } else {
            this.appendHistoryActivity(`you uploaded a file`);
          }
        } else if (isFileBefore && isFileRemoved) {
          this.appendHistoryActivity(`you removed the attachment`);
        }
      } else if(key == 'dueDate') {
        this.appendHistoryActivity(
          //@ts-ignore
          `you updated the ${key} from ${moment(new Date(oldValue)).format("D MMM, YYYY") } to ${moment(new Date(newValue)).format("D MMM, YYYY")}`
        );
      } else if(key == 'taskDescription') {
        this.appendHistoryActivity(
          `you updated the description`
        );
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

  public static async deleteFileFromLocalStorage({
    fileName,
    email,
    taskId,
  }: {
    fileName: string;
    email: string;
    taskId: string;
  }) {
    try {
      const storageKey = `taskdocs_${email}`;
      const existingFiles = JSON.parse(localStorage.getItem(storageKey) || "{}");
      const fileKey = `${taskId}/${fileName}`;
      if (existingFiles[fileKey]) {
        delete existingFiles[fileKey];
        localStorage.setItem(storageKey, JSON.stringify(existingFiles));
      }
    } catch (err) {
      console.log(err);
    }
  }

  public static async uploadFileToLocalStorage({
    file,
    fileName,
    email,
    taskId,
  }: {
    file: File;
    fileName: string;
    email: string;
    taskId: string;
  }): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const base64String = reader.result as string;
          const storageKey = `taskdocs_${email}`;
          const existingFiles = JSON.parse(localStorage.getItem(storageKey) || "{}");
          const fileKey = `${taskId}/${fileName}`;
          
          existingFiles[fileKey] = base64String;
          localStorage.setItem(storageKey, JSON.stringify(existingFiles));
          
          resolve(base64String);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }

  public static async getTasksFromLocalStorage(email: string) {
    const storageKey = `tasks_${email}`;
    const tasksData = localStorage.getItem(storageKey);
    if (!tasksData) return [];

    const rawTasks = JSON.parse(tasksData);
    return rawTasks.map((data: any) => new Todo({
      ...data,
      dueDate: new Date(data.dueDate),
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      historyActivity: data.historyActivity.map((h: any) => ({
        ...h,
        at: new Date(h.at)
      }))
    }));
  }

  async uploadDataToLocalStorage(
    email: string,
    fileDetails?: { fileName: string; file: File }
  ) {
    try {
      let FileUrl;
      if (fileDetails) {
        FileUrl = await Todo.uploadFileToLocalStorage({
          file: fileDetails.file,
          email,
          fileName: fileDetails.fileName,
          taskId: this.id,
        });
      }

      const storageKey = `tasks_${email}`;
      const existingTasks = await Todo.getTasksFromLocalStorage(email);
      
      if (FileUrl) {
        this.attachment = fileDetails?.fileName || null;
        this.attachmentUrl = FileUrl;
      }

      existingTasks.push(this);
      localStorage.setItem(storageKey, JSON.stringify(existingTasks));
    } catch (err) {
      console.log(err);
    }
  }

  async updateTaskInLocalStorage(
    email: string,
    previousState: iTodo,
    fileDetails?: { fileName: string; file: File }
  ) {
    try {
      const isFileBefore =
        previousState?.attachment !== null &&
        previousState?.attachmentUrl !== null;

      const isFileUploaded = !!fileDetails;

      const isFileRemoved =
        isFileBefore &&
        this?.attachment === null &&
        this?.attachmentUrl === null;

      if (isFileUploaded) {
        if (isFileBefore && previousState.attachment) {
          await Todo.deleteFileFromLocalStorage({
            fileName: previousState.attachment,
            email,
            taskId: previousState.id,
          });
        }

        const FileUrl = await Todo.uploadFileToLocalStorage({
          file: fileDetails!.file,
          email,
          fileName: fileDetails!.fileName,
          taskId: this.id,
        });

        if (FileUrl) {
          this.attachment = fileDetails!.fileName;
          this.attachmentUrl = FileUrl;
        }
      } else if (isFileBefore && isFileRemoved) {
        if (previousState.attachment)
          await Todo.deleteFileFromLocalStorage({
            fileName: previousState.attachment,
            email,
            taskId: previousState.id,
          });
        this.attachment = null;
        this.attachmentUrl = null;
      }

      this.updateHistoryActivity(previousState, isFileUploaded);

      const storageKey = `tasks_${email}`;
      const existingTasks = await Todo.getTasksFromLocalStorage(email);
      const updatedTasks = existingTasks.map((t: Todo) => t.id === this.id ? this : t);
      localStorage.setItem(storageKey, JSON.stringify(updatedTasks));
    } catch (err) {
      console.log(err);
    }
  }

  async deleteTaskInLocalStorage(email: string) {
    try {
      if (this.attachment) {
        await Todo.deleteFileFromLocalStorage({
          fileName: this.attachment,
          email,
          taskId: this.id
        });
      }
      const storageKey = `tasks_${email}`;
      const existingTasks = await Todo.getTasksFromLocalStorage(email);
      const filteredTasks = existingTasks.filter(t => t.id !== this.id);
      localStorage.setItem(storageKey, JSON.stringify(filteredTasks));
    } catch (err) {
      console.log(err);
    }
  }

  async updateStatusSingle(email: string, updateTo: "todo" | "inprogress" | "completed") {
    try {
      const storageKey = `tasks_${email}`;
      const existingTasks = await Todo.getTasksFromLocalStorage(email);
      const updatedTasks = existingTasks.map((t: Todo) => {
        if (t.id === this.id) {
          t.taskStatus = updateTo;
          t.appendHistoryActivity(`you updated the status to ${updateTo}`);
        }
        return t;
      });
      localStorage.setItem(storageKey, JSON.stringify(updatedTasks));
    } catch(err) {
      console.log(err)
    }
  }

  public static async updateMultipleStatus(email: string, ids: Array<string>, status: 'todo' | 'inprogress' | 'completed') {
    try {
      const storageKey = `tasks_${email}`;
      const existingTasks = await Todo.getTasksFromLocalStorage(email);
      const updatedTasks = existingTasks.map((t: Todo) => {
        if (ids.includes(t.id)) {
          t.taskStatus = status;
          t.appendHistoryActivity(`you updated the status to ${status}`);
        }
        return t;
      });
      localStorage.setItem(storageKey, JSON.stringify(updatedTasks));
    } catch(err) {
      console.log(err)
    }
  }

  public static async deleteMultipleTasks(email: string, ids: Array<string>) {
    try {
      const storageKey = `tasks_${email}`;
      const existingTasks = await Todo.getTasksFromLocalStorage(email);
      
      for (const t of existingTasks as Todo[]) {
        if (ids.includes(t.id) && t.attachment) {
          await Todo.deleteFileFromLocalStorage({
            fileName: t.attachment,
            email: email,
            taskId: t.id
          });
        }
      }

      const filteredTasks = existingTasks.filter((t: Todo) => !ids.includes(t.id));
      localStorage.setItem(storageKey, JSON.stringify(filteredTasks));
    } catch(err) {
      console.log(err)
    }
  }
}
