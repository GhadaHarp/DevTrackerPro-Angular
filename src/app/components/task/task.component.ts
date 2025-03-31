import {
  Component,
  EventEmitter,
  input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
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
import { SocketService } from '../../services/socket.service';
import Toastify from 'toastify-js';
@Component({
  selector: 'app-task',
  imports: [FontAwesomeModule, CommonModule, DatePipe],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
})
export class TaskComponent implements OnInit, OnDestroy {
  faTrash = faTrash;
  faEdit = faEdit;
  token = localStorage.getItem('token') || '';
  task = input.required<any>();
  elapsedTime: number = 0;
  timerRunning: boolean = false;
  play = faPlay;
  pause = faPause;
  taskSubscription!: Subscription;
  @Output() deleteTask = new EventEmitter<any>();
  @Output() editTask = new EventEmitter<any>();
  constructor(
    private apiService: APIService,
    private router: Router,
    private socketService: SocketService
  ) {}
  private showNotification(message: string) {
    const toastInstance = Toastify({
      node: (() => {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'space-between'; // Space out elements
        container.style.gap = '10px';
        container.style.width = '100%';

        // Avatar Image
        const avatar = document.createElement('img');
        avatar.src = 'https://cdn-icons-png.flaticon.com/128/3059/3059526.png';
        avatar.style.width = '24px';
        avatar.style.height = '24px';
        avatar.style.borderRadius = '50%';

        // Text Content
        const textSpan = document.createElement('span');
        textSpan.textContent = message;
        textSpan.style.fontWeight = '500';
        textSpan.style.flex = '1';

        // Close Button
        const closeButton = document.createElement('span');
        closeButton.innerHTML = '&times;'; // "×" symbol
        closeButton.style.fontSize = '16px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.color = '#ff4b2b'; // Red color
        closeButton.style.fontWeight = 'bold';
        closeButton.onclick = () => toastInstance.hideToast(); // ✅ Close action

        // Append Elements
        container.appendChild(avatar);
        container.appendChild(textSpan);
        container.appendChild(closeButton);

        return container;
      })(),
      duration: -1, // 🔥 Stays until "X" is clicked
      close: false, // Disable default close button (using custom "X")
      gravity: 'top',
      position: 'center',
      stopOnFocus: true,
      style: {
        background: 'linear-gradient(to right, #8e2de2, #4a00e0)', // Purple gradient
        borderRadius: '8px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
        padding: '12px 16px',
        fontSize: '14px',
        color: '#fff',
        fontWeight: '500',
        width: 'clamp(250px, 40vw, 400px)', // ✅ Responsive width: 250px min, 40vw normal, 400px max
        position: 'fixed', // ✅ Absolute positioning is not enough, use fixed
        top: '5%', // ✅ Moves it closer to the top but still visible
        left: '50%',
        transform: 'translateX(-50%)', // ✅ Centers it horizontally
        zIndex: '9999', // ✅ Ensures it appears above other elements
      },
    });

    // ✅ Show the toast
    toastInstance.showToast();
  }
  // ngOnInit(): void {
  //   // console.log('on init');
  //   // console.log(this.task());
  //   this.elapsedTime = this.task().timeSpent || 0;
  //   console.log(this.task());
  //   // console.log(this.elapsedTime);
  //   // this.taskSubscription = this.socketService
  //   //   .on('taskDueSoon')
  //   //   .subscribe((data) => {
  //   //     this.showNotification(data);
  //   //   });
  // }
  ngOnInit(): void {
    this.elapsedTime = this.task().timeSpent || 0;

    // 🔔 Listen for task reminders from WebSocket
    this.socketService.on('taskReminder').subscribe((reminders: any[]) => {
      // Check if the reminder is relevant to this task
      reminders.forEach((reminder) => {
        if (
          reminder.userId === this.task().userId &&
          reminder.title === this.task().title
        ) {
          this.showNotification(
            `Reminder: "${reminder.title}" is due in ${reminder.timeLeft} hours!`
          );
        }
      });
    });
  }
  onDeleteTask() {
    this.apiService.deleteTask(this.task()._id, this.token).subscribe(
      (res) => {
        // console.log(res);
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
      this.apiService
        .editTaskTime(this.task()._id, { time: this.elapsedTime }, this.token)
        .subscribe(
          (res) => {
            // console.log(res);
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }

  formatTime(seconds: number): string {
    if (!seconds) {
      seconds = 0;
    }
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  setReminder(event: any) {
    console.log(Number(event.target.value));
    const timeLeft = Number(event.target.value);
    this.apiService
      .editTask(
        this.task()._id,
        { timeLeft, reminderEnabled: true },
        this.token
      )
      .subscribe(
        (res) => {
          console.log('time left updated', res);
        },
        (err) => {
          console.log(err);
        }
      );
  }
  ngOnDestroy(): void {
    this.taskSubscription?.unsubscribe();
  }
}
