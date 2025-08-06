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
  classTime : string;
  maxSession: string;
  minSession: string;
  preferredTime: string;
}
export type SessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  is_verified?: boolean;
};

export type fileURLS = {
  classRoutine: string | null;
  subjectList: string | null;
}

export type ScheduleBlock = {
  subject: string;
  type: string;
  color: string;
};

export type ScheduleData = {
  [day: string]: {
    [timeKey: string]: ScheduleBlock | null;
  };
};
