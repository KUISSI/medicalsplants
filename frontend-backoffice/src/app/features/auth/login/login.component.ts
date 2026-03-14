import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

const MOCK_ADMIN = {
  email: 'admin@medicalsplants.com',
  password: 'Admin1234!'
};

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  loginForm: FormGroup;
  showPassword = false;
  loginError = '';

  constructor() {
    this.loginForm = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  get email()    { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;

    if (email === MOCK_ADMIN.email && password === MOCK_ADMIN.password) {
      this.authService.loginMock({
        id: '1', email, pseudo: 'Admin', role: 'ADMIN',
        status: 'ACTIVE', isActive: true, isEmailVerified: true,
        createdAt: new Date().toISOString()
      });
      this.router.navigate(['/']);
    } else {
      this.loginError = 'Email ou mot de passe incorrect.';
    }
  }
}
