import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls:  ['./login.component.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  authService = inject(AuthService);

  loginForm: FormGroup;
  showPassword = false;
  returnUrl:  string = '/';

  constructor() {
    this.loginForm = this.fb. group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators. required, Validators. minLength(8)]]
    });

    // Récupérer l'URL de retour si présente
    this.returnUrl = this.route.snapshot. queryParams['returnUrl'] || '/';
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  togglePassword(): void {
    this.showPassword = ! this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm. invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authService. login(this.loginForm.value).subscribe({
      next:  () => {
        this.router.navigateByUrl(this.returnUrl);
      }
    });
  }
}