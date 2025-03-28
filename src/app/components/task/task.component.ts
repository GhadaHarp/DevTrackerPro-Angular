import { Component, EventEmitter, input, OnInit, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { APIService } from '../../services/API.service';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
@Component({
  selector: 'app-task',
  imports: [FontAwesomeModule, CommonModule, DatePipe],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
})
export class TaskComponent implements OnInit {
  faTrash = faTrash;
  faEdit = faEdit;
  token = localStorage.getItem('token') || '';
  task = input.required<any>();
  @Output() deleteTask = new EventEmitter<any>();
  @Output() editTask = new EventEmitter<any>();
  constructor(private apiService: APIService, private router: Router) {}
  ngOnInit(): void {
    console.log(this.task());
  }
  onDeleteTask() {
    this.apiService.deleteTask(this.task()._id, this.token).subscribe(
      (res) => {
        console.log(res);
        this.deleteTask.emit(this.task()._id);
      },
      (error) => {
        console.log(error);
        this.router.navigate(['/error'], {
          state: { message: error.error.message },
        });
      }
    );
  }
  onEditTask() {
    this.editTask.emit(this.task());
  }
}
