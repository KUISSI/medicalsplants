import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { AuthService } from '../../core/services/auth.service';

interface PopularRecipe {
  id: number;
  title: string;
  category: string;
  rating: number;
  difficulty: string;
  time: number;
  imageUrl: string;
}

@Component({
  selector: 'app-home-auth',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchBarComponent],
  templateUrl: './home-auth.component.html',
  styleUrls: ['./home-auth.component.scss']
})
export class HomeAuthComponent {
  authService = inject(AuthService);

  showMoreRecipes = false;

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

  // Mock popular recipes data
  popularRecipes: PopularRecipe[] = [
    {
      id: 1,
      title: 'Infusion relaxante',
      category: 'Tisane',
      rating: 5,
      difficulty: 'Facile',
      time: 10,
      imageUrl: 'https://via.placeholder.com/280x200?text=Infusion'
    },
    {
      id: 2,
      title: 'Sirop pour la toux',
      category: 'Sirop',
      rating: 4,
      difficulty: 'Moyen',
      time: 30,
      imageUrl: 'https://via.placeholder.com/280x200?text=Sirop'
    },
    {
      id: 3,
      title: 'Baume apaisant',
      category: 'Pommade',
      rating: 5,
      difficulty: 'Moyen',
      time: 45,
      imageUrl: 'https://via.placeholder.com/280x200?text=Baume'
    },
    {
      id: 4,
      title: 'Tisane digestive',
      category: 'Tisane',
      rating: 4,
      difficulty: 'Facile',
      time: 15,
      imageUrl: 'https://via.placeholder.com/280x200?text=Digestive'
    },
    {
      id: 5,
      title: 'Elixir énergisant',
      category: 'Élixir',
      rating: 5,
      difficulty: 'Difficile',
      time: 60,
      imageUrl: 'https://via.placeholder.com/280x200?text=Elixir'
    },
    {
      id: 6,
      title: 'Teinture pour la peau',
      category: 'Teinture',
      rating: 4,
      difficulty: 'Difficile',
      time: 120,
      imageUrl: 'https://via.placeholder.com/280x200?text=Teinture'
    }
  ];

  // Tip for "Le savez-vous" section
  tip = 'Saviez-vous que la menthe poivrée peut soulager les maux de tête en quelques minutes ? Essayez une infusion chaude !';

  get visibleRecipes(): PopularRecipe[] {
    return this.showMoreRecipes ? this.popularRecipes : this.popularRecipes.slice(0, 3);
  }

  toggleMoreRecipes(): void {
    this.showMoreRecipes = !this.showMoreRecipes;
  }

  onSearch(term: string): void {
    console.log('search:', term);
  }

  onImageError(event: Event): void {
    const element = event.target as HTMLImageElement;
    if (element) {
      element.style.display = 'none';
    }
  }
}
