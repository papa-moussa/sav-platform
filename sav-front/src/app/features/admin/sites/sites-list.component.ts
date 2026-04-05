import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SiteService } from '../../../core/services/site.service';
import { Site } from '../../../core/models/site.model';
import { AppFilterBarComponent } from '../../../shared/ui/filter-bar/app-filter-bar.component';
import { AppCardComponent } from '../../../shared/ui/card/app-card.component';
import { AppButtonComponent } from '../../../shared/ui/button/app-button.component';
import { AppInputComponent } from '../../../shared/ui/input/app-input.component';
import { HlmTableDirective, HlmTbodyDirective, HlmTrowDirective, HlmThDirective, HlmTdDirective } from '@spartan-ng/ui-table-helm';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideMapPin, lucideBuilding, lucideChevronRight, lucidePlus, lucideX } from '@ng-icons/lucide';

@Component({
  selector: 'app-sites-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppFilterBarComponent,
    AppCardComponent,
    AppButtonComponent,
    AppInputComponent,
    HlmTableDirective, HlmTbodyDirective, HlmTrowDirective, HlmThDirective, HlmTdDirective,
    NgIconComponent
  ],
  providers: [provideIcons({ lucideMapPin, lucideBuilding, lucideChevronRight, lucidePlus, lucideX })],
  templateUrl: './sites-list.component.html',
})
export class SitesListComponent implements OnInit {
  private siteService = inject(SiteService);
  private fb = inject(FormBuilder);

  sites = signal<Site[]>([]);
  loading = signal(false);
  searchTerm = signal('');
  
  showDialog = signal(false);
  saving = signal(false);
  
  form = this.fb.group({
    nom: ['', [Validators.required]],
    adresse: ['']
  });

  filteredSites = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.sites();
    return this.sites().filter(s =>
      s.nom.toLowerCase().includes(term) ||
      (s.adresse && s.adresse.toLowerCase().includes(term))
    );
  });

  ngOnInit(): void {
    this.loadSites();
  }

  loadSites(): void {
    this.loading.set(true);
    this.siteService.getAll().subscribe({
      next: (data) => {
        this.sites.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  openDialog(): void {
    this.form.reset();
    this.showDialog.set(true);
  }

  closeDialog(): void {
    this.showDialog.set(false);
  }

  saveSite(): void {
    if (this.form.valid) {
      this.saving.set(true);
      const request = {
        nom: this.form.value.nom ?? '',
        adresse: this.form.value.adresse ?? ''
      };

      this.siteService.create(request).subscribe({
        next: () => {
          this.loadSites();
          this.closeDialog();
          this.saving.set(false);
        },
        error: () => this.saving.set(false)
      });
    }
  }
}
