import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-error-page',
  imports: [],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.css',
})
export class ErrorPageComponent {
  errorMessage: string = 'Something went wrong!';
  constructor(private router: Router, private route: ActivatedRoute) {
    const state = this.router.getCurrentNavigation()?.extras.state;
    if (state && state['message']) {
      this.errorMessage = state['message'];
    }
  }

  goToHome() {
    if (localStorage.getItem('token')) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
