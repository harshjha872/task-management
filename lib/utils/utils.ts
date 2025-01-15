import { Timestamp } from "firebase/firestore";
import moment from "moment";

export const uid = function () {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const removeSpaceFromFileName = (fileName: string) => {
  return fileName
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_.-]/g, "");
};

export const ConvertTimestampToDate = (firestoreTimestamp: Timestamp) => {
    if(firestoreTimestamp instanceof Timestamp) {
        
        const date = firestoreTimestamp.toDate();
    
        return moment(date).format("YYYY-MM-DD HH:mm:ss");
    } else {
        return firestoreTimestamp;
    }
};


export const isDateInRange = (date: Date, startDate: Date, endDate: Date) => {
    const targetDate = moment(date);
    const rangeStart = moment(startDate);
    const rangeEnd = moment(endDate);
  
    return targetDate.isBetween(rangeStart, rangeEnd, undefined, '[]');
  };