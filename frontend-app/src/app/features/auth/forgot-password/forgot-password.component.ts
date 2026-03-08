import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl:  './forgot-password.component.html',
  styleUrls:  ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  authService = inject(AuthService);

  forgotForm: FormGroup;
  isSubmitted = false;
  isLoading = false;

  constructor() {
    this.forgotForm = this.fb.group({
      email:  ['', [Validators.required, Validators.email]]
    });
  }

  get email() {
    return this. forgotForm.get('email');
  }

  onSubmit(): void {
    if (this.forgotForm. invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    this.authService.forgotPassword(this.forgotForm.value. email).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.isSubmitted = true;
        this.toastr.success(response.message, 'Email envoyé');
      },
      error: () => {
        this.isLoading = false;
        // On affiche quand même le succès pour des raisons de sécurité
        this.isSubmitted = true;
      }
    });
  }
}