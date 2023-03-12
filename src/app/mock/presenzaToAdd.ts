import {User} from "./user";
import {UserDto} from "./userDto";

export interface PresenzaToAdd {
  userDto: UserDto;
  date: string;
  initialHour: string;
  finalHour: string;
  courseId?:number;
  users?:UserDto[]
}
