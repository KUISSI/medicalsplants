import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { SymptomService } from '../../core/services/symptom.service';
import { Symptom } from '../../core/models/symptom.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private symptomService = inject(SymptomService);

  symptoms: Symptom[] = [];
  filteredSymptoms:  Symptom[] = [];
  symptomFamilies: string[] = [];
  isLoading = true;
  searchTerm = '';

  disclaimerText = 'Ces conseils sont partagés pour votre bien-être, mais ne remplacent pas un avis médical. La nature est puissante, utilisez-la avec sagesse.';

  // Statistiques pour la page d'accueil
  stats = {
    symptoms: 0,
    plants: 50,
    recipes: 100,
    users: 500
  };

  // Features de l'application
  features = [
    {
      icon: '🔍',
      title: 'Recherche par symptôme',
      description:  'Trouvez les plantes adaptées à vos symptômes en quelques clics.'
    },
    {
      icon:  '🌱',
      title: 'Catalogue de plantes',
      description: 'Explorez notre base de données complète de plantes médicinales.'
    },
    {
      icon: '📖',
      title:  'Recettes naturelles',
      description: 'Découvrez des recettes pour préparer vos remèdes naturels.'
    },
    {
      icon:  '⭐',
      title: 'Avis communautaires',
      description: 'Partagez votre expérience et lisez les avis des autres utilisateurs.'
    }
  ];

  ngOnInit(): void {
    this.loadSymptoms();
  }

  loadSymptoms(): void {
    this.isLoading = true;
    this. symptomService.getAll().subscribe({
      next: (symptoms) => {
        this.symptoms = symptoms;
        this.filteredSymptoms = symptoms. slice(0, 8); // Afficher les 8 premiers
        this.stats.symptoms = symptoms. length;
        
        // Extraire les familles uniques
        this.symptomFamilies = [... new Set(symptoms. map(s => s.symptomFamily))];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onSearch(term: string): void {
    this. searchTerm = term;
    if (! term. trim()) {
      this.filteredSymptoms = this. symptoms. slice(0, 8);
      return;
    }

    const lowerTerm = term.toLowerCase();
    this.filteredSymptoms = this. symptoms.filter(symptom =>
      symptom. title.toLowerCase().includes(lowerTerm) ||
      symptom.symptomFamily. toLowerCase().includes(lowerTerm)
    ).slice(0, 8);
  }

  getSymptomIcon(family: string): string {
    const icons:  Record<string, string> = {
      'Neurologique': '🧠',
      'Sommeil': '😴',
      'Psychologique': '🧘',
      'Respiratoire': '🫁',
      'Digestif': '🍽️',
      'General': '💪',
      'Cutané': '🧴'
    };
    return icons[family] || '🌿';
  }
}