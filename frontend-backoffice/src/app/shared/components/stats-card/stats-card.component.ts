import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <a class="stats-card" [style.--accent-color]="color" [routerLink]="link || null">
      <div class="stats-card__icon-wrap">
        <i class="bi {{ icon }}" aria-hidden="true"></i>
      </div>
      <div class="stats-card__content">
        <span class="stats-card__value">{{ value }}</span>
        <span class="stats-card__label">{{ label }}</span>
      </div>
      <i class="bi bi-chevron-right stats-card__arrow" aria-hidden="true"></i>
    </a>
  `,
  styles: [`
    .stats-card {
      background: #ffffff;
      border-radius: 14px;
      padding: 20px 22px;
      box-shadow: 0 2px 10px rgba(26, 71, 42, 0.07);
      display: flex;
      align-items: center;
      gap: 16px;
      position: relative;
      transition: all 0.25s ease;
      text-decoration: none;
      color: inherit;
      border: 1.5px solid transparent;

      &:hover {
        transform: translateY(-3px);
        border-color: var(--accent-color, #4CAF50);
        box-shadow: 0 8px 24px rgba(26, 71, 42, 0.12);
      }

      &__icon-wrap {
        width: 52px;
        height: 52px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: color-mix(in srgb, var(--accent-color, #4CAF50) 12%, #F3FBF0);
        border-radius: 12px;
        flex-shrink: 0;
        color: var(--accent-color, #4CAF50);
        font-size: 1.35rem;
      }

      &__content {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-width: 0;
      }

      &__value {
        font-family: 'Rosarivo', serif;
        font-size: 1.85rem;
        color: #1a472a;
        line-height: 1;
        font-weight: 400;
      }

      &__label {
        font-size: 0.82rem;
        color: #666;
        margin-top: 4px;
        text-transform: uppercase;
        letter-spacing: 0.4px;
        font-weight: 600;
      }

      &__arrow {
        color: #ccc;
        font-size: 0.85rem;
        transition: all 0.25s ease;
      }

      &:hover &__arrow {
        color: var(--accent-color, #4CAF50);
        transform: translateX(3px);
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