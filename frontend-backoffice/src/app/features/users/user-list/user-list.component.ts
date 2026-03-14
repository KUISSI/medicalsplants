import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { UserService } from '../../../core/services/user.service';
import { User, UserPage } from '../../../core/models/user.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ConfirmDialogComponent, SlideOverComponent],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
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
