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
import { ADMINISTRATION_MODE_LABELS } from '../../../core/models/plant.model';
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

  // New review
  newReviewContent = '';
  replyingToId: string | null = null;
  replyContent = '';

  receiptTypeLabels = RECEIPT_TYPE_LABELS;
  receiptStatusLabels = RECEIPT_STATUS_LABELS;
  administrationModeLabels = ADMINISTRATION_MODE_LABELS;

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
        this. receipt = receipt;
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

  submitReview(): void {
    if (!this.newReviewContent.trim() || !this.receipt) {
      return;
    }

    this.isSubmittingReview = true;

    const request:  CreateReviewRequest = {
      receiptId: this.receipt.id,
      content: this.newReviewContent. trim()
    };

    this.reviewService. create(request).subscribe({
      next: (review) => {
        this.reviews.unshift(review);
        this.newReviewContent = '';
        this.isSubmittingReview = false;
        this.toastr. success('Votre avis a été publié', 'Merci ! ');
      },
      error: () => {
        this.isSubmittingReview = false;
      }
    });
  }

  startReply(reviewId: string): void {
    this. replyingToId = reviewId;
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
        // Ajouter la réponse au review parent
        const parentReview = this. reviews.find(r => r.id === parentReviewId);
        if (parentReview) {
          if (! parentReview.replies) {
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

    this.reviewService. delete(reviewId).subscribe({
      next: () => {
        this.reviews = this.reviews.filter(r => r. id !== reviewId);
        this.toastr.success('Avis supprimé', 'Succès');
      }
    });
  }

  getReceiptTypeIcon(type: string): string {
    const icons:  Record<string, string> = {
      'HOT_DRINK': '☕',
      'COLD_DRINK': '🧊',
      'DISH': '🍽️',
      'LOTION': '🧴'
    };
    return icons[type] || '📖';
  }

  getAdministrationIcon(mode: string): string {
    const icons:  Record<string, string> = {
      'ORAL_ROUTE': '☕',
      'NASAL_ROUTE':  '👃',
      'EPIDERMAL_ROUTE': '🧴'
    };
    return icons[mode] || '🌿';
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
    return review.sender. id === currentUser. id || this.authService.isAdmin();
  }
}