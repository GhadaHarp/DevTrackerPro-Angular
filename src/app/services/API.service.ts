import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class APIService {
  private apiUrl = `http://127.0.0.1:3000`;
  token = localStorage.getItem('token') || '';
  constructor(private http: HttpClient) {}

  // PROJECTS API
  getUserProjects(token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.get<any>(`${this.apiUrl}/projects`, {
      headers,
    });
  }
  // getTasks(): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}/tasks`);
  // }

  getUserTasks(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/projects?user=${userId}`);
  }
  getProject(projectId: string, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.get<any>(`${this.apiUrl}/projects/${projectId}`, {
      headers,
    });
  }
  getProjectTasks(projectId: string, token: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.get<any>(`${this.apiUrl}/tasks?project=${projectId}`, {
      headers,
    });
  }

  addTask(taskData: any, token: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.post(`${this.apiUrl}/tasks`, taskData, { headers });
  }

  addProject(projectData: any, token: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.post(`${this.apiUrl}/projects`, projectData, { headers });
  }
  deleteProject(projectId: any, token: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.delete(`${this.apiUrl}/projects/${projectId}`, {
      headers,
    });
  }

  deleteTask(taskId: any, token: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.delete(`${this.apiUrl}/tasks/${taskId}`, { headers });
  }
  editTask(taskId: any, taskData: any, token: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.patch(`${this.apiUrl}/tasks/${taskId}`, taskData, {
      headers,
    });
  }
  editTaskTime(taskId: any, taskTime: any, token: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.patch(`${this.apiUrl}/tasks/${taskId}/time`, taskTime, {
      headers,
    });
  }
  editProject(projectId: any, projectData: any, token: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.patch(
      `${this.apiUrl}/projects/${projectId}`,
      projectData,
      {
        headers,
      }
    );
  }
  signup(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/signup`, data);
  }
  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/login`, data);
  }
  getUser(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${userId}`);
  }

  deleteUser(userID: string, token: string) {
    localStorage.clear();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.delete(`${this.apiUrl}/users/${userID}`, { headers });
  }
}
