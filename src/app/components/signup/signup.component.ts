import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { APIService } from '../../services/API.service';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  router = inject(Router);
  constructor(private apiService: APIService) {}
  signupForm = new FormGroup(
    {
      name: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
      ]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
      ]),
      passwordConfirm: new FormControl(null, [Validators.required]),
    },
    { validators: this.passwordMatchValidator }
  );
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const passwordConfirm = control.get('passwordConfirm')?.value;
    return password === passwordConfirm ? null : { passwordsMismatch: true };
  }
  onSubmit() {
    console.log(this.signupForm.value);
    if (this.signupForm.valid) {
      this.apiService.signup(this.signupForm.value).subscribe(
        (res) => {
          console.log(res);

          localStorage.clear();

          localStorage.setItem('token', res.token);
          localStorage.setItem('userID', res.data.user.id);
          this.signupForm.reset();

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
