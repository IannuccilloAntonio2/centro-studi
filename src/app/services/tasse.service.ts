import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IServiceResponse} from "../mock/IServiceResponse";
import {Endpoints} from "../constants/endpoints";

@Injectable({
  providedIn: 'root'
})
export class TasseService {

  constructor(private http: HttpClient) { }

  getTasse(): Observable<IServiceResponse>{
    return this.http.get<IServiceResponse>(Endpoints.GET_TASSE);
  }
}
