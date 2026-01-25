import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { UserService } from '../../../core/services/user.service';
import { User, UserPage } from '../../../core/models/user.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports:  [
    CommonModule,
    RouterModule,
    FormsModule,
    LoaderComponent,
    ConfirmDialogComponent
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  private toastr = inject(ToastrService);

  users: User[] = [];
  isLoading = true;
  searchTerm = '';

  // Pagination
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;
  pageSize = 20;

  // Delete confirmation
  showDeleteDialog = false;
  userToDelete: User | null = null;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAll(this.currentPage, this.pageSize, this.searchTerm).subscribe({
      next: (response:  UserPage) => {
        this.users = response.content;
        this. totalPages = response.totalPages;
        this. totalElements = response. totalElements;
        this.isLoading = false;
      },
      error:  () => {
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadUsers();
  }

  loadPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this. loadUsers();
    }
  }

  updateRole(user: User, role: 'USER' | 'PREMIUM' | 'ADMIN'): void {
    this.userService.updateRole(user. id, role).subscribe({
      next:  (updatedUser) => {
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        this.toastr.success(`Rôle mis à jour :  ${role}`, 'Succès');
      }
    });
  }

  updateStatus(user: User, status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED'): void {
    this.userService.updateStatus(user.id, status).subscribe({
      next: (updatedUser) => {
        const index = this. users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        this. toastr.success(`Statut mis à jour : ${status}`, 'Succès');
      }
    });
  }

  confirmDelete(user: User): void {
    this.userToDelete = user;
    this.showDeleteDialog = true;
  }

  onDeleteConfirm(): void {
    if (this.userToDelete) {
      this.userService.delete(this.userToDelete.id).subscribe({
        next:  () => {
          this.users = this.users. filter(u => u.id !== this. userToDelete?. id);
          this.toastr. success('Utilisateur supprimé', 'Succès');
          this.showDeleteDialog = false;
          this.userToDelete = null;
        }
      });
    }
  }

  onDeleteCancel(): void {
    this.showDeleteDialog = false;
    this.userToDelete = null;
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'ADMIN':  return 'badge--admin';
      case 'PREMIUM': return 'badge--premium';
      default: return 'badge--user';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'badge--success';
      case 'INACTIVE': return 'badge--warning';
      case 'BLOCKED': return 'badge--danger';
      default:  return '';
    }
  }

  formatDate(dateString:  string): string {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }
}