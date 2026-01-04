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
        this. receipts = response. content;
        this.filteredReceipts = response.content;
        this.totalPages = response.totalPages;
        this. totalElements = response. totalElements;
        this.isLoading = false;
      },
      error:  () => {
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