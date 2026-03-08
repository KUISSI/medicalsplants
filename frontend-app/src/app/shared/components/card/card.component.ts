import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector:  'app-card',
  standalone:  true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="card" [class.card--clickable]="link" [class.card--premium]="isPremium">
      @if (isPremium) {
        <div class="card__badge">Premium</div>
      }
      
      @if (image) {
        <div class="card__image">
          <img [src]="image" [alt]="title" />
        </div>
      }
      
      <div class="card__content">
        @if (icon) {
          <span class="card__icon">{{ icon }}</span>
        }
        
        <h3 class="card__title">{{ title }}</h3>
        
        @if (subtitle) {
          <p class="card__subtitle">{{ subtitle }}</p>
        }
        
        @if (description) {
          <p class="card__description">{{ description }}</p>
        }
        
        <ng-content></ng-content>
      </div>

      @if (link) {
        <a [routerLink]="link" class="card__link-overlay" [attr.aria-label]="'Voir ' + title"></a>
      }
    </div>
  `,
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() description = '';
  @Input() icon = '';
  @Input() image = '';
  @Input() link = '';
  @Input() isPremium = false;
}