import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { StatsCardComponent } from '../../shared/components/stats-card/stats-card.component';
import { UserService } from '../../core/services/user.service';
import { PlantService } from '../../core/services/plant.service';
import { RecipeService } from '../../core/services/recipe.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, StatsCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  private userService = inject(UserService);
  private plantService = inject(PlantService);
  private recipeService = inject(RecipeService);
  private cdr = inject(ChangeDetectorRef);

  today = new Date();

  stats = { users: 0, plants: 0, receipts: 0, pendingReceipts: 0 };

  recentActivities: { message: string; color: string; time: string }[] = [];

  quickActions = [
    {
      icon: 'bi-flower1',
      label: 'Gérer les plantes',
      description: 'Catalogue de plantes',
      link: '/plants',
      color: '#4CAF50',
    },
    {
      icon: 'bi-activity',
      label: 'Gérer les symptômes',
      description: 'Liste des symptômes',
      link: '/symptoms',
      color: '#2d5a3d',
    },
    {
      icon: 'bi-stars',
      label: 'Propriétés',
      description: 'Propriétés thérap.',
      link: '/properties',
      color: '#388E3C',
    },
    {
      icon: 'bi-shield-check',
      label: 'Modération',
      description: 'Recettes en attente',
      link: '/recipes/moderation',
      color: '#FF9800',
    },
  ];

  ngOnInit(): void {
    forkJoin({
      users: this.userService.getAll(0, 1),
      plants: this.plantService.getAll(0, 1),
      recipes: this.recipeService.getAll(0, 1),
      pending: this.recipeService.getPending(),
    }).subscribe({
      next: ({ users, plants, recipes, pending }) => {
        this.stats = {
          users: users.totalElements,
          plants: plants.totalElements,
          receipts: recipes.totalElements,
          pendingReceipts: pending.length,
        };
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }
}
