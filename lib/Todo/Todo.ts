import moment from "moment";
import { firebaseConfig } from "../firebase/firebase";
import { initializeApp } from "firebase/app";
import { getFirestore, Timestamp } from "firebase/firestore";
import {
  collection,
  addDoc,
  query,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  writeBatch 
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../supabase/supabase";
import { ConvertTimestampToDate } from "../utils/utils";

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

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

  public static async deleteFileFromSupabase({
    fileName,
    email,
    taskId,
  }: {
    fileName: string;
    email: string;
    taskId: string;
  }) {
    try {
      const { data, error } = await supabase.storage
        .from("taskdocs")
        .remove([`${email}/${taskId}/${fileName}`]);
    } catch (err) {
      console.log(err);
    }
  }

  public static async uploadFileToSupabase({
    file,
    fileName,
    email,
    taskId,
  }: {
    file: File;
    fileName: string;
    email: string;
    taskId: string;
  }) {
    try {
      const { data, error } = await supabase.storage
        .from("taskdocs")
        .upload(`${email}/${taskId}/${fileName}`, file);

      const p = supabase.storage
        .from("taskdocs")
        .getPublicUrl(`${email}/${taskId}/${fileName}`);
      return p.data.publicUrl;
    } catch (err) {
      console.log(err);
    }
  }

  public static async getTasksFromFireStore(email: string) {
    const q = query(collection(db, email));
    const querySnapshot = await getDocs(q);
    let allTasks = [] as Array<any>;
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
      const historyActivity = doc.data().historyActivity.map((obj: any) => ({
        ...obj,
        at: new Date(obj.at instanceof Timestamp ? ConvertTimestampToDate(obj.at) : obj.at),
      }));

      allTasks.push(
        new Todo({
          id: doc.data().id,
          taskName: doc.data().taskName,
          taskCategory: doc.data().taskCategory,
          taskDescription: doc.data().taskDescription,
          taskStatus: doc.data().taskStatus,
          docId: doc.id,
          historyActivity,
          createdAt: new Date(doc.data().createdAt instanceof Timestamp ? ConvertTimestampToDate(doc.data().createdAt) : doc.data().createdAt),
          dueDate: new Date(doc.data().dueDate instanceof Timestamp ? ConvertTimestampToDate(doc.data().dueDate) : doc.data().dueDate),
          updatedAt: new Date(doc.data().updatedAt instanceof Timestamp ? ConvertTimestampToDate(doc.data().updatedAt) : doc.data().updatedAt),
          attachment: doc.data().attachment,
          attachmentUrl: doc.data().attachmentUrl,
        })
      );
    });
    return allTasks;
  }

  async uploadDataToFirebase(
    email: string,
    fileDetails?: { fileName: string; file: File }
  ) {
    try {
      let FileUrl;
      if (fileDetails) {
        FileUrl = await Todo.uploadFileToSupabase({
          file: fileDetails.file,
          email,
          fileName: fileDetails.fileName,
          taskId: this.id,
        });
      }

      const res = await addDoc(collection(db, email), {
        id: this.id,
        taskName: this.taskName,
        taskDescription: this.taskDescription ?? null,
        dueDate: this.dueDate,
        taskCategory: this.taskCategory,
        taskStatus: this.taskStatus,
        attachment: FileUrl ? fileDetails?.fileName : null,
        historyActivity: this.historyActivity,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        attachmentUrl: FileUrl ?? null,
      });

      this.docId = res.id;
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  }

  async updateTaskToFirebase(
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
          await Todo.deleteFileFromSupabase({
            fileName: previousState.attachment,
            email,
            taskId: previousState.id,
          });
        }

        const FileUrl = await Todo.uploadFileToSupabase({
          file: fileDetails.file,
          email,
          fileName: fileDetails.fileName,
          taskId: this.id,
        });

        if (FileUrl) {
          this.attachment = fileDetails.fileName;
          this.attachmentUrl = FileUrl;
        }
      } else if (isFileBefore && isFileRemoved) {
        if (previousState.attachment)
          await Todo.deleteFileFromSupabase({
            fileName: previousState.attachment,
            email,
            taskId: previousState.id,
          });
        this.attachment = null;
        this.attachmentUrl = null;
      }

      this.updateHistoryActivity(previousState, isFileUploaded);

      console.log(this.docId);
      const docRef = doc(db, email, this.docId);
      await updateDoc(docRef, JSON.parse(JSON.stringify(this)));
    } catch (err) {
      console.log(err);
    }
  }

  async deleteTaskInFirebase(email: string) {
    try {
      const docRef = doc(db, email, this.docId);
      await deleteDoc(docRef);
      console.log("Document deleted successfully!");
    } catch (err) {
      console.log(err);
    }
  }

  async updateStatusSingle(email: string, updateTo: string) {
    try {
      const docRef = doc(db, email, this.docId);
  
      await updateDoc(docRef, {
        ['taskStatus']: updateTo,
      });
    } catch(err) {
      console.log(err)
    }
  }

  public static async updateMultipleStatus(email: string, ids: Array<string>, status: 'todo' | 'inprogress' | 'completed') {
    try {
      const batch = writeBatch(db)
      ids.forEach((id) => {
        const docRef = doc(db, email, String(id)); 
        batch.update(docRef, { taskStatus: status }); 
      });
      await batch.commit();
    } catch(err) {
      console.log(err)
    }
  }

  public static async deleteMultipleTasks(email: string, ids: Array<string>) {
    try {
      const batch = writeBatch(db)
      ids.forEach((id) => {
        const docRef = doc(db, email, id); 
        batch.delete(docRef); 
      });
      await batch.commit();
    } catch(err) {
      console.log(err)
    }
  }
}
