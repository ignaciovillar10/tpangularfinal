import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TaskService {


  constructor(private http:HttpClient){

  }


  private api = 'https://6a2af00eb687a7d5cbc4b2c8.mockapi.io/tasks';



  getTasks(): Observable<any> {
    return this.http.get<any>(this.api).pipe(
      map(response => Array.isArray(response) ? response : response.data || [])
    );
  }


  createTask(task: any): Observable<any> {
    return this.http.post(this.api, task);
  }

  updateTask(id: number, task: any): Observable<any> {
    return this.http.put(`${this.api}/${id}`, task);
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }


}
