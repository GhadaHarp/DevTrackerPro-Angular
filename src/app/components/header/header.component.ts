import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  imports: [FontAwesomeModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  faRightFromBracket = faRightFromBracket;
  router = inject(Router);
  onLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userID');
    this.router.navigate(['/login']);
  }
}
