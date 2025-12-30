import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports:  [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register. component.scss']
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  authService = inject(AuthService);

  registerForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;

  constructor() {
    this.registerForm = this.fb. group({
      email: ['', [Validators.required, Validators.email]],
      pseudo: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z0-9_]+$/)
      ]],
      firstname: ['', [Validators.maxLength(100)]],
      lastname: ['', [Validators.maxLength(100)]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(100)
      ]],
      confirmPassword: ['', [Validators. required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    }, {
      validators:  this.passwordMatchValidator
    });
  }

  get email() { return this.registerForm.get('email'); }
  get pseudo() { return this.registerForm.get('pseudo'); }
  get firstname() { return this.registerForm. get('firstname'); }
  get lastname() { return this.registerForm.get('lastname'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
  get acceptTerms() { return this.registerForm.get('acceptTerms'); }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password. value !== confirmPassword. value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch:  true };
    }
    return null;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this. showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    if (this. registerForm.invalid) {
      this. registerForm.markAllAsTouched();
      return;
    }

    const { acceptTerms, ...formData } = this. registerForm.value;

    this.authService.register(formData).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      }
    });
  }
}
