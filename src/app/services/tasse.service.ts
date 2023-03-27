import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IServiceResponse} from "../mock/IServiceResponse";
import {Endpoints} from "../constants/endpoints";
import {ICorsiTasse} from "../mock/corsiTasse";
import {ITasse} from "../mock/tasse";

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

  updateTasse(tasse:any): Observable<IServiceResponse>{
    return this.http.put<IServiceResponse>(Endpoints.UPDATE_TASSE,tasse);
  }

  deleteCorsi(id:number): Observable<IServiceResponse>{
    return this.http.delete<IServiceResponse>(Endpoints.DELETE_CORSI_TASSE +id);
  }

  addTasseForSpecificUser(tasse:any): Observable<IServiceResponse>{
    return this.http.put<IServiceResponse>(Endpoints.ADD_TASSE_USER , tasse);
  }

  deleteTassa(id:number): Observable<IServiceResponse>{
    return this.http.delete<IServiceResponse>(Endpoints.DELETE_TASSA_USER +id);
  }

  removeUserFromCorso(data:any): Observable<IServiceResponse>{
    return this.http.put<IServiceResponse>(Endpoints.REMOVE_USER_FROM_COURSE,data);
  }

  updateTassa(data:any): Observable<IServiceResponse>{
    return this.http.put<IServiceResponse>(Endpoints.UPDATE_TASSA,data);
  }

  addUserToCourse(data:any): Observable<IServiceResponse>{
    return this.http.put<IServiceResponse>(Endpoints.ADD_USER_TO_COURSE,data);
  }

  sendEmailNotification(data:any): Observable<IServiceResponse>{
    return this.http.post<IServiceResponse>(Endpoints.SEND_EMAIL_NOTIFICATION,data);
  }
}
