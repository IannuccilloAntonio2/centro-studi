import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {IServiceResponse} from "../mock/IServiceResponse";
import {Endpoints} from "../constants/endpoints";
import {Observable} from "rxjs";
import {Corsi} from "../mock/corsi";
import {User} from "../mock/user";
import {PresenzaToAdd} from "../mock/presenzaToAdd";

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private http: HttpClient) { }

  generateCourse(name:string) : Observable<IServiceResponse>{
    return this.http.get<IServiceResponse>(Endpoints.NEW_COURSE + name);
  }
  getCourse(id:number) : Observable<Corsi>{
    return this.http.get<Corsi>(Endpoints.GET_COURSE_ID + id);
  }

  getAllCourse():Observable<Corsi[]>{
    return this.http.get<Corsi[]>(Endpoints.LIST_COURSE);
  }

  addPresenza(presenza: PresenzaToAdd):Observable<IServiceResponse>{
    return this.http.post<IServiceResponse>(Endpoints.ADD_PRESENZA, presenza);
  }


  getAllUser():Observable<User[]>{
    return this.http.get<User[]>(Endpoints.GET_ALL_USER);
  }

  deleteUser(userId:number):Observable<IServiceResponse>{
    return this.http.delete<IServiceResponse>(Endpoints.DELETE_USER + userId);
  }

  findUser(email:string):Observable<User>{
    return this.http.get<User>(Endpoints.FIND_BY_MAIL + email);
  }

  deleteCourse(id: number):Observable<IServiceResponse>{
    return this.http.delete<IServiceResponse>(Endpoints.DELETE_COURSE + id );
  }

  exportPresenzaToPDF(courseId: number): any {
    const httpOptions = {
      'responseType'  : 'arraybuffer' as 'json'
      //'responseType'  : 'blob' as 'json'        //Dovrebbe funzionare anche così
    };
    return this.http.get<any>(Endpoints.EXPORT_PRESENZE +courseId, httpOptions);
  }


  deletePresenza(presenzaId:number):Observable<IServiceResponse>{
    return this.http.delete<IServiceResponse>(Endpoints.DELETE_PRESENZA + presenzaId);
  }

  findUserByCourse(id: number):Observable<User[]>{
    return this.http.get<User[]>(Endpoints.FIND_BY_COURSE+id);
  }
}
