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

    this.socket.on('taskReminder', (data) => {
      console.log('📩 Received taskReminder event:', data);
    });
  }

  setReminder(taskId: string, time: number) {
    console.log(
      `⏰ Setting reminder for task ${taskId} at ${time} hours before deadline.`
    );
    this.socket.emit('setReminder', { taskId, time });
  }

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
}
