import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="verify-email-container">
      <div class="verify-email-card">
        <img src="assets/images/logo.png" alt="Logo" class="logo" />

        @if (loading) {
          <h2>Vérification en cours...</h2>
          <p>Veuillez patienter pendant que nous vérifions votre adresse email.</p>
        }

        @if (success) {
          <h2>✅ Email vérifié !</h2>
          <p>{{ message }}</p>
          <a routerLink="/login" class="btn-login">Se connecter</a>
        }

        @if (error) {
          <h2>❌ Erreur</h2>
          <p>{{ message }}</p>
          <a routerLink="/login" class="btn-login">Retour à la connexion</a>
        }
      </div>
    </div>
  `,
  styles: [`
    .verify-email-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      padding: 2rem;
    }
    .verify-email-card {
      background: white;
      border-radius: 12px;
      padding: 3rem;
      text-align: center;
      max-width: 500px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    .logo {
      width: 64px;
      height: 64px;
      margin-bottom: 1.5rem;
    }
    h2 { margin-bottom: 1rem; color: #2d3748; }
    p { color: #718096; margin-bottom: 2rem; }
    .btn-login {
      display: inline-block;
      background: #48bb78;
      color: white;
      padding: 0.75rem 2rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      transition: background 0.2s;
    }
    .btn-login:hover { background: #38a169; }
  `]
})
export class VerifyEmailComponent implements OnInit {
  loading = true;
  success = false;
  error = false;
  message = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.loading = false;
      this.error = true;
      this.message = 'Token de vérification manquant.';
      return;
    }

    this.authService.verifyEmail(token).subscribe({
      next: (response) => {
        this.loading = false;
        this.success = true;
        this.message = response.message;
      },
      error: (err) => {
        this.loading = false;
        this.error = true;
        this.message = err.error?.message || 'Le lien de vérification est invalide ou expiré.';
      }
    });
  }
}