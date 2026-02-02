import { Component, OnInit, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { RecipeService } from '../../../core/services/recipe.service';
import { ReviewService } from '../../../core/services/review.service';
import { AuthService } from '../../../core/services/auth.service';
import { Recipe, Recipe_TYPE_LABELS, Recipe_STATUS_LABELS } from '../../../core/models/recipe.model';
import { Review, CreateReviewRequest } from '../../../core/models/review.model';
import { ToastrService } from 'ngx-toastr';
import { NavigationService } from '../../../core/services/navigation.service';

@Component({
  selector: 'app-Recipe-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LoaderComponent],
  templateUrl: './Recipe-detail.component.html',
  styleUrls: ['./Recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router); // Inject Router
  private RecipeService = inject(RecipeService);
  private reviewService = inject(ReviewService);
  private toastr = inject(ToastrService);
  authService = inject(AuthService);
  private navigationService = inject(NavigationService);

  Recipe:  Recipe | null = null;
  reviews: Review[] = [];
  
  isLoading = true;
  isLoadingReviews = true;
  isSubmittingReview = false;
  error: string | null = null;
  currentQueryParams: { [key: string]: any } = {}; // Property to store query params

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

  RecipeTypeLabels = Recipe_TYPE_LABELS;
  RecipeStatusLabels = Recipe_STATUS_LABELS;

  @ViewChild('plantsSection') plantsSection!: ElementRef;
  @ViewChild('reviewsSection') reviewsSection!: ElementRef;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadRecipe(id);
      }
    });

    // Capture all query parameters to pass back to the list
    this.route.queryParams.subscribe(params => {
      this.currentQueryParams = params;
    });
  }

  loadRecipe(id: string): void {
    this.isLoading = true;
    this.error = null;

    this.RecipeService.getById(id).subscribe({
      next: (Recipe: Recipe) => {
        this.Recipe = Recipe;
        if (this.Recipe) {
          this.Recipe.imageUrl = 'assets/recipeimg.svg';
        }

        // Populate view-specific properties
        const difficulties = ['Facile', 'Moyen', 'Difficile'];
        this.time = ((Recipe.id.charCodeAt(0) % 5) + 1) * 10;
        this.difficulty = difficulties[Recipe.id.charCodeAt(0) % difficulties.length];
        this.rating = (Recipe.id.charCodeAt(0) % 3) + 3;

        if (Recipe.ingredients) {
          this.mainIngredients = Recipe.ingredients.filter(ing => !ing.toLowerCase().includes('(optionnel)'));
          this.optionalIngredients = Recipe.ingredients.filter(ing => ing.toLowerCase().includes('(optionnel)'));
        }

        if (Recipe.description && Recipe.description.split('\n').length > 1) {
          this.preparationSteps = Recipe.description.split('\n').filter(step => step.trim().length > 0);
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

  loadReviews(RecipeId: string): void {
    this.isLoadingReviews = true;

    this.reviewService.getByrecipeId(RecipeId).subscribe({
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
    if (!this.newReviewContent.trim() || !this.Recipe) {
      return;
    }

    this.isSubmittingReview = true;

    const request:  CreateReviewRequest = {
      recipeId: this.Recipe.id,
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
    if (!this.replyContent.trim() || !this.Recipe) {
      return;
    }

    const request: CreateReviewRequest = {
      recipeId: this.Recipe.id,
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

  goBack(): void {
    this.navigationService.back();
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  scrollToBottom(): void {
    const headerOffset = 70; // Actual header height
    const scrollPosition = window.scrollY;
    let targetScrollPosition: number | null = null;

    // Check if plantsSection exists and is below current view
    if (this.plantsSection && this.plantsSection.nativeElement.offsetTop > scrollPosition + headerOffset) {
      targetScrollPosition = this.plantsSection.nativeElement.offsetTop - headerOffset;
    } 
    // If plantsSection is not below or already passed, check reviewsSection
    else if (this.reviewsSection && this.reviewsSection.nativeElement.offsetTop > scrollPosition + headerOffset) {
      targetScrollPosition = this.reviewsSection.nativeElement.offsetTop - headerOffset;
    } 

    if (targetScrollPosition !== null) {
      window.scrollTo({ top: targetScrollPosition, behavior: 'smooth' });
    }
  }
}