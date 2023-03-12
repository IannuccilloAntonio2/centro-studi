import {User} from "./user";
import {PresenzeToShow} from "./presenze";
import {ITasse} from "./tasse";

export interface Corsi {
  id: number;
  name: string;
  utenti: User[]
  presenze?: PresenzeToShow[];
  tasse?:ITasse[];
  created_at?:string;
}
