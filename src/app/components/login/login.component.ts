import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { APIService } from '../../services/API.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  router = inject(Router);
  constructor(private apiService: APIService) {}
  loginForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
    ]),
  });
  onSubmit() {
    if (this.loginForm.valid) {
      this.apiService.login(this.loginForm.value).subscribe(
        (res) => {
          console.log(res);
          localStorage.clear();

          localStorage.setItem('token', res.token);
          localStorage.setItem('userID', res.data.user.id);
          this.loginForm.reset();

          this.router.navigate(['/home']);
        },
        (error) => {
          console.log(error);
          this.router.navigate(['/error'], {
            state: { message: error.error.message },
          });
        }
      );
    }
  }
}
