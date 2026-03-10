import { Component, OnInit, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { ReviewService } from '../../../core/services/review.service';
import { Review } from '../../../core/models/review.model';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SearchBarComponent,
    LoaderComponent
  ],
  templateUrl: './review-list.component.html',
  styleUrl: './review-list.component.scss'
})
export class ReviewListComponent implements OnInit {
  private reviewService = inject(ReviewService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  reviews: Review[] = [];
  filteredReviews: Review[] = [];

  isLoading = true;
  searchTerm = '';
  isScrolled = false;
  errorMessage: string | null = null;

  // Pagination
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;
  pageSize = 8;

  // Tri dynamique
  sort = 'createdAt,desc'; // Par défaut, les plus récents d'abord

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['searchTerm'] || '';
      this.currentPage = params['page'] ? parseInt(params['page'], 10) : 0;
      this.loadReviews();
    });
  }

  loadReviews(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.reviewService
      .getAllReviews({
        page: this.currentPage,
        size: this.pageSize,
        sort: this.sort,
        searchTerm: this.searchTerm
      })
      .subscribe({
        next: (page) => {
          this.reviews = page.content;
          this.filteredReviews = this.reviews; // Adapter si filtrage local
          this.totalPages = page.totalPages;
          this.totalElements = page.totalElements;
          this.isLoading = false;
        },
        error: () => {
          this.errorMessage = "Impossible de charger les avis.";
          this.isLoading = false;
        }
      });
  }

  onSearch(term: string) {
    this.router.navigate([], {
      queryParams: { searchTerm: term, page: 0 },
      queryParamsHandling: 'merge'
    });
  }

  clearFilters() {
    this.router.navigate([], {
      queryParams: { searchTerm: null, page: 0 },
      queryParamsHandling: 'merge'
    });
  }

  loadPage(page: number) {
    this.router.navigate([], {
      queryParams: { page },
      queryParamsHandling: 'merge'
    });
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  get currentQueryParams() {
    return {
      searchTerm: this.searchTerm,
      page: this.currentPage
    };
  }
}