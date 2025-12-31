import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="stats-card" [style.--accent-color]="color">
      <div class="stats-card__icon">{{ icon }}</div>
      <div class="stats-card__content">
        <span class="stats-card__value">{{ value }}</span>
        <span class="stats-card__label">{{ label }}</span>
      </div>
      @if (link) {
        <a [routerLink]="link" class="stats-card__link">
          Voir tout →
        </a>
      }
    </div>
  `,
  styles: [`
    .stats-card {
      background: #ffffff;
      border-radius: 16px;
      padding: 25px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
      display: flex;
      align-items: center;
      gap: 20px;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;

      &:: before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 5px;
        height: 100%;
        background: var(--accent-color, #667eea);
      }

      &: hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
      }

      &__icon {
        font-size: 2. 5rem;
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, var(--accent-color, #667eea), #764ba2);
        border-radius: 12px;
        opacity: 0.9;
      }

      &__content {
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      &__value {
        font-size: 2rem;
        font-weight: 700;
        color:  #1a1a2e;
        line-height: 1;
      }

      &__label {
        font-size:  0.9rem;
        color:  #666;
        margin-top: 5px;
      }

      &__link {
        color: var(--accent-color, #667eea);
        text-decoration: none;
        font-size: 0.85rem;
        font-weight: 500;
        white-space: nowrap;
        transition: color 0.3s;

        &:hover {
          color:  #764ba2;
        }
      }
    }
  `]
})
export class StatsCardComponent {
  @Input() icon = '📊';
  @Input() value: string | number = 0;
  @Input() label = '';
  @Input() color = '#667eea';
  @Input() link = '';
}