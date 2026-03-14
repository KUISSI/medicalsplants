import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { SlideOverComponent } from '../../../shared/components/slide-over/slide-over.component';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ConfirmDialogComponent, SlideOverComponent],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);

  /* ---- data ---- */
  users: User[] = [];
  isLoading = false;
  searchTerm = '';
  private searchTimeout: any;

  /* ---- slide-over ---- */
  slideOverOpen = false;
  editingUser: User | null = null;
  isSaving = false;

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

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(search?: string): void {
    this.isLoading = true;
    this.userService.getAll(0, 50, search).subscribe({
      next: page => {
        this.users = page.content;
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

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
    const { role, status } = this.form.value;
    const id = this.editingUser.id;
    this.isSaving = true;

    const roleChanged = role !== this.editingUser.role;
    const statusChanged = status !== this.editingUser.status;

    if (roleChanged) {
      this.userService.updateRole(id, role).subscribe({
        next: updated => {
          this.users = this.users.map(u => u.id === id ? { ...u, ...updated } : u);
        }
      });
    }
    if (statusChanged) {
      this.userService.updateStatus(id, status).subscribe({
        next: updated => {
          this.users = this.users.map(u => u.id === id ? { ...u, ...updated } : u);
        }
      });
    }
    this.isSaving = false;
    this.closeSlideOver();
  }

  onSearch(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.loadUsers(this.searchTerm || undefined);
    }, 400);
  }

  confirmDelete(user: User): void {
    this.deletingUser = user;
    this.showDeleteDialog = true;
  }

  onDeleteConfirm(): void {
    if (!this.deletingUser) return;
    const id = this.deletingUser.id;
    this.userService.delete(id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== id);
      }
    });
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
