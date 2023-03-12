import {UserDto} from "./userDto";

export interface ITasse {
  id:number;
  scadenza: string; //che poi è una data
  numeroProgressivo: string;
  utentiNonPaganti: string[];
  utentiPaganti: string[];
  corsoId?:number;
}
