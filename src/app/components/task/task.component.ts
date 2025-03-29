import { Component, EventEmitter, input, OnInit, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faTrash,
  faEdit,
  faPlay,
  faPause,
} from '@fortawesome/free-solid-svg-icons';
import { APIService } from '../../services/API.service';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { interval, Subscription } from 'rxjs';
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
  elapsedTime: number = 0;
  timerRunning: boolean = false;
  play = faPlay;
  pause = faPause;
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
  private timerSubscription: Subscription | null = null;

  startStopTimer() {
    if (this.timerRunning) {
      this.stopTimer();
    } else {
      this.startTimer();
    }
  }

  private startTimer() {
    this.timerRunning = true;
    this.timerSubscription = interval(1000).subscribe(() => {
      this.elapsedTime++;
    });
  }

  private stopTimer() {
    this.timerRunning = false;
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  formatTime(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}
