import { Injectable } from '@angular/core';

import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { ResponseApi } from "../interfaces/response-api";



@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private urlApi=environment.API_URL+"Categoria/";

  constructor( private http: HttpClient) {}

  lista():Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}Lista`)
  }
}
