import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header-guest',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header-guest.component.html',
  styleUrls: ['./header-guest.component.scss']
})
export class HeaderGuestComponent {
}
