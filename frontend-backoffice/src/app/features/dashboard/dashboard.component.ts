import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StatsCardComponent } from '../../shared/components/stats-card/stats-card.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, StatsCardComponent, LoaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);

  isLoading = true;

  stats = {
    users: 0,
    symptoms: 0,
    properties: 0,
    plants: 0,
    recipes: 0,
    pendingRecipes: 0,
  };

  recentActivities = [
    { icon: '👤', message: 'Nouvel utilisateur inscrit :  TestUser', time: 'Il y a 5 minutes' },
    { icon: '📖', message: 'Nouvelle recette soumise pour modération', time: 'Il y a 15 minutes' },
    { icon: '💬', message: 'Nouvel avis publié sur "Tisane relaxante"', time: 'Il y a 30 minutes' },
    { icon: '🌿', message: 'Plante "Camomille" mise à jour', time: 'Il y a 1 heure' },
    { icon: '✅', message: 'Recette "Infusion digestive" approuvée', time: 'Il y a 2 heures' },
  ];

  quickActions = [
    { icon: '🌿', label: 'Nouvelle plante', link: '/plants/new', color: '#4CAF50' },
    { icon: '🩺', label: 'Nouveau symptôme', link: '/symptoms/new', color: '#2196F3' },
    { icon: '✨', label: 'Nouvelle propriété', link: '/properties/new', color: '#9C27B0' },
    { icon: '⏳', label: 'Modération', link: '/recipes/moderation', color: '#FF9800' },
  ];

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    // Simulation - En production, appeler les vrais services
    setTimeout(() => {
      this.stats = {
        users: 156,
        symptoms: 24,
        properties: 18,
        plants: 45,
        recipes: 89,
        pendingRecipes: 5,
      };
      this.isLoading = false;
    }, 500);
  }
  today: string = new Date().toLocaleDateString();
}
