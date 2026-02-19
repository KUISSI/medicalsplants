import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { AuthService } from '../../../core/services/auth.service';
import { RecipeCardComponent, RecipeCardData } from '../../../shared/components/recipe-card/recipe-card.component';
import { RandomPlantTipComponent } from '../random-plant-tip.component/random-plant-tip.component';

@Component({
  selector: 'app-home-auth',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchBarComponent, RecipeCardComponent, RandomPlantTipComponent],
  templateUrl: './home-auth.component.html',
  styleUrls: ['./home-auth.component.scss']
})
export class HomeAuthComponent {
  authService = inject(AuthService);

  showMoreRecipes = false;

  // Mock popular recipes data
  popularRecipes: RecipeCardData[] = [
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


  get visibleRecipes(): RecipeCardData[] {
    return this.showMoreRecipes ? this.popularRecipes : this.popularRecipes.slice(0, 3);
  }

  toggleMoreRecipes(): void {
    this.showMoreRecipes = !this.showMoreRecipes;
  }

  onSearch(term: string): void {
    console.log('search:', term);
  }
}