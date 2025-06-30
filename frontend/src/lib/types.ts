export type Session = {
  subject: string;
  type: "study" | "fixed";
  color: string;
  credits: number;
};
export interface UploadState {
  classRoutine: File | null;
  subjectList: File | null;
}

export interface Preferences {
  totalHours: string;
  studyDuration: string;
  breakDuration: string;
  preferredTime: string;
}