import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { SlideOverComponent } from '../../../shared/components/slide-over/slide-over.component';
import { User } from '../../../core/models/user.model';

const MOCK_USERS: User[] = [
  { id: '1', email: 'alice@example.com', pseudo: 'Alice', firstname: 'Alice', lastname: 'Martin',   role: 'ADMIN',   status: 'ACTIVE',   isActive: true,  isEmailVerified: true,  lastLoginAt: '2024-03-01T10:00:00', createdAt: '2024-01-01T00:00:00' },
  { id: '2', email: 'bob@example.com',   pseudo: 'Bob',   firstname: 'Bob',   lastname: 'Dupont',   role: 'PREMIUM', status: 'ACTIVE',   isActive: true,  isEmailVerified: true,  lastLoginAt: '2024-02-28T14:00:00', createdAt: '2024-01-15T00:00:00' },
  { id: '3', email: 'carol@example.com', pseudo: 'Carol', firstname: 'Carol', lastname: 'Leblanc',  role: 'USER',    status: 'ACTIVE',   isActive: true,  isEmailVerified: false, lastLoginAt: '2024-02-20T09:00:00', createdAt: '2024-02-01T00:00:00' },
  { id: '4', email: 'david@example.com', pseudo: 'David', firstname: 'David', lastname: 'Bernard',  role: 'USER',    status: 'INACTIVE', isActive: false, isEmailVerified: true,  lastLoginAt: '2024-01-10T16:00:00', createdAt: '2024-01-20T00:00:00' },
  { id: '5', email: 'emma@example.com',  pseudo: 'Emma',  firstname: 'Emma',  lastname: 'Rousseau', role: 'USER',    status: 'BLOCKED',  isActive: false, isEmailVerified: false, lastLoginAt: '2023-12-15T11:00:00', createdAt: '2023-12-01T00:00:00' },
  { id: '6', email: 'felix@example.com', pseudo: 'Felix', firstname: 'Felix', lastname: 'Moreau',   role: 'PREMIUM', status: 'ACTIVE',   isActive: true,  isEmailVerified: true,  lastLoginAt: '2024-03-05T08:00:00', createdAt: '2024-02-10T00:00:00' }
];

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ConfirmDialogComponent, SlideOverComponent],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {
  private fb = inject(FormBuilder);

  /* ---- data ---- */
  private allUsers: User[] = [...MOCK_USERS];
  users: User[] = [...MOCK_USERS];
  searchTerm = '';

  /* ---- slide-over ---- */
  slideOverOpen = false;
  editingUser: User | null = null;

  form: FormGroup = this.fb.group({
    pseudo:    ['', [Validators.required, Validators.minLength(3)]],
    firstname: [''],
    lastname:  [''],
    role:      ['USER', Validators.required],
    status:    ['ACTIVE', Validators.required]
  });

  /* ---- delete dialog ---- */
  showDeleteDialog = false;
  deletingUser: User | null = null;

  get f() { return this.form.controls; }

  openEdit(user: User): void {
    this.editingUser = user;
    this.form.patchValue({
      pseudo:    user.pseudo,
      firstname: user.firstname || '',
      lastname:  user.lastname  || '',
      role:      user.role,
      status:    user.status
    });
    this.slideOverOpen = true;
  }

  closeSlideOver(): void {
    this.slideOverOpen = false;
    this.editingUser = null;
    this.form.reset();
  }

  save(): void {
    if (this.form.invalid || !this.editingUser) { this.form.markAllAsTouched(); return; }
    const values = this.form.value;
    this.allUsers = this.allUsers.map(u =>
      u.id === this.editingUser!.id ? { ...u, ...values, isActive: values.status === 'ACTIVE' } : u
    );
    this.applySearch();
    this.closeSlideOver();
  }

  applySearch(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.users = term
      ? this.allUsers.filter(u => u.email.toLowerCase().includes(term) || u.pseudo.toLowerCase().includes(term))
      : [...this.allUsers];
  }

  onSearch(): void { this.applySearch(); }

  confirmDelete(user: User): void {
    this.deletingUser = user;
    this.showDeleteDialog = true;
  }

  onDeleteConfirm(): void {
    if (this.deletingUser) {
      this.allUsers = this.allUsers.filter(u => u.id !== this.deletingUser!.id);
      this.applySearch();
    }
    this.showDeleteDialog = false;
    this.deletingUser = null;
  }

  onDeleteCancel(): void {
    this.showDeleteDialog = false;
    this.deletingUser = null;
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'ADMIN':   return 'badge--admin';
      case 'PREMIUM': return 'badge--premium';
      default:        return 'badge--user';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'ACTIVE':   return 'badge--success';
      case 'INACTIVE': return 'badge--warning';
      case 'BLOCKED':  return 'badge--danger';
      default:         return '';
    }
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
