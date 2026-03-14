import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports:  [CommonModule],
  template: `
    @if (isOpen) {
      <div class="dialog-overlay" (click)="onCancel()">
        <div class="dialog" (click)="$event.stopPropagation()">
          <div class="dialog__header">
            <span class="dialog__icon">{{ icon }}</span>
            <h3 class="dialog__title">{{ title }}</h3>
          </div>
          <p class="dialog__message">{{ message }}</p>
          <div class="dialog__actions">
            <button class="dialog__btn dialog__btn--cancel" (click)="onCancel()">
              {{ cancelText }}
            </button>
            <button 
              class="dialog__btn dialog__btn--confirm" 
              [class.dialog__btn--danger]="type === 'danger'"
              (click)="onConfirm()"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .dialog-overlay {
      position: fixed;
      top:  0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index:  9999;
      animation: fadeIn 0.2s ease;
    }

    .dialog {
      background: #ffffff;
      border-radius: 16px;
      padding: 30px;
      max-width: 400px;
      width: 90%;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      animation: slideUp 0.3s ease;

      &__header {
        display: flex;
        align-items: center;
        gap:  15px;
        margin-bottom: 15px;
      }

      &__icon {
        font-size: 2rem;
      }

      &__title {
        font-size: 1.15rem;
        color: #1a472a;
        margin: 0;
        font-weight: 600;
      }

      &__message {
        color:  #666;
        font-size: 1rem;
        line-height: 1.6;
        margin: 0 0 25px 0;
      }

      &__actions {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
      }

      &__btn {
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 0.95rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        border: none;

        &--cancel {
          background: #f0f0f0;
          color: #666;

          &:hover {
            background: #e0e0e0;
          }
        }

        &--confirm {
          background: linear-gradient(135deg, #4CAF50 0%, #2d5a3d 100%);
          color: #ffffff;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);
          }
        }

        &--danger {
          background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);

          &:hover {
            box-shadow: 0 4px 15px rgba(244, 67, 54, 0.4);
          }
        }
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity:  1;
        transform: translateY(0);
      }
    }
  `]
})
export class ConfirmDialogComponent {
  @Input() isOpen = false;
  @Input() title = 'Confirmation';
  @Input() message = 'Êtes-vous sûr ? ';
  @Input() icon = '⚠️';
  @Input() type: 'default' | 'danger' = 'default';
  @Input() confirmText = 'Confirmer';
  @Input() cancelText = 'Annuler';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm. emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}