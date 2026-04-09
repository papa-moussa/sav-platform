import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ClientService } from '../../core/services/client.service';
import { Client, ClientRequest } from '../../core/models/client.model';
import { HlmTableDirective, HlmTheadDirective, HlmTbodyDirective, HlmTrowDirective, HlmThDirective, HlmTdDirective } from '@spartan-ng/ui-table-helm';
import { AppFilterBarComponent } from '../../shared/ui/filter-bar/app-filter-bar.component';
import { AppInputComponent } from '../../shared/ui/input/app-input.component';
import { AppButtonComponent } from '../../shared/ui/button/app-button.component';
import { AppCardComponent } from '../../shared/ui/card/app-card.component';
import { AppPaginationComponent } from '../../shared/ui/pagination/app-pagination.component';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucidePlus, lucideUserPlus, lucideX, lucideUsers, lucideAlertTriangle } from '@ng-icons/lucide';
import { PhoneInputComponent } from '../../shared/ui/phone-input/phone-input.component';

@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    HlmTableDirective, HlmTheadDirective, HlmTbodyDirective, HlmTrowDirective, HlmThDirective, HlmTdDirective,
    AppFilterBarComponent, AppInputComponent, AppButtonComponent, AppCardComponent,
    AppPaginationComponent, NgIconComponent, PhoneInputComponent
  ],
  providers: [provideIcons({ lucidePlus, lucideUserPlus, lucideX, lucideUsers, lucideAlertTriangle })],
  templateUrl: './clients-list.component.html',
})
export class ClientsListComponent implements OnInit {
  private clientService = inject(ClientService);
  private fb = inject(FormBuilder);

  clients = signal<Client[]>([]);
  loading = signal(false);
  showDialog = signal(false);
  saving = signal(false);
  error = signal<string | null>(null);

  // Pagination
  currentPage = signal(0);
  pageSize = signal(20);
  totalElements = signal(0);
  totalPages = signal(0);

  searchControl = this.fb.control('');

  newClientForm = this.fb.group({
    nom: [''],
    telephone: [''],
    email: [''],
    adresse: [''],
  });

  ngOnInit(): void {
    this.loadClients();
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        this.currentPage.set(0);
        this.loadClients(value ?? '');
      });
  }

  loadClients(search = ''): void {
    this.loading.set(true);
    this.clientService.getAll(search, this.currentPage(), this.pageSize()).subscribe({
      next: (data) => {
        this.clients.set(data.content);
        this.totalElements.set(data.totalElements);
        this.totalPages.set(data.totalPages);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    this.loadClients(this.searchControl.value ?? '');
  }

  openDialog(): void {
    this.newClientForm.reset();
    this.error.set(null);
    this.showDialog.set(true);
  }

  closeDialog(): void {
    this.showDialog.set(false);
  }

  saveClient(): void {
    const { nom, telephone, email, adresse } = this.newClientForm.value;
    if (!nom?.trim() || !telephone) {
      this.error.set('Nom et téléphone sont obligatoires.');
      return;
    }
    
    this.saving.set(true);
    const request: ClientRequest = { 
      nom: nom!, 
      telephone: telephone!, 
      email: email ?? undefined, 
      adresse: adresse ?? undefined 
    };
    this.clientService.create(request).subscribe({
      next: () => {
        this.saving.set(false);
        this.showDialog.set(false);
        this.currentPage.set(0);
        this.loadClients(this.searchControl.value ?? '');
      },
      error: () => { this.error.set('Erreur lors de la création.'); this.saving.set(false); },
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }

  isRecent(date: string): boolean {
    const days = (Date.now() - new Date(date).getTime()) / 86400000;
    return days <= 7;
  }
}
