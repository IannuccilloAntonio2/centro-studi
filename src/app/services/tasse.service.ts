import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IServiceResponse} from "../mock/IServiceResponse";
import {Endpoints} from "../constants/endpoints";
import {ICorsiTasse} from "../mock/corsiTasse";

@Injectable({
  providedIn: 'root'
})
export class TasseService {

  constructor(private http: HttpClient) { }

  getTasse(): Observable<IServiceResponse>{
    return this.http.get<IServiceResponse>(Endpoints.GET_TASSE);
  }

  addTasse(tassa:any): Observable<IServiceResponse>{
    return this.http.post<IServiceResponse>(Endpoints.ADD_TASSE,tassa);
  }

  getCorsi(): Observable<ICorsiTasse[]>{
    return this.http.get<ICorsiTasse[]>(Endpoints.GET_TASSE);
  }
}
