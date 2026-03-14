import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-slide-over',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slide-over.component.html',
  styleUrls: ['./slide-over.component.scss']
})
export class SlideOverComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() subtitle = '';

  @Output() closed = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen) this.closed.emit();
  }

  onBackdropClick(): void {
    this.closed.emit();
  }
}
