import { Task } from "./user";

export interface CalendarEvent {
  id?: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource?: Task;
  type: "deadline" | "block";
  blockIndex?: number;
}
