import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports:  [CommonModule, RouterModule],
  template: `
    <div class="not-found">
      <div class="not-found__content">
        <span class="not-found__icon">🌿</span>
        <h1 class="not-found__title">404</h1>
        <h2 class="not-found__subtitle">Page non trouvée</h2>
        <p class="not-found__message">
          Oups !  La page que vous recherchez semble avoir disparu dans la nature.
        </p>
        <div class="not-found__actions">
          <a routerLink="/" class="not-found__btn not-found__btn--primary">
            Retour à l'accueil
          </a>
          <a routerLink="/symptoms" class="not-found__btn not-found__btn--secondary">
            Explorer les symptômes
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .not-found {
      min-height: calc(100vh - 140px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      background: linear-gradient(135deg, #f5f5f5 0%, #e8f5e9 100%);
      text-align: center;

      &__content {
        max-width: 500px;
      }

      &__icon {
        font-size: 5rem;
        display: block;
        margin-bottom: 20px;
        animation: shake 2s ease-in-out infinite;
      }

      &__title {
        font-size: 6rem;
        color: #1a472a;
        margin: 0;
        font-weight: 800;
        line-height: 1;
      }

      &__subtitle {
        font-size:  1.8rem;
        color: #4CAF50;
        margin: 10px 0 20px 0;
        font-weight: 600;
      }

      &__message {
        color:  #666;
        font-size: 1.1rem;
        line-height: 1.6;
        margin: 0 0 30px 0;
      }

      &__actions {
        display: flex;
        gap: 15px;
        justify-content: center;
        flex-wrap: wrap;
      }

      &__btn {
        padding: 12px 25px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 600;
        transition: all 0.3s ease;

        &--primary {
          background: #4CAF50;
          color: #ffffff;

          &:hover {
            background: #45a049;
            transform: translateY(-2px);
          }
        }

        &--secondary {
          background: transparent;
          color:  #4CAF50;
          border: 2px solid #4CAF50;

          &:hover {
            background: #4CAF50;
            color: #ffffff;
          }
        }
      }
    }

    @keyframes shake {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(-5deg); }
      75% { transform: rotate(5deg); }
    }
  `]
})
export class NotFoundComponent {}