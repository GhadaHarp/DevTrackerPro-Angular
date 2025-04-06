import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { APIService } from '../../services/API.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TaskComponent } from '../task/task.component';
import { NewTaskComponent } from '../new-task/new-task.component';
import { TasksComponent } from '../tasks/tasks.component';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-all-tasks',
  templateUrl: './all-tasks.component.html',
  styleUrls: ['./all-tasks.component.css'],
  imports: [
    CommonModule,
    HeaderComponent,
    ReactiveFormsModule,
    FormsModule,
    TaskComponent,
    NewTaskComponent,
    RouterModule,
    LoadingSpinnerComponent,
  ],
})
// export class AllTasksComponent implements OnInit {
//   tasks: any[] = [];
//   isEditingTask = false;
//   currentTaskData: any[] = [];
//   isLoadingLocal = false;
//   isLoading!: Observable<false>;
//   userId = localStorage.getItem('userID') || '';
//   token = localStorage.getItem('token') || '';
//   filters: any = {
//     status: '',
//     priority: '',
//     deadline: '',
//   };

//   constructor(private apiService: APIService, private cdr: ChangeDetectorRef) {}

//   ngOnInit() {
//     this.fetchTasks();
//   }

//   fetchTasks(queryString: string = '') {
//     console.log(queryString);
//     this.apiService
//       .getUserTasks(this.userId, this.token, queryString)
//       .subscribe(
//         (res) => {
//           console.log(res);
//           this.tasks = res.data;
//           this.cdr.detectChanges();
//         },
//         (error) => {
//           console.error('Error fetching tasks:', error);
//         }
//       );
//   }
//   formatFiltersAsQuery(filters: any): string {
//     const normalizedFilters = { ...filters };

//     if (normalizedFilters.dueDate) {
//       const localDate = new Date(normalizedFilters.dueDate);
//       normalizedFilters.dueDate = localDate.toISOString();
//     }

//     const queryParams = Object.entries(normalizedFilters)
//       .filter(([_, value]) => value !== '')
//       .map(
//         ([key, value]: any) =>
//           `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
//       )
//       .join('&');

//     return queryParams ? `&${queryParams}` : '';
//   }

//   applyFilters() {
//     this.fetchTasks(this.formatFiltersAsQuery(this.filters)); // Fetch tasks with updated filters
//     console.log(this.filters);
//   }

//   clearFilters() {
//     this.filters = { status: '', priority: '', dueDate: '' };
//     this.fetchTasks();
//   }

//   editTask(task: any) {
//     console.log('Editing task:', task);
//     // Add edit logic
//     // this.fetchTasks();
//     this.isEditingTask = true;
//     this.currentTaskData = task;
//     // this.apiService.g;
//   }
//   close() {
//     this.fetchTasks();
//     this.isEditingTask = false;
//   }
//   deleteTask(taskId: string) {
//     // this.apiService.deleteTask(taskId).subscribe(() => {
//     //   this.tasks = this.tasks.filter((task) => task._id !== taskId);
//     //   this.cdr.detectChanges();
//     // });
//     this.fetchTasks();
//   }
// }
export class AllTasksComponent implements OnInit {
  tasks: any[] = [];
  isEditingTask = false;
  currentTaskData: any[] = [];
  isLoadingLocal = false;
  isLoading!: Observable<false>;
  userId = localStorage.getItem('userID') || '';
  token = localStorage.getItem('token') || '';
  filters: any = {
    status: '',
    priority: '',
    deadline: '',
  };

  constructor(private apiService: APIService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    setTimeout(() => {
      this.fetchTasks();
    }, 0);
  }

  fetchTasks(queryString: string = '') {
    this.isLoadingLocal = true;

    this.apiService
      .getUserTasks(this.userId, this.token, queryString)
      .subscribe(
        (res) => {
          this.tasks = res.data;
        },
        (error) => {
          console.error('Error fetching tasks:', error);
        },
        () => {
          this.isLoadingLocal = false;
          this.cdr.detectChanges();
        }
      );
  }

  formatFiltersAsQuery(filters: any): string {
    const normalizedFilters = { ...filters };

    if (normalizedFilters.dueDate) {
      const localDate = new Date(normalizedFilters.dueDate);
      normalizedFilters.dueDate = localDate.toISOString();
    }

    const queryParams = Object.entries(normalizedFilters)
      .filter(([_, value]) => value !== '')
      .map(
        ([key, value]: any) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join('&');

    return queryParams ? `&${queryParams}` : '';
  }

  applyFilters() {
    const query = this.formatFiltersAsQuery(this.filters);
    this.fetchTasks(query);
  }

  clearFilters() {
    this.filters = { status: '', priority: '', dueDate: '' };
    this.fetchTasks();
  }

  editTask(task: any) {
    this.isEditingTask = true;
    this.currentTaskData = task;
  }

  close() {
    this.fetchTasks();
    this.isEditingTask = false;
  }

  deleteTask(taskId: string) {
    this.fetchTasks();
  }
}
