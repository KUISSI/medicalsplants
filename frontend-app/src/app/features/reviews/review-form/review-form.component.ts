import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Review, CreateReviewRequest } from '../../../core/models/review.model';
import { ReviewService } from '../../../core/services/review.service';
import { LoaderComponent } from '../../../shared/components/loader/loader.component'; // adapte le chemin si besoin


@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LoaderComponent // ← ajoute-le ici
  ],
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.scss']
})
export class ReviewFormComponent implements OnInit {
  @Input() recipeId!: string;
  @Input() isEditMode = false;
  @Input() initialContent: string = '';
  @Input() initialRating?: number;
  @Output() submitted = new EventEmitter<Review>();
  @Output() cancel = new EventEmitter<void>();

  form = {
    content: '',
    rating: undefined as number | undefined
  };
  isLoading = false;
  isSubmitting = false;
  errorMessage: string | null = null;

  constructor(private reviewService: ReviewService) {}

  ngOnInit() {
    this.form.content = this.initialContent;
    this.form.rating = this.initialRating;
  }

  onSubmit() {
    if (!this.recipeId || !this.form.content.trim()) {
      this.errorMessage = 'Le contenu de l\'avis est obligatoire.';
      return;
    }
    this.isSubmitting = true;
    const request: CreateReviewRequest = {
      recipeId: this.recipeId,
      content: this.form.content.trim(),
      rating: this.form.rating
    };
    this.reviewService.create(request).subscribe({
      next: (review) => {
        this.submitted.emit(review);
        this.isSubmitting = false;
        this.form.content = '';
        this.form.rating = undefined;
        this.errorMessage = null;
      },
      error: () => {
        this.errorMessage = 'Erreur lors de l\'envoi de l\'avis.';
        this.isSubmitting = false;
      }
    });
  }

  onCancel() {
    this.cancel.emit();
  }
}