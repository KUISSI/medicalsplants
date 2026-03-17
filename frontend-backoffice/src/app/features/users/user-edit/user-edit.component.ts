import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';

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
  private userService = inject(UserService);

  user: User | null = null;
  userForm: FormGroup;
  isLoading = false;
  isSaving = false;
  error = '';

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
    if (!id) {
      this.router.navigate(['/users']);
      return;
    }
    this.isLoading = true;
    this.userService.getById(id).subscribe({
      next: (user) => {
        this.user = user;
        this.userForm.patchValue({
          pseudo:    user.pseudo,
          firstname: user.firstname || '',
          lastname:  user.lastname  || '',
          phone:     user.phone     || '',
          role:      user.role,
          status:    user.status
        });
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.router.navigate(['/users']);
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid || !this.user) {
      this.userForm.markAllAsTouched();
      return;
    }
    this.isSaving = true;
    this.error = '';
    this.userService.update(this.user.id, this.userForm.value).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/users']);
      },
      error: () => {
        this.isSaving = false;
        this.error = 'Erreur lors de la sauvegarde.';
      }
    });
  }
}