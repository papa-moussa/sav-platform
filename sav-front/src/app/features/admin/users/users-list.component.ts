import { Component, inject, signal, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { UserService } from '../../../core/services/user.service';
import { SiteService } from '../../../core/services/site.service';
import { User, UserRequest } from '../../../core/models/user.model';
import { Site } from '../../../core/models/site.model';
import { Role } from '../../../core/models/auth.model';
import { AppPaginationComponent } from '../../../shared/ui/pagination/app-pagination.component';
import { HlmBadgeDirective } from '@spartan-ng/ui-badge-helm';
import { HlmTableDirective, HlmTbodyDirective, HlmTrowDirective, HlmThDirective, HlmTdDirective } from '@spartan-ng/ui-table-helm';
import { HlmSelectDirective } from '@spartan-ng/ui-select-helm';
import { AppFilterBarComponent } from '../../../shared/ui/filter-bar/app-filter-bar.component';
import { AppInputComponent } from '../../../shared/ui/input/app-input.component';
import { AppButtonComponent } from '../../../shared/ui/button/app-button.component';
import { AppCardComponent } from '../../../shared/ui/card/app-card.component';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucidePlus, lucideShield, lucideX, lucideAlertTriangle, lucideUserCheck, lucideUserX } from '@ng-icons/lucide';
import { PhoneInputComponent } from '../../../shared/ui/phone-input/phone-input.component';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    HlmBadgeDirective, HlmTableDirective, HlmTbodyDirective, HlmTrowDirective, HlmThDirective, HlmTdDirective,
    HlmSelectDirective, AppFilterBarComponent, AppInputComponent, AppButtonComponent, AppCardComponent,
    NgIconComponent, AppPaginationComponent, PhoneInputComponent
  ],
  providers: [provideIcons({ lucidePlus, lucideShield, lucideX, lucideAlertTriangle, lucideUserCheck, lucideUserX })],
  templateUrl: './users-list.component.html',
})
export class UsersListComponent implements OnInit {
  private userService = inject(UserService);
  private siteService = inject(SiteService);
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();

  users = signal<User[]>([]);
  sites = signal<Site[]>([]);
  loading = signal(false);
  showDialog = signal(false);
  saving = signal(false);
  error = signal<string | null>(null);

  searchTerm = signal('');

  // Pagination
  currentPage = signal(0);
  pageSize = signal(20);
  totalElements = signal(0);
  totalPages = signal(0);

  readonly roles: Role[] = ['ADMIN', 'TECHNICIEN', 'RECEPTIONNISTE'];

  form = this.fb.group({
    nom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    role: ['RECEPTIONNISTE' as Role, Validators.required],
    siteId: [null as number | null],
    telephone: [''],
  });

  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.siteService.getAll().subscribe({ next: (data) => this.sites.set(data) });
    this.loadUsers();

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.currentPage.set(0);
      this.loadUsers();
    });
  }

  onSearchChange(term: string): void {
    this.searchTerm.set(term);
    this.searchSubject.next(term);
  }

  loadUsers(): void {
    this.loading.set(true);
    this.userService.getAll(this.searchTerm(), this.currentPage(), this.pageSize()).subscribe({
      next: (resp) => {
        this.users.set(resp.content);
        this.totalElements.set(resp.totalElements);
        this.totalPages.set(resp.totalPages);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    this.loadUsers();
  }

  openDialog(): void {
    this.form.reset({ role: 'RECEPTIONNISTE' });
    this.error.set(null);
    this.showDialog.set(true);
  }

  closeDialog(): void {
    this.showDialog.set(false);
  }

  saveUser(): void {
    if (this.form.invalid) { this.error.set('Tous les champs obligatoires doivent être remplis.'); return; }
    this.saving.set(true);
    const v = this.form.value;
    
    const { telephone } = v;

    const request: UserRequest = { 
      nom: v.nom!, 
      email: v.email!, 
      password: v.password!, 
      role: v.role as Role, 
      siteId: v.siteId ?? undefined,
      telephone: telephone ?? undefined
    };
    this.userService.create(request).subscribe({
      next: () => { this.saving.set(false); this.showDialog.set(false); this.loadUsers(); },
      error: (err) => { this.error.set(err.error?.message ?? 'Erreur lors de la création.'); this.saving.set(false); },
    });
  }

  toggleActif(user: User): void {
    this.userService.toggleActif(user.id).subscribe({
      next: (updated) => this.users.update((list) => list.map((u) => (u.id === updated.id ? updated : u))),
    });
  }

  roleBadgeClass(role: Role): string {
    const map: Record<Role, string> = {
      SUPER_ADMIN: 'bg-purple-100 text-purple-700',
      ADMIN: 'bg-purple-100 text-purple-700',
      TECHNICIEN: 'bg-blue-100 text-blue-700',
      RECEPTIONNISTE: 'bg-green-100 text-green-700',
    };
    return map[role] ?? 'bg-gray-100 text-gray-700';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
