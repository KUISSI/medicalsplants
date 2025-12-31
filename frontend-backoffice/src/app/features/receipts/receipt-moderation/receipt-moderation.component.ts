import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Receipt, ReceiptPage, RECEIPT_TYPE_LABELS } from '../../../core/models/receipt.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-receipt-moderation',
  standalone:  true,
  imports: [CommonModule, RouterModule, LoaderComponent, ConfirmDialogComponent],
  templateUrl: './receipt-moderation. component.html',
  styleUrls:  ['./receipt-moderation.component.scss']
})
export class ReceiptModerationComponent implements OnInit {
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  private apiUrl = `${environment.apiUrl}/admin/receipts`;

  pendingReceipts:  Receipt[] = [];
  isLoading = true;

  receiptTypeLabels = RECEIPT_TYPE_LABELS;

  // Dialogs
  showApproveDialog = false;
  showRejectDialog = false;
  selectedReceipt: Receipt | null = null;

  ngOnInit(): void {
    this.loadPendingReceipts();
  }

  loadPendingReceipts(): void {
    this. isLoading = true;

    const params = new HttpParams()
      .set('status', 'PENDING')
      .set('page', '0')
      .set('size', '50');

    this.http.get<ReceiptPage>(this.apiUrl, { params }).subscribe({
      next: (response) => {
        this.pendingReceipts = response. content;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  openApproveDialog(receipt: Receipt): void {
    this. selectedReceipt = receipt;
    this.showApproveDialog = true;
  }

  openRejectDialog(receipt: Receipt): void {
    this. selectedReceipt = receipt;
    this.showRejectDialog = true;
  }

  onApproveConfirm(): void {
    if (this.selectedReceipt) {
      this.http.patch(`${this.apiUrl}/${this.selectedReceipt.id}/approve`, null).subscribe({
        next: () => {
          this.pendingReceipts = this.pendingReceipts.filter(r => r.id !== this.selectedReceipt?. id);
          this.toastr.success('Recette approuvée et publiée', 'Succès');
          this.closeDialogs();
        },
        error: () => {
          this.toastr. error('Erreur lors de l\'approbation', 'Erreur');
        }
      });
    }
  }

  onRejectConfirm(): void {
    if (this. selectedReceipt) {
      this. http.patch(`${this.apiUrl}/${this.selectedReceipt.id}/reject`, null).subscribe({
        next:  () => {
          this.pendingReceipts = this. pendingReceipts.filter(r => r.id !== this.selectedReceipt?.id);
          this.toastr.success('Recette rejetée', 'Succès');
          this.closeDialogs();
        },
        error: () => {
          this.toastr.error('Erreur lors du rejet', 'Erreur');
        }
      });
    }
  }

  closeDialogs(): void {
    this.showApproveDialog = false;
    this.showRejectDialog = false;
    this. selectedReceipt = null;
  }

  getReceiptTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      'HOT_DRINK': '☕',
      'COLD_DRINK': '🧊',
      'DISH': '🍽️',
      'LOTION':  '🧴'
    };
    return icons[type] || '📖';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year:  'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}