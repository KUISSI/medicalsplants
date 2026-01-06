import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { ReceiptService } from '../../../core/services/receipt.service';
import { AuthService } from '../../../core/services/auth.service';
import { Receipt, ReceiptPage, ReceiptType, RECEIPT_TYPE_LABELS } from '../../../core/models/receipt.model';

@Component({
  selector:  'app-receipt-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SearchBarComponent,
    LoaderComponent
  ],
  templateUrl: './receipt-list.component.html',
  styleUrls: ['./receipt-list.component.scss']
})
export class ReceiptListComponent implements OnInit {
  private receiptService = inject(ReceiptService);
  authService = inject(AuthService);

  // Mock receipts data
  mockReceipts: Receipt[] = [
    { id: '1', title: 'Infusion relaxante', description: 'Une infusion apaisante pour se détendre', type: 'HERBAL_TEA' as ReceiptType, createdAt: new Date().toISOString() } as Receipt,
    { id: '2', title: 'Sirop pour la toux', description: 'Un sirop naturel pour soulager la toux', type: 'SYRUP' as ReceiptType, createdAt: new Date().toISOString() } as Receipt,
    { id: '3', title: 'Baume apaisant', description: 'Un baume pour calmer les inflammations', type: 'OINTMENT' as ReceiptType, createdAt: new Date().toISOString() } as Receipt,
    { id: '4', title: 'Tisane digestive', description: 'Aide à la digestion après les repas', type: 'HERBAL_TEA' as ReceiptType, createdAt: new Date().toISOString() } as Receipt,
    { id: '5', title: 'Elixir énergisant', description: 'Boost d\'énergie naturelle pour la journée', type: 'ELIXIR' as ReceiptType, createdAt: new Date().toISOString() } as Receipt,
    { id: '6', title: 'Teinture pour la peau', description: 'Soin naturel pour une peau saine', type: 'TINCTURE' as ReceiptType, createdAt: new Date().toISOString() } as Receipt
  ];

  receipts: Receipt[] = [];
  filteredReceipts:  Receipt[] = [];
  
  isLoading = true;
  searchTerm = '';
  selectedType: ReceiptType | '' = '';

  // Pagination
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;
  pageSize = 12;

  receiptTypes = RECEIPT_TYPE_LABELS;
  receiptTypeKeys = Object.keys(RECEIPT_TYPE_LABELS) as ReceiptType[];

  ngOnInit(): void {
    this.loadReceipts();
  }

  loadReceipts(): void {
    this.isLoading = true;

    this.receiptService.getPublished(this.currentPage, this.pageSize).subscribe({
      next: (response:  ReceiptPage) => {
        this. receipts = response. content.length > 0 ? response.content : this.mockReceipts;
        this.filteredReceipts = this.receipts;
        this.totalPages = response.totalPages;
        this. totalElements = response. totalElements;
        this.isLoading = false;
      },
      error:  () => {
        // En cas d'erreur, utiliser les mock data
        this.receipts = this.mockReceipts;
        this.filteredReceipts = this.mockReceipts;
        this.totalPages = 1;
        this.totalElements = this.mockReceipts.length;
        this.isLoading = false;
      }
    });
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.applyFilters();
  }

  onTypeChange(type:  ReceiptType | ''): void {
    this.selectedType = type;
    this.applyFilters();
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

    this.filteredReceipts = result;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedType = '';
    this.filteredReceipts = this.receipts;
  }

  loadPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this. loadReceipts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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