import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { UserService } from '../../../core/services/user.service';
import { User, UpdateUserRequest } from '../../../core/models/user.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
})
export class UserEditComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private toastr = inject(ToastrService);

  user: User | null = null;
  userForm: FormGroup;
  isLoading = true;
  isSaving = false;

  constructor() {
    this.userForm = this.fb.group({
      pseudo: ['', [Validators.required, Validators.minLength(3)]],
      firstname: [''],
      lastname: [''],
      phone: [''],
      role: ['USER', [Validators.required]],
      status: ['ACTIVE', [Validators.required]],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.loadUser(id);
    }
  }

  loadUser(id: string): void {
    this.isLoading = true;
    this.userService.getById(id).subscribe({
      next: (user) => {
        this.user = user;
        this.userForm.patchValue({
          pseudo: user.pseudo,
          firstname: user.firstname || '',
          lastname: user.lastname || '',
          phone: user.phone || '',
          role: user.role,
          status: user.status,
        });
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.router.navigate(['/users']);
      },
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid || !this.user) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;

    const request: UpdateUserRequest = this.userForm.value;

    this.userService.update(this.user.id, request).subscribe({
      next: () => {
        this.isSaving = false;
        this.toastr.success('Utilisateur mis à jour', 'Succès');
        this.router.navigate(['/users']);
      },
      error: () => {
        this.isSaving = false;
      },
    });
  }
}
