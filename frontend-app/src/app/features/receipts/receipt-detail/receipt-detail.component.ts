import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { ReceiptService } from '../../../core/services/receipt.service';
import { ReviewService } from '../../../core/services/review.service';
import { AuthService } from '../../../core/services/auth.service';
import { Receipt, RECEIPT_TYPE_LABELS, RECEIPT_STATUS_LABELS } from '../../../core/models/receipt.model';
import { Review, CreateReviewRequest } from '../../../core/models/review.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-receipt-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LoaderComponent],
  templateUrl: './receipt-detail.component.html',
  styleUrls: ['./receipt-detail.component.scss']
})
export class ReceiptDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private receiptService = inject(ReceiptService);
  private reviewService = inject(ReviewService);
  private toastr = inject(ToastrService);
  authService = inject(AuthService);

  receipt:  Receipt | null = null;
  reviews: Review[] = [];
  
  isLoading = true;
  isLoadingReviews = true;
  isSubmittingReview = false;
  error: string | null = null;

  // View-specific properties
  time: number = 0;
  difficulty: string = 'Facile';
  rating: number = 4;
  hoveredRating: number = 0;
  mainIngredients: string[] = [];
  optionalIngredients: string[] = [];
  preparationSteps: string[] = [];

  // New review
  newReviewContent = '';
  replyingToId: string | null = null;
  replyContent = '';

  receiptTypeLabels = RECEIPT_TYPE_LABELS;
  receiptStatusLabels = RECEIPT_STATUS_LABELS;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadReceipt(id);
      }
    });
  }

  loadReceipt(id: string): void {
    this.isLoading = true;
    this.error = null;

    this.receiptService.getById(id).subscribe({
      next: (receipt: Receipt) => {
        this.receipt = receipt;
        if (this.receipt) {
          this.receipt.imageUrl = 'assets/recipeimg.svg';
        }

        // Populate view-specific properties
        const difficulties = ['Facile', 'Moyen', 'Difficile'];
        this.time = ((receipt.id.charCodeAt(0) % 5) + 1) * 10;
        this.difficulty = difficulties[receipt.id.charCodeAt(0) % difficulties.length];
        this.rating = (receipt.id.charCodeAt(0) % 3) + 3;

        if (receipt.ingredients) {
          this.mainIngredients = receipt.ingredients.filter(ing => !ing.toLowerCase().includes('(optionnel)'));
          this.optionalIngredients = receipt.ingredients.filter(ing => ing.toLowerCase().includes('(optionnel)'));
        }

        if (receipt.description && receipt.description.split('\n').length > 1) {
          this.preparationSteps = receipt.description.split('\n').filter(step => step.trim().length > 0);
        } else {
          this.preparationSteps = [
            "Faire bouillir l'eau dans une casserole.",
            "Ajouter les plantes séchées dans l'eau bouillante.",
            "Laisser infuser pendant 10 minutes à couvert.",
            "Filtrer l'infusion pour enlever les plantes.",
            "Ajouter le miel ou le citron si désiré.",
            "Servir chaud et déguster."
          ];
        }
        
        this.isLoading = false;
        this.loadReviews(id);
      },
      error: (err: any) => {
        this.isLoading = false;
        if (err.status === 403) {
          this.error = 'Cette recette est réservée aux membres Premium';
        } else {
          this.error = 'Recette non trouvée';
        }
      }
    });
  }

  loadReviews(receiptId: string): void {
    this.isLoadingReviews = true;

    this.reviewService.getByReceiptId(receiptId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.isLoadingReviews = false;
      },
      error: () => {
        this.isLoadingReviews = false;
      }
    });
  }

  setRating(rating: number): void {
    if (this.authService.isAuthenticated()) {
      this.rating = rating;
      this.toastr.success(`Vous avez donné une note de ${rating}/5 !`, 'Merci !');
    } else {
      this.toastr.info('Veuillez vous connecter pour noter cette recette.', 'Info');
    }
  }

  submitReview(): void {
    if (!this.newReviewContent.trim() || !this.receipt) {
      return;
    }

    this.isSubmittingReview = true;

    const request:  CreateReviewRequest = {
      receiptId: this.receipt.id,
      content: this.newReviewContent.trim()
    };

    this.reviewService.create(request).subscribe({
      next: (review) => {
        this.reviews.unshift(review);
        this.newReviewContent = '';
        this.isSubmittingReview = false;
        this.toastr.success('Votre avis a été publié', 'Merci !');
      },
      error: (err) => {
        this.isSubmittingReview = false;
        this.toastr.error(err?.error?.message || 'Une erreur est survenue lors de la publication de votre avis.', 'Erreur');
      }
    });
  }

  startReply(reviewId: string): void {
    this.replyingToId = reviewId;
    this.replyContent = '';
  }

  cancelReply(): void {
    this.replyingToId = null;
    this.replyContent = '';
  }

  submitReply(parentReviewId: string): void {
    if (!this.replyContent.trim() || !this.receipt) {
      return;
    }

    const request: CreateReviewRequest = {
      receiptId: this.receipt.id,
      content: this.replyContent.trim(),
      parentReviewId
    };

    this.reviewService.create(request).subscribe({
      next: (reply) => {
        const parentReview = this.reviews.find(r => r.id === parentReviewId);
        if (parentReview) {
          if (!parentReview.replies) {
            parentReview.replies = [];
          }
          parentReview.replies.push(reply);
        }
        this.cancelReply();
        this.toastr.success('Votre réponse a été publiée', 'Merci !');
      }
    });
  }

  deleteReview(reviewId: string): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) {
      return;
    }

    this.reviewService.delete(reviewId).subscribe({
      next: () => {
        this.reviews = this.reviews.filter(r => r.id !== reviewId);
        this.toastr.success('Avis supprimé', 'Succès');
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year:  'numeric'
    });
  }

  canDeleteReview(review: Review): boolean {
    const currentUser = this.authService.currentUser();
    if (!currentUser) return false;
    return review.sender.id === currentUser.id || this.authService.isAdmin();
  }
}