import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { ReceiptService } from '../../../core/services/receipt.service';
import { AuthService } from '../../../core/services/auth.service';
import { Receipt, ReceiptPage, ReceiptType, RECEIPT_TYPE_LABELS } from '../../../core/models/receipt.model';
import { RecipeCardComponent, RecipeCardData } from '../../../shared/components/recipe-card/recipe-card.component';

@Component({
  selector:  'app-receipt-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SearchBarComponent,
    LoaderComponent,
    RecipeCardComponent
  ],
  templateUrl: './receipt-list.component.html',
  styleUrls: ['./receipt-list.component.scss']
})
export class ReceiptListComponent implements OnInit {
  private receiptService = inject(ReceiptService);
  authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Mock receipts data
  mockReceipts: Receipt[] = [
    { id: '1', title: 'Infusion relaxante', description: 'Une infusion apaisante pour se détendre', type: 'HOT_DRINK' as ReceiptType, createdAt: new Date().toISOString(), isPremium: false, status: 'PUBLISHED' },
    { id: '2', title: 'Sirop pour la toux', description: 'Un sirop naturel pour soulager la toux', type: 'HOT_DRINK' as ReceiptType, createdAt: new Date().toISOString(), isPremium: false, status: 'PUBLISHED' },
    { id: '3', title: 'Baume apaisant', description: 'Un baume pour calmer les inflammations', type: 'LOTION' as ReceiptType, createdAt: new Date().toISOString(), isPremium: true, status: 'PUBLISHED' },
    { id: '4', title: 'Tisane digestive', description: 'Aide à la digestion après les repas', type: 'HOT_DRINK' as ReceiptType, createdAt: new Date().toISOString(), isPremium: false, status: 'PUBLISHED' },
    { id: '5', title: 'Elixir énergisant', description: 'Boost d\'énergie naturelle pour la journée', type: 'COLD_DRINK' as ReceiptType, createdAt: new Date().toISOString(), isPremium: true, status: 'PUBLISHED' },
    { id: '6', title: 'Teinture pour la peau', description: 'Soin naturel pour une peau saine', type: 'LOTION' as ReceiptType, createdAt: new Date().toISOString(), isPremium: false, status: 'PUBLISHED' }
  ];

  receipts: Receipt[] = [];
  filteredReceipts:  RecipeCardData[] = [];
  
  isLoading = true;
  searchTerm = '';
  selectedType: ReceiptType | '' = '';

  // Pagination
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;
  pageSize = 8;

  receiptTypes = RECEIPT_TYPE_LABELS;
  receiptTypeKeys = Object.keys(RECEIPT_TYPE_LABELS) as ReceiptType[];

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['searchTerm'] || '';
      this.selectedType = params['selectedType'] || '';
      this.currentPage = params['page'] ? parseInt(params['page'], 10) : 0;
      this.loadReceipts();
    });
  }

  loadReceipts(): void {
    this.isLoading = true;

    this.receiptService.getPublished(this.currentPage, this.pageSize).subscribe({
      next: (response:  ReceiptPage) => {
        this. receipts = response. content.length > 0 ? response.content : this.mockReceipts;
        this.totalPages = response.totalPages;
        this. totalElements = response. totalElements;
        this.applyFilters();
        this.isLoading = false;
      },
      error:  () => {
        // En cas d\'erreur, utiliser les mock data
        this.receipts = this.mockReceipts;
        this.totalPages = 1;
        this.totalElements = this.mockReceipts.length;
        this.applyFilters();
        this.isLoading = false;
      }
    });
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.currentPage = 0; // Reset page on new search
    this.applyFilters();
    this.updateUrlQueryParams();
  }

  onTypeChange(type:  ReceiptType | ''): void {
    this.selectedType = type;
    this.currentPage = 0; // Reset page on type change
    this.applyFilters();
    this.updateUrlQueryParams();
  }

  applyFilters(): void {
    let result = this.receipts;

    if (this.searchTerm. trim()) {
      const lowerTerm = this.searchTerm.toLowerCase();
      result = result.filter(receipt =>
        receipt.title.toLowerCase().includes(lowerTerm) ||
        receipt. description?. toLowerCase().includes(lowerTerm)
      );
    }

    if (this.selectedType) {
      result = result.filter(receipt => receipt.type === this.selectedType);
    }

    this.filteredReceipts = result.map(receipt => {
      const difficulties = ['Facile', 'Moyen', 'Difficile'];
      const rating = (receipt.id.charCodeAt(0) % 3) + 3;
      const time = ((receipt.id.charCodeAt(0) % 5) + 1) * 10;
      const difficulty = difficulties[receipt.id.charCodeAt(0) % difficulties.length];

      return {
        id: receipt.id,
        title: receipt.title,
        imageUrl: receipt.imageUrl,
        category: this.receiptTypes[receipt.type] || 'Recette',
        isPremium: receipt.isPremium,
        rating,
        time,
        difficulty,
      };
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedType = '';
    this.currentPage = 0;
    this.applyFilters();
    this.updateUrlQueryParams();
  }

  loadPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadReceipts();
      this.updateUrlQueryParams(); // Update URL on page change
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  private updateUrlQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        searchTerm: this.searchTerm || null,
        selectedType: this.selectedType || null,
        page: this.currentPage > 0 ? this.currentPage : null // Only add page if not 0
      },
      queryParamsHandling: 'merge'
    });
  }

  get currentQueryParams() {
    const params: any = {};
    if (this.searchTerm) {
      params['searchTerm'] = this.searchTerm;
    }
    if (this.selectedType) {
      params['selectedType'] = this.selectedType;
    }
    if (this.currentPage > 0) {
      params['page'] = this.currentPage;
    }
    return params;
  }

  getReceiptTypeIcon(type: ReceiptType): string {
    const icons:  Record<ReceiptType, string> = {
      'HOT_DRINK': '☕',
      'COLD_DRINK': '🧊',
      'DISH': '🍽️',
      'LOTION': '🧴'
    };
    return icons[type] || '📖';
  }

  getPages(): number[] {
    const pages: number[] = [];
    const start = Math.max(0, this.currentPage - 2);
    const end = Math. min(this.totalPages - 1, this. currentPage + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
}
