import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
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
  selector: 'app-user-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  user: User | null = null;
  userForm: FormGroup;
  isLoading = false;
  isSaving = false;

  constructor() {
    this.userForm = this.fb.group({
      pseudo:    ['', [Validators.required, Validators.minLength(3)]],
      firstname: [''],
      lastname:  [''],
      phone:     [''],
      role:      ['USER', [Validators.required]],
      status:    ['ACTIVE', [Validators.required]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      const user = MOCK_USERS.find(u => u.id === id);
      if (user) {
        this.user = user;
        this.userForm.patchValue({
          pseudo:    user.pseudo,
          firstname: user.firstname || '',
          lastname:  user.lastname  || '',
          phone:     (user as any).phone || '',
          role:      user.role,
          status:    user.status
        });
      } else {
        this.router.navigate(['/users']);
      }
    }
    this.isLoading = false;
  }

  onSubmit(): void {
    if (this.userForm.invalid || !this.user) {
      this.userForm.markAllAsTouched();
      return;
    }
    this.isSaving = true;
    setTimeout(() => {
      this.isSaving = false;
      this.router.navigate(['/users']);
    }, 500);
  }
}
