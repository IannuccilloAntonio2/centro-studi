import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IServiceResponse} from "../mock/IServiceResponse";
import {Endpoints} from "../constants/endpoints";
import {PresenzaToAdd} from "../mock/presenzaToAdd";
import {PresenzeToShow} from "../mock/presenze";

@Injectable({
  providedIn: 'root'
})
export class PresenzeService {

  constructor(private http: HttpClient) { }

  addPresenza(presenza: PresenzaToAdd): Observable<IServiceResponse>{
    return this.http.post<IServiceResponse>(Endpoints.ADD_PRESENZA,presenza);
  }
  addPresenzaList(presenza: PresenzaToAdd): Observable<IServiceResponse>{
    return this.http.post<IServiceResponse>(Endpoints.ADD_PRESENZA_LIST_USER,presenza);
  }

  findPresenzaForSpecificDay(day:any): Observable<PresenzeToShow[]>{
    return this.http.get<PresenzeToShow[]>(Endpoints.FIND_PRESENZE_TODAY + day);
  }

}
