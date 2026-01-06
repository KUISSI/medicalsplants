import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home-auth',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchBarComponent],
  templateUrl: './home-auth.component.html',
  styleUrls: ['./home-auth.component.scss']
})
export class HomeAuthComponent {
  authService = inject(AuthService);

  // Mock symptoms data
  symptoms = [
    { id: 1, title: 'Mal de tête', family: 'Neurologique' },
    { id: 2, title: 'Insomnie', family: 'Sommeil' },
    { id: 3, title: 'Stress', family: 'Psychologique' },
    { id: 4, title: 'Toux', family: 'Respiratoire' }
  ];

  // Mock plants data
  plants = [
    { id: 1, name: 'Menthe poivrée', uses: 'Digestion, fraîcheur' },
    { id: 2, name: 'Camomille', uses: 'Relaxation, sommeil' },
    { id: 3, name: 'Gingembre', uses: 'Nausée, inflammation' },
    { id: 4, name: 'Miel', uses: 'Toux, immunité' }
  ];

  // Mock recipes data
  recipes = [
    { id: 1, title: 'Infusion relaxante' },
    { id: 2, title: 'Sirop pour la toux' },
    { id: 3, title: 'Baume apaisant' }
  ];

  // Tip for "Le savez-vous" section
  tip = 'Saviez-vous que la menthe poivrée peut soulager les maux de tête en quelques minutes ? Essayez une infusion chaude !';

  onSearch(term: string): void {
    console.log('search:', term);
  }
}
