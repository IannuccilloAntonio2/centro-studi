import {ITasse} from "./tasse";
import {FormArray} from "@angular/forms";

export interface User {
  id?: number;
  name: string;
  surname: string;
  email:string;
  courseId?: number;
  alias?:string;
  presente?:boolean;
  aggiunto?:boolean;
  pagato?:boolean;
  tasse?:ITasse[]
  tassArray?:FormArray
  tassaMeseCorrente?:ITasse;
}
