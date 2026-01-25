import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Receipt, ReceiptPage, ReceiptStatus, RECEIPT_TYPE_LABELS, RECEIPT_STATUS_LABELS, RECEIPT_STATUS_COLORS } from '../../../core/models/receipt.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-receipt-list',
  standalone: true,
  imports:  [CommonModule, RouterModule, FormsModule, LoaderComponent],
  templateUrl:  './receipt-list.component.html',
  styleUrls:  ['./receipt-list.component.scss']
})
export class ReceiptListComponent implements OnInit {
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  private apiUrl = `${environment.apiUrl}/admin/receipts`;

  receipts: Receipt[] = [];
  isLoading = true;
  selectedStatus: ReceiptStatus | '' = '';

  currentPage = 0;
  totalPages = 0;
  totalElements = 0;
  pageSize = 20;

  receiptTypeLabels = RECEIPT_TYPE_LABELS;
  receiptStatusLabels = RECEIPT_STATUS_LABELS;
  receiptStatusColors = RECEIPT_STATUS_COLORS;
  statusKeys = Object.keys(RECEIPT_STATUS_LABELS) as ReceiptStatus[];

  ngOnInit(): void {
    this.loadReceipts();
  }

  loadReceipts(): void {
    this.isLoading = true;

    let params = new HttpParams()
      .set('page', this.currentPage.toString())
      .set('size', this.pageSize.toString());

    if (this.selectedStatus) {
      params = params.set('status', this.selectedStatus);
    }

    this.http.get<ReceiptPage>(this.apiUrl, { params }).subscribe({
      next: (response) => {
        this.receipts = response.content;
        this.totalPages = response.totalPages;
        this. totalElements = response. totalElements;
        this.isLoading = false;
      },
      error:  () => {
        this.isLoading = false;
      }
    });
  }

  onStatusChange(): void {
    this.currentPage = 0;
    this.loadReceipts();
  }

  loadPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this. loadReceipts();
    }
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

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }
}