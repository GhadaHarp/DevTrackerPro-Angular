// import { Injectable } from '@angular/core';
// import { io, Socket } from 'socket.io-client';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class SocketService {
//   private socket: Socket;

//   constructor() {
//     this.socket = io('http://localhost:7000', {
//       transports: ['websocket'],
//       reconnection: true,
//       reconnectionAttempts: 5,
//       timeout: 5000,
//     });

//     this.socket.on('connect', () => {
//       console.log('✅ WebSocket connected:', this.socket.id);
//     });

//     this.socket.on('disconnect', (reason) => {
//       console.warn('⚠️ WebSocket disconnected:', reason);
//     });

//     this.socket.on('connect_error', (error) => {
//       console.error('❌ WebSocket connection error:', error);
//     });

//     this.socket.on('taskDueSoon', (data) => {
//       console.log('📩 Received taskDueSoon event:', data);
//     });
//   }

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
// }
