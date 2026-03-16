import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { Receipt, ReceiptStatus, RECEIPT_TYPE_LABELS, RECEIPT_STATUS_LABELS, RECEIPT_STATUS_COLORS } from '../../../core/models/receipt.model';

const MOCK_RECEIPTS: Receipt[] = [
  { id: '1', title: 'Tisane relaxante',   type: 'HOT_DRINK',  status: 'PUBLISHED', isPremium: false, description: 'Infusion camomille et lavande pour une nuit paisible', author: { pseudo: 'Alice' } as any,  plants: [{ id:'1', title: 'Camomille' } as any], createdAt: '2024-02-01T00:00:00' },
  { id: '2', title: 'Smoothie détox',     type: 'COLD_DRINK', status: 'PUBLISHED', isPremium: true,  description: 'Boisson fraîche tonifiante au gingembre',              author: { pseudo: 'Bob' } as any,    plants: [{ id:'5', title: 'Gingembre' } as any], createdAt: '2024-02-10T00:00:00' },
  { id: '3', title: 'Baume apaisant',     type: 'LOTION',     status: 'PENDING',   isPremium: false, description: 'Lotion hydratante à l\'aloe vera',                    author: { pseudo: 'Carol' } as any,  plants: [{ id:'4', title: 'Aloe vera' } as any], createdAt: '2024-03-01T00:00:00' },
  { id: '4', title: 'Soupe médicinale',   type: 'DISH',       status: 'PUBLISHED', isPremium: true,  description: 'Soupe aux herbes médicinales',                        author: { pseudo: 'David' } as any,  plants: [{ id:'3', title: 'Menthe poivrée' } as any], createdAt: '2024-03-05T00:00:00' },
  { id: '5', title: 'Infusion immunité',  type: 'HOT_DRINK',  status: 'REJECTED',  isPremium: false, description: 'Thé à l\'échinacée pour renforcer les défenses',      author: { pseudo: 'Emma' } as any,   plants: [{ id:'6', title: 'Échinacée' } as any],  createdAt: '2024-03-10T00:00:00' }
];

@Component({
  selector: 'app-receipt-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LoaderComponent],
  templateUrl: './receipt-list.component.html',
  styleUrls: ['./receipt-list.component.scss']
})
export class ReceiptListComponent implements OnInit {
  allReceipts: Receipt[] = MOCK_RECEIPTS;
  receipts: Receipt[] = MOCK_RECEIPTS;
  isLoading = false;
  selectedStatus: ReceiptStatus | '' = '';

  totalElements = 0;

  receiptTypeLabels = RECEIPT_TYPE_LABELS;
  receiptStatusLabels = RECEIPT_STATUS_LABELS;
  receiptStatusColors = RECEIPT_STATUS_COLORS;
  statusKeys = Object.keys(RECEIPT_STATUS_LABELS) as ReceiptStatus[];

  ngOnInit(): void {
    setTimeout(() => {
      this.allReceipts = MOCK_RECEIPTS;
      this.applyFilter();
      this.isLoading = false;
    }, 300);
  }

  applyFilter(): void {
    this.receipts = this.selectedStatus
      ? this.allReceipts.filter(r => r.status === this.selectedStatus)
      : this.allReceipts;
    this.totalElements = this.receipts.length;
  }

  onStatusChange(): void {
    this.applyFilter();
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
    return new Date(dateString).toLocaleDateString('fr-FR');
  }
}
