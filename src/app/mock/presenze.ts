import {UserDto} from "./userDto";

export interface PresenzeToShow {
  id: number;
  date: string;
  initialHour: string;
  finalHour: string;
  courseId: number,
  userId: number;
  utenti?:UserDto;

}
