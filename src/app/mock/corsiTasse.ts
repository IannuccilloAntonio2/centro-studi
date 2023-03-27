import {ITasse} from "./tasse";
import {User} from "./user";

export interface ICorsiTasse {
  id:number;
  name:string;
  dataInizio:string;
  dataFine:string;
  utenti:string
  tasse:ITasse[]
  utentiArray:User[]
  tassaMeseCorrente:ITasse[];
  semaforo?:any;
  corsoIniziato:boolean;
  corsoConcluso:boolean
  costo:string;

}
