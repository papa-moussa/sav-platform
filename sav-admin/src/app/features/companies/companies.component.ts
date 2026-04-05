import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucidePlus,
  lucideSearch,
  lucidePencil,
  lucideToggleLeft,
  lucideToggleRight,
  lucideX,
  lucideBuilding2,
  lucideCircleAlert,
  lucideRefreshCw,
  lucideLoader,
  lucideCheck,
  lucideTriangleAlert
} from '@ng-icons/lucide';
import { CompanyService } from '../../core/services/company.service';
import { Company, CompanyRequest } from '../../core/models/company.model';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIconComponent],
  viewProviders: [provideIcons({
    lucidePlus,
    lucideSearch,
    lucidePencil,
    lucideToggleLeft,
    lucideToggleRight,
    lucideX,
    lucideBuilding2,
    lucideCircleAlert,
    lucideRefreshCw,
    lucideLoader,
    lucideCheck,
    lucideTriangleAlert
  })],
  templateUrl: './companies.component.html'
})
export class CompaniesComponent implements OnInit {
  private readonly companyService = inject(CompanyService);
  private readonly fb = inject(FormBuilder);

  readonly companies = signal<Company[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly searchQuery = signal('');

  // Modal state
  readonly showModal = signal(false);
  readonly editingCompany = signal<Company | null>(null);
  readonly modalLoading = signal(false);
  readonly modalError = signal<string | null>(null);

  // Toggle confirm modal
  readonly confirmCompany = signal<Company | null>(null);
  readonly toggleLoading = signal(false);

  readonly filteredCompanies = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.companies();
    return this.companies().filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  });

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    address: ['']
  });

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.loading.set(true);
    this.error.set(null);
    this.companyService.getAll().subscribe({
      next: (data) => {
        this.companies.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger les entreprises.');
        this.loading.set(false);
      }
    });
  }

  openCreate(): void {
    this.editingCompany.set(null);
    this.form.reset();
    this.modalError.set(null);
    this.showModal.set(true);
  }

  openEdit(company: Company): void {
    this.editingCompany.set(company);
    this.form.patchValue({
      name: company.name,
      slug: company.slug,
      email: company.email,
      phone: company.phone ?? '',
      address: company.address ?? ''
    });
    this.modalError.set(null);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingCompany.set(null);
    this.form.reset();
    this.modalError.set(null);
  }

  submitForm(): void {
    if (this.form.invalid || this.modalLoading()) return;

    const { name, slug, email, phone, address } = this.form.value;
    const req: CompanyRequest = {
      name: name!,
      slug: slug!,
      email: email!,
      ...(phone ? { phone } : {}),
      ...(address ? { address } : {})
    };

    this.modalLoading.set(true);
    this.modalError.set(null);

    const editing = this.editingCompany();
    const op$ = editing
      ? this.companyService.update(editing.id, req)
      : this.companyService.create(req);

    op$.subscribe({
      next: (company) => {
        if (editing) {
          this.companies.update(list => list.map(c => c.id === company.id ? company : c));
        } else {
          this.companies.update(list => [...list, company]);
        }
        this.modalLoading.set(false);
        this.closeModal();
      },
      error: (err) => {
        this.modalLoading.set(false);
        if (err.status === 409) {
          this.modalError.set('Ce slug ou cet email est déjà utilisé.');
        } else if (err.status === 400) {
          this.modalError.set('Données invalides. Vérifiez les champs.');
        } else {
          this.modalError.set('Une erreur est survenue. Veuillez réessayer.');
        }
      }
    });
  }

  openToggleConfirm(company: Company): void {
    this.confirmCompany.set(company);
  }

  closeToggleConfirm(): void {
    this.confirmCompany.set(null);
  }

  confirmToggle(): void {
    const company = this.confirmCompany();
    if (!company || this.toggleLoading()) return;

    this.toggleLoading.set(true);
    this.companyService.toggleStatus(company.id).subscribe({
      next: (updated) => {
        this.companies.update(list => list.map(c => c.id === updated.id ? updated : c));
        this.toggleLoading.set(false);
        this.confirmCompany.set(null);
      },
      error: () => {
        this.toggleLoading.set(false);
        this.confirmCompany.set(null);
      }
    });
  }

  onSearchInput(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  generateSlug(name: string): void {
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    this.form.patchValue({ slug });
  }

  onNameChange(event: Event): void {
    const name = (event.target as HTMLInputElement).value;
    if (!this.editingCompany()) {
      this.generateSlug(name);
    }
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  }

  fieldInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }
}
