import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { Receipt, RECEIPT_TYPE_LABELS } from '../../../core/models/receipt.model';

const MOCK_PENDING: Receipt[] = [
  { id: '3', title: 'Baume apaisant',        type: 'LOTION',    status: 'PENDING', isPremium: false, description: 'Lotion hydratante à l\'aloe vera pour peaux sensibles', author: { pseudo: 'Carol' } as any, plants: [{ id:'4', title: 'Aloe vera' } as any],     createdAt: '2024-03-01T10:00:00' },
  { id: '7', title: 'Sirop antitussif',       type: 'HOT_DRINK', status: 'PENDING', isPremium: false, description: 'Sirop naturel contre la toux à base de thym',           author: { pseudo: 'Felix' } as any, plants: [{ id:'2', title: 'Lavande' } as any],       createdAt: '2024-03-08T14:30:00' },
  { id: '8', title: 'Masque purifiant',       type: 'LOTION',    status: 'PENDING', isPremium: true,  description: 'Masque à l\'argile et plantes médicinales',             author: { pseudo: 'Bob' } as any,   plants: [{ id:'3', title: 'Menthe poivrée' } as any], createdAt: '2024-03-09T09:15:00' }
];

@Component({
  selector: 'app-receipt-moderation',
  standalone: true,
  imports: [CommonModule, RouterModule, LoaderComponent, ConfirmDialogComponent],
  templateUrl: './receipt-moderation.component.html',
  styleUrls: ['./receipt-moderation.component.scss']
})
export class ReceiptModerationComponent implements OnInit {
  pendingReceipts: Receipt[] = MOCK_PENDING;
  isLoading = false;

  receiptTypeLabels = RECEIPT_TYPE_LABELS;

  showApproveDialog = false;
  showRejectDialog = false;
  selectedReceipt: Receipt | null = null;

  ngOnInit(): void {
    setTimeout(() => {
      this.pendingReceipts = MOCK_PENDING;
      this.isLoading = false;
    }, 300);
  }

  openApproveDialog(receipt: Receipt): void {
    this.selectedReceipt = receipt;
    this.showApproveDialog = true;
  }

  openRejectDialog(receipt: Receipt): void {
    this.selectedReceipt = receipt;
    this.showRejectDialog = true;
  }

  onApproveConfirm(): void {
    if (this.selectedReceipt) {
      this.pendingReceipts = this.pendingReceipts.filter(r => r.id !== this.selectedReceipt?.id);
      this.closeDialogs();
    }
  }

  onRejectConfirm(): void {
    if (this.selectedReceipt) {
      this.pendingReceipts = this.pendingReceipts.filter(r => r.id !== this.selectedReceipt?.id);
      this.closeDialogs();
    }
  }

  closeDialogs(): void {
    this.showApproveDialog = false;
    this.showRejectDialog = false;
    this.selectedReceipt = null;
  }

  getReceiptTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      'HOT_DRINK':  'bi-cup-hot',
      'COLD_DRINK': 'bi-cup-straw',
      'DISH':       'bi-egg-fried',
      'LOTION':     'bi-droplet-half'
    };
    return icons[type] || 'bi-book';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  }
}
