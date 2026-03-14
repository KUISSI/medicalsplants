import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StatsCardComponent } from '../../shared/components/stats-card/stats-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, StatsCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  today = new Date();

  stats = {
    users: 156,
    plants: 45,
    receipts: 89,
    pendingReceipts: 5
  };

  recentActivities = [
    { message: 'Nouvel utilisateur inscrit : TestUser',         time: 'Il y a 5 minutes',  color: '#4CAF50' },
    { message: 'Nouvelle recette soumise pour modération',      time: 'Il y a 15 minutes', color: '#FF9800' },
    { message: 'Avis publié sur "Tisane relaxante"',            time: 'Il y a 30 minutes', color: '#2196F3' },
    { message: 'Plante "Camomille" mise à jour',                time: 'Il y a 1 heure',    color: '#1a472a' },
    { message: 'Recette "Infusion digestive" approuvée',        time: 'Il y a 2 heures',   color: '#4CAF50' }
  ];

  quickActions = [
    { icon: 'bi-flower1',      label: 'Gérer les plantes',   description: 'Catalogue de plantes',  link: '/plants',             color: '#4CAF50' },
    { icon: 'bi-activity',     label: 'Gérer les symptômes', description: 'Liste des symptômes',   link: '/symptoms',           color: '#2d5a3d' },
    { icon: 'bi-stars',        label: 'Propriétés',          description: 'Propriétés thérap.',    link: '/properties',         color: '#388E3C' },
    { icon: 'bi-shield-check', label: 'Modération',          description: 'Recettes en attente',   link: '/recipes/moderation', color: '#FF9800' }
  ];
}
