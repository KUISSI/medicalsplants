import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ReviewService } from '../../../core/services/review.service';
import { Review } from '../../../core/models/review.model';

@Component({
  selector: 'app-review-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './review-detail.component.html',
  styleUrl: './review-detail.component.scss'
})
export class ReviewDetailComponent implements OnInit {
  private reviewService = inject(ReviewService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  review: Review | null = null;
  isLoading = true;
  errorMessage: string | null = null;

  canEdit = false;
  canDelete = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadReview(id);
    } else {
      this.errorMessage = "Aucun identifiant d'avis fourni.";
      this.isLoading = false;
    }
  }

  loadReview(id: string) {
    this.isLoading = true;
    this.reviewService.getById(id).subscribe({
      next: (review: Review) => {
        this.review = review;
        // À adapter selon ta logique d'authentification
        this.canEdit = this.isCurrentUserAuthor(review);
        this.canDelete = this.isCurrentUserAuthor(review);
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = "Impossible de charger l'avis.";
        this.isLoading = false;
      }
    });
  }

  isCurrentUserAuthor(review: Review): boolean {
    // À adapter selon ton système d'authentification/utilisateur
    // Exemple : return review.author?.id === this.authService.currentUserId;
    return false;
  }

  onEdit() {
    if (this.review) {
      this.router.navigate(['/reviews', this.review.id, 'edit']);
    }
  }

  onDelete() {
    if (this.review && confirm('Supprimer cet avis ?')) {
      this.reviewService.delete(this.review.id).subscribe({
        next: () => this.router.navigate(['/reviews']),
        error: () => alert("Erreur lors de la suppression de l'avis.")
      });
    }
  }
}