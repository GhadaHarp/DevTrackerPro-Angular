import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class APIService {
  private apiUrl = `http://127.0.0.1:3000`;
  token = localStorage.getItem('token') || '';

  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<any>(null);

  loading$ = this.loadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();

  setLoading(loading: boolean) {
    this.loadingSubject.next(loading);
  }

  setError(error: any) {
    this.errorSubject.next(error);
  }

  constructor(private http: HttpClient) {}

  getUserProjects(token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    this.setLoading(true);
    return this.http
      .get<any>(`${this.apiUrl}/projects`, { headers })
      .pipe(finalize(() => this.setLoading(false)));
  }

  getUserTasks(
    userId: string,
    token: string,
    queryString: any
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    this.setLoading(true);
    return this.http
      .get<any>(`${this.apiUrl}/tasks?user=${userId}&${queryString}`, {
        headers,
      })
      .pipe(finalize(() => this.setLoading(false)));
  }
  getProject(projectId: string, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    this.setLoading(true);

    return this.http
      .get<any>(`${this.apiUrl}/projects/${projectId}`, {
        headers,
      })
      .pipe(finalize(() => this.setLoading(false)));
  }
  getProjectTasks(projectId: string, token: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    this.setLoading(true);

    return this.http
      .get<any>(`${this.apiUrl}/tasks?project=${projectId}`, {
        headers,
      })
      .pipe(finalize(() => this.setLoading(false)));
  }

  addTask(taskData: any, token: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    this.setLoading(true);

    return this.http
      .post(`${this.apiUrl}/tasks`, taskData, { headers })
      .pipe(finalize(() => this.setLoading(false)));
  }

  addProject(projectData: any, token: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    this.setLoading(true);

    return this.http
      .post(`${this.apiUrl}/projects`, projectData, { headers })
      .pipe(finalize(() => this.setLoading(false)));
  }
  deleteProject(projectId: any, token: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    this.setLoading(true);

    return this.http
      .delete(`${this.apiUrl}/projects/${projectId}`, {
        headers,
      })
      .pipe(finalize(() => this.setLoading(false)));
  }

  deleteTask(taskId: any, token: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    this.setLoading(true);

    return this.http
      .delete(`${this.apiUrl}/tasks/${taskId}`, { headers })
      .pipe(finalize(() => this.setLoading(false)));
  }
  editTask(taskId: any, taskData: any, token: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    this.setLoading(true);

    return this.http
      .patch(`${this.apiUrl}/tasks/${taskId}`, taskData, {
        headers,
      })
      .pipe(finalize(() => this.setLoading(false)));
  }
  editTaskTime(taskId: any, taskTime: any, token: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    this.setLoading(true);

    return this.http
      .patch(`${this.apiUrl}/tasks/${taskId}/time`, taskTime, {
        headers,
      })
      .pipe(finalize(() => this.setLoading(false)));
  }
  editProject(projectId: any, projectData: any, token: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    this.setLoading(true);

    return this.http
      .patch(`${this.apiUrl}/projects/${projectId}`, projectData, {
        headers,
      })
      .pipe(finalize(() => this.setLoading(false)));
  }
  signup(data: any): Observable<any> {
    this.setLoading(true);

    return this.http
      .post(`${this.apiUrl}/users/signup`, data)
      .pipe(finalize(() => this.setLoading(false)));
  }
  login(data: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/users/login`, data)
      .pipe(finalize(() => this.setLoading(false)));
  }
  getUser(userId: string): Observable<any> {
    this.setLoading(true);

    return this.http
      .get(`${this.apiUrl}/users/${userId}`)
      .pipe(finalize(() => this.setLoading(false)));
  }

  deleteUser(userID: string, token: string) {
    localStorage.clear();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    this.setLoading(true);

    return this.http
      .delete(`${this.apiUrl}/users/${userID}`, { headers })
      .pipe(finalize(() => this.setLoading(false)));
  }
}
