import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template:  `
    <div class="loader" [class.loader--fullscreen]="fullscreen">
      <div class="loader__spinner"></div>
      @if (message) {
        <p class="loader__message">{{ message }}</p>
      }
    </div>
  `,
  styles: [`
    .loader {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;

      &--fullscreen {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background:  rgba(255, 255, 255, 0.95);
        z-index: 9999;
      }

      &__spinner {
        width: 50px;
        height: 50px;
        border: 4px solid #e0e0e0;
        border-top-color: #667eea;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      &__message {
        margin-top: 20px;
        color: #666;
        font-size: 1rem;
      }
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `]
})
export class LoaderComponent {
  @Input() fullscreen = false;
  @Input() message = '';
}