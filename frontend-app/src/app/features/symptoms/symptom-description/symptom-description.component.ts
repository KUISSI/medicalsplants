import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Symptom } from '../../../core/models/symptom.model';
import { SymptomService } from '../../../core/services/symptom.service';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-symptom-description',
  standalone: true,
  imports: [CommonModule, RouterModule, LoaderComponent],
  templateUrl: './symptom-description.component.html',
  styleUrls: ['./symptom-description.component.scss']
})
export class SymptomDescriptionComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private symptomService = inject(SymptomService);

  symptom: Symptom | undefined;
  isLoading = true;

  ngOnInit(): void {
    const symptomId = this.route.snapshot.paramMap.get('id');
    if (symptomId) {
      this.loadSymptom(symptomId);
    }
  }

  loadSymptom(id: string): void {
    this.isLoading = true;
    this.symptomService.getById(id).subscribe({
      next: (symptom) => {
        this.symptom = symptom;
        this.isLoading = false;
      },
      error: () => {
        // Fallback to mock data if the service fails
        const mockSymptoms: Symptom[] = [
          { 
            id: '1', 
            title: 'Mal de tête', 
            symptomFamily: 'Neurologique', 
            description: 'Le mal de tête, ou céphalée, est une douleur ressentie au niveau de la boîte crânienne. Il peut être ponctuel ou chronique, léger ou intense, et toucher toute la tête ou une partie seulement. C\'est l\'un des symptômes les plus courants.', 
            createdAt: new Date().toISOString() 
          },
          {
            id: '2',
            title: 'Migraine',
            symptomFamily: 'Neurologique',
            description: 'La migraine est une forme de mal de tête chronique qui se manifeste par des crises de douleurs intenses et pulsatiles, souvent d\'un seul côté de la tête. Elle peut être accompagnée de nausées, de vomissements et d\'une sensibilité à la lumière et au son.',
            createdAt: new Date().toISOString()
          },
          {
            id: '3',
            title: 'Insomnie',
            symptomFamily: 'Sommeil',
            description: 'L\'insomnie est un trouble du sommeil qui se caractérise par des difficultés à s\'endormir, à rester endormi ou par un sommeil non réparateur. Elle peut être occasionnelle ou chronique et avoir un impact important sur la qualité de vie.',
            createdAt: new Date().toISOString()
          },
          {
            id: '4',
            title: 'Stress',
            symptomFamily: 'Psychologique',
            description: 'Le stress est une réaction de l\'organisme face à une situation perçue comme menaçante ou difficile. Il peut se manifester par des symptômes physiques (tensions musculaires, maux de tête), émotionnels (anxiété, irritabilité) et comportementaux (isolement, agitation).',
            createdAt: new Date().toISOString()
          },
          {
            id: '5',
            title: 'Toux',
            symptomFamily: 'Respiratoire',
            description: 'La toux est un réflexe naturel de défense des voies respiratoires qui permet d\'expulser les mucosités ou les agents irritants. Elle peut être sèche ou grasse, aiguë ou chronique, et avoir de multiples causes (infection, allergie, asthme).',
            createdAt: new Date().toISOString()
          },
          {
            id: '6',
            title: 'Rhume',
            symptomFamily: 'Respiratoire',
            description: 'Le rhume, ou rhinopharyngite, est une infection virale très fréquente des voies respiratoires supérieures (nez et gorge). Il se manifeste par un nez qui coule, des éternuements, une légère fièvre et une sensation de malaise général.',
            createdAt: new Date().toISOString()
          },
          {
            id: '7',
            title: 'Nausées',
            symptomFamily: 'Digestif',
            description: 'La nausée est une sensation désagréable de malaise au niveau de l\'estomac, souvent accompagnée d\'une envie de vomir. Elle peut avoir de nombreuses causes, comme une intoxication alimentaire, le mal des transports ou une grossesse.',
            createdAt: new Date().toISOString()
          },
          {
            id: '8',
            title: 'Mal de ventre',
            symptomFamily: 'Digestif',
            description: 'Le mal de ventre, ou douleur abdominale, est une douleur ressentie entre le thorax et le bassin. Il peut être aigu ou chronique, localisé ou diffus, et avoir des origines très diverses (digestives, gynécologiques, urinaires).',
            createdAt: new Date().toISOString()
          },
          {
            id: '9',
            title: 'Brûlures d\'estomac',
            symptomFamily: 'Digestif',
            description: 'Les brûlures d\'estomac, ou pyrosis, sont une sensation de brûlure qui remonte de l\'estomac vers l\'œsophage. Elles sont dues à un reflux de liquide gastrique acide et peuvent être favorisées par certains aliments ou positions.',
            createdAt: new Date().toISOString()
          },
          {
            id: '10',
            title: 'Anxiété',
            symptomFamily: 'Psychologique',
            description: 'L\'anxiété est une émotion normale qui devient un trouble lorsqu\'elle est excessive, persistante et handicapante au quotidien. Elle se manifeste par une inquiétude constante, des peurs irrationnelles, des tensions physiques et des troubles du sommeil.',
            createdAt: new Date().toISOString()
          },
          {
            id: '11',
            title: 'Fatigue',
            symptomFamily: 'Général',
            description: 'La fatigue, ou asthénie, est un état d\'épuisement physique ou mental qui ne disparaît pas avec le repos. Elle peut être le symptôme de nombreuses maladies, d\'un surmenage, d\'une carence ou d\'un mode de vie inadapté.',
            createdAt: new Date().toISOString()
          },
          {
            id: '12',
            title: 'Douleurs musculaires',
            symptomFamily: 'Musculaire',
            description: 'Les douleurs musculaires, ou myalgies, sont des douleurs ressenties au niveau des muscles. Elles peuvent être localisées ou diffuses, et survenir après un effort, un traumatisme ou dans le cadre d\'une maladie (grippe, fibromyalgie).',
            createdAt: new Date().toISOString()
          },
          {
            id: '13',
            title: 'Fièvre',
            symptomFamily: 'Général',
            description: 'Augmentation de la température corporelle au-dessus de la normale, généralement en réponse à une infection.',
            createdAt: new Date().toISOString()
          },
          {
            id: '14',
            title: 'Diarrhée',
            symptomFamily: 'Digestif',
            description: 'Selles fréquentes et liquides, souvent causées par une infection ou une intoxication alimentaire.',
            createdAt: new Date().toISOString()
          },
          {
            id: '15',
            title: 'Constipation',
            symptomFamily: 'Digestif',
            description: 'Difficulté à évacuer les selles, qui sont souvent dures et peu fréquentes.',
            createdAt: new Date().toISOString()
          },
          {
            id: '16',
            title: 'Éruptions cutanées',
            symptomFamily: 'Cutané',
            description: 'Apparition de rougeurs, de boutons ou de plaques sur la peau, pouvant être accompagnée de démangeaisons.',
            createdAt: new Date().toISOString()
          },
          {
            id: '17',
            title: 'Maux de gorge',
            symptomFamily: 'Respiratoire',
            description: 'Douleur ou irritation de la gorge, souvent causée par une infection virale ou bactérienne.',
            createdAt: new Date().toISOString()
          },
          {
            id: '18',
            title: 'Vertiges',
            symptomFamily: 'Neurologique',
            description: 'Sensation de rotation de l\'environnement ou de soi-même, pouvant être accompagnée de nausées et de pertes d\'équilibre.',
            createdAt: new Date().toISOString()
          },
          {
            id: '19',
            title: 'Dépression',
            symptomFamily: 'Psychologique',
            description: 'Trouble de l\'humeur caractérisé par une tristesse persistante, une perte d\'intérêt et un manque d\'énergie.',
            createdAt: new Date().toISOString()
          },
          {
            id: '20',
            title: 'Allergies',
            symptomFamily: 'Immunitaire',
            description: 'Réaction excessive du système immunitaire à une substance normalement inoffensive (allergène).',
            createdAt: new Date().toISOString()
          }
        ];
        this.symptom = mockSymptoms.find(s => s.id === id);
        this.isLoading = false;
      }
    });
  getSymptomIcon(family: string): string {
    const icons: Record<string, string> = {
      'Neurologique': '🧠',
      'Sommeil': '😴',
      'Psychologique': '🧘',
      'Respiratoire': '🫁',
      'Digestif': '🍽️',
      'Général': '💪',
      'Cutané': '🧴',
      'Cardiovasculaire': '❤️',
      'Musculaire': '💪',
      'Immunitaire': '🛡️'
    };
    return icons[family] || '🌿';
  }

  getFamilyColor(family: string): string {
    const colors: Record<string, string> = {
      'Neurologique': '#9C27B0',
      'Sommeil': '#3F51B5',
      'Psychologique': '#00BCD4',
      'Respiratoire': '#4CAF50',
      'Digestif': '#FF9800',
      'Général': '#607D8B',
      'Cutané': '#E91E63',
      'Cardiovasculaire': '#F44336',
      'Musculaire': '#795548',
      'Immunitaire': '#009688'
    };
    return colors[family] || '#4CAF50';
  }
}