import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import Toastify from 'toastify-js';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      timeout: 5000,
    });

    this.socket.on('connect', () => {
      console.log('✅ WebSocket connected:', this.socket.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.warn('⚠️ WebSocket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error);
    });

    // this.socket.on('taskDueSoon', (data) => {
    //   console.log('📩 Received taskDueSoon event:', data);
    // });
    this.socket.on('taskReminder', (data) => {
      console.log('📩 Received taskReminder event:', data);
      //   this.showNotification(`Reminder: Task "${data.title}" is due in ${12}!`);
      //   this.showNotification(`Reminder: Task "${data.title}" is due in ${data.timeLeft}!`);
    });
  }

  // Emit event to set a reminder
  setReminder(taskId: string, time: number) {
    console.log(
      `⏰ Setting reminder for task ${taskId} at ${time} hours before deadline.`
    );
    this.socket.emit('setReminder', { taskId, time });
  }

  // Listen for events
  on(event: string): Observable<any> {
    return new Observable((observer) => {
      console.log(`🟢 Listening for event: ${event}`);

      this.socket.on(event, (data) => {
        console.log(`📩 Event "${event}" received with data:`, data);
        observer.next(data);
      });

      return () => {
        this.socket.off(event);
      };
    });
  }

  //   on(event: string): Observable<any> {
  //     return new Observable((observer) => {
  //       console.log(`🟢 Listening for event: ${event}`);

  //       this.socket.on(event, (data) => {
  //         console.log(`📩 Event "${event}" received with data:`, data);
  //         observer.next(data);
  //       });

  //       return () => {
  //         this.socket.off(event);
  //       };
  //     });
  //   }
  // Show Toastify notification
  //   private showNotification(message: string) {
  //     Toastify({
  //       text: message,
  //       duration: 5000,
  //       close: true,
  //       gravity: 'top',
  //       position: 'right',
  //       backgroundColor: 'linear-gradient(to right, #ff416c, #ff4b2b)',
  //     }).showToast();
  //   }
}
