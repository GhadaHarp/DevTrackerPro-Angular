import {
  Component,
  EventEmitter,
  Input,
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
import { interval, Subscription, take } from 'rxjs';
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
  @Output() deleteTask = new EventEmitter<any>();
  @Output() editTask = new EventEmitter<any>();
  @Input() canEdit: boolean = true;

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
        container.style.justifyContent = 'space-between';
        container.style.gap = '10px';
        container.style.width = '100%';

        // Avatar Image
        const avatar = document.createElement('img');
        avatar.src = 'https://cdn-icons-png.flaticon.com/128/3059/3059526.png';
        avatar.style.width = '32px';
        avatar.style.height = '32px';
        // avatar.style.borderRadius = '50%';

        // Text Content
        const textSpan = document.createElement('span');
        textSpan.textContent = message;
        textSpan.style.fontWeight = '500';
        textSpan.style.flex = '1';

        // Close Button
        const closeButton = document.createElement('span');
        closeButton.innerHTML = '&times;';
        closeButton.style.fontSize = '16px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.color = '#ff4b2b';
        closeButton.style.fontWeight = 'bold';
        closeButton.onclick = () => toastInstance.hideToast();

        // Append Elements
        container.appendChild(avatar);
        container.appendChild(textSpan);
        container.appendChild(closeButton);

        return container;
      })(),
      duration: 10000,
      close: false,
      gravity: 'top',
      position: 'center',
      stopOnFocus: true,
      style: {
        background: 'linear-gradient(to right, #8e2de2, #4a00e0)',
        borderRadius: '8px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
        padding: '12px 16px',
        fontSize: '14px',
        color: '#fff',
        fontWeight: '500',
        maxWidth: '90vw',
        width: 'clamp(250px, 40vw, 400px)',
        position: 'fixed',
        top: '5%',
        left: '20%',
        // transform: 'translateX(-50%)',
        zIndex: '9999',
        textAlign: 'center',
        wordBreak: 'break-word',
      },
    });

    toastInstance.showToast();
  }

  reminderSub!: Subscription;
  hasSubscribed = false;

  ngOnInit(): void {
    this.elapsedTime = this.task().timeSpent || 0;

    if (!this.hasSubscribed) {
      this.reminderSub = this.socketService
        .on('taskReminder')
        .subscribe((reminder: any) => {
          if (!this.task()) return;

          if (
            reminder.userId === this.task().userId &&
            reminder.title === this.task().title
          ) {
            const timeLeft = reminder.timeLeft;
            const displayTime = timeLeft >= 60 ? timeLeft / 60 : timeLeft;

            this.showNotification(
              `⏳ Reminder: Task "${reminder.title}" is due in ${displayTime} hour!`
            );
          }
        });

      this.hasSubscribed = true;
    }
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
      this.apiService
        .editTaskTime(this.task()._id, { time: this.elapsedTime }, this.token)
        .subscribe(
          (res) => {
            console.log(res);
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

  setReminder() {
    this.apiService
      .editTask(
        this.task()._id,
        { reminderActive: true, reminderTimes: [24, 12, 1] },
        this.token
      )
      .subscribe((res) => {
        console.log('Reminder set successfully', res);
        this.task().reminderActive = true;
      });
  }
  toggleReminder() {
    this.task().reminderActive = !this.task().reminderActive;
    this.task().reminderActive
      ? (this.task().reminderTimes = [1, 12, 24])
      : (this.task().reminderTimes = []);
    this.apiService
      .editTask(
        this.task()._id,
        {
          reminderActive: this.task().reminderActive,
          reminderTimes: this.task().reminderTimes,
        },
        this.token
      )
      .subscribe(
        (res) => {
          console.log('Reminder status updated', res);
        },
        (err) => {
          console.error(err);
        }
      );
  }

  ngOnDestroy(): void {
    this.reminderSub?.unsubscribe();
  }
}
