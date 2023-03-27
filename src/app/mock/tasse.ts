import {User} from "./user";

export interface ITasse {
  id: number;
  scadenza: string;
  scadenzaDate:Date;
  editedDate:Date;
  tassa: string;
  costo: string;
  utenti?: User[];
  corsoId: number;
  userId:number;
  stato:number;
  created_at: string;
  updated_at: string;
  rimanenza:string;
  notificaPagamento:boolean;
  modificata:boolean;
  iniziato:boolean;
  numeroProgressivo?:string;
}
