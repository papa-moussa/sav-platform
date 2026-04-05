import { Component, inject, signal, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TicketService } from '../../core/services/ticket.service';
import { ClientService } from '../../core/services/client.service';
import { Ticket, TicketRequest, TypeAppareil, TYPE_APPAREIL_LABELS } from '../../core/models/ticket.model';
import { Site } from '../../core/models/site.model';
import { User } from '../../core/models/user.model';
import { Client } from '../../core/models/client.model';

import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { HlmTextareaDirective } from '@spartan-ng/ui-textarea-helm';
import { HlmSelectDirective } from '@spartan-ng/ui-select-helm';
import { HlmCheckboxDirective } from '@spartan-ng/ui-checkbox-helm';
import { AppDatePickerComponent } from '../../shared/ui/datepicker/app-datepicker.component';
import { AppInputComponent } from '../../shared/ui/input/app-input.component';
import { AppButtonComponent } from '../../shared/ui/button/app-button.component';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideX, lucideAlertCircle, lucideUserPlus, lucideSearch, lucidePhone, lucideTag, lucideHash, lucideUser } from '@ng-icons/lucide';

@Component({
  selector: 'app-ticket-create-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    HlmLabelDirective,
    HlmTextareaDirective, HlmSelectDirective, HlmCheckboxDirective,
    AppDatePickerComponent, AppInputComponent, AppButtonComponent,
    NgIconComponent
  ],
  providers: [provideIcons({ lucideX, lucideAlertCircle, lucideUserPlus, lucideSearch, lucidePhone, lucideTag, lucideHash, lucideUser })],
  templateUrl: './ticket-create-dialog.component.html',
})
export class TicketCreateDialogComponent implements OnInit {
  @Input() sites: Site[] = [];
  @Input() techniciens: User[] = [];
  @Output() created = new EventEmitter<Ticket>();
  @Output() closed = new EventEmitter<void>();

  private ticketService = inject(TicketService);
  private clientService = inject(ClientService);
  private fb = inject(FormBuilder);

  saving = signal(false);
  error = signal<string | null>(null);
  clientResults = signal<Client[]>([]);
  selectedClient = signal<Client | null>(null);
  clientMode = signal<'search' | 'create'>('search');
  clientSearchSubject = new Subject<string>();

  readonly typeAppareils: TypeAppareil[] = [
    'REFRIGERATEUR', 'LAVE_LINGE', 'LAVE_VAISSELLE', 'CLIMATISEUR',
    'CUISINIERE', 'CONGELATEUR', 'FOUR', 'AUTRE'
  ];
  readonly typeLabels = TYPE_APPAREIL_LABELS;

  form = this.fb.group({
    clientSearch: [''],
    newClientNom: [''],
    newClientTelephone: [''],
    siteId: [null as number | null, Validators.required],
    typeAppareil: [null as TypeAppareil | null, Validators.required],
    marqueModele: ['', Validators.required],
    numeroSerie: [''],
    descriptionPanne: ['', Validators.required],
    sousGarantie: [false],
    dateAchat: [''],
    technicienId: [null as number | null],
  });

  ngOnInit(): void {
    this.clientSearchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((search) => this.clientService.getAll(search)),
      map((page) => page.content)
    ).subscribe({ next: (clients) => this.clientResults.set(clients) });
  }

  onClientSearchInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    if (val.trim().length >= 2) {
      this.clientSearchSubject.next(val.trim());
    } else {
      this.clientResults.set([]);
    }
  }

  selectClient(client: Client): void {
    this.selectedClient.set(client);
    this.form.get('clientSearch')?.setValue(client.nom);
    this.clientResults.set([]);
  }

  clearClient(): void {
    this.selectedClient.set(null);
    this.form.get('clientSearch')?.setValue('');
    this.clientResults.set([]);
    this.clientMode.set('search');
  }

  setCreateMode(): void {
    this.clientMode.set('create');
    this.selectedClient.set(null);
    const searchVal = this.form.get('clientSearch')?.value;
    if (searchVal) {
      this.form.get('newClientNom')?.setValue(searchVal);
    }
  }

  submit(): void {
    if (this.clientMode() === 'search' && !this.selectedClient()) {
      this.error.set('Veuillez sélectionner un client.');
      return;
    }
    if (this.clientMode() === 'create') {
      const nom = this.form.get('newClientNom')?.value;
      const tel = this.form.get('newClientTelephone')?.value;
      if (!nom || !tel) {
        this.error.set('Veuillez renseigner le nom et le téléphone du nouveau client.');
        return;
      }
    }
    if (this.form.invalid) {
      this.error.set('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    this.saving.set(true);
    this.error.set(null);

    // If create mode, create client first
    if (this.clientMode() === 'create') {
      const nom = this.form.get('newClientNom')?.value;
      const tel = this.form.get('newClientTelephone')?.value;
      if (!nom || !tel) {
        this.error.set('Veuillez renseigner le nom et le téléphone du nouveau client.');
        return;
      }
      const clientReq = { nom, telephone: tel };
      this.clientService.create(clientReq).pipe(
        switchMap(client => {
          this.selectedClient.set(client);
          return this.createTicket(client.id);
        })
      ).subscribe({
        next: (t) => { this.saving.set(false); this.created.emit(t); },
        error: (err) => {
          this.error.set(err.error?.message ?? 'Erreur lors de la création du client.');
          this.saving.set(false);
        }
      });
    } else {
      this.createTicket(this.selectedClient()?.id ?? 0).subscribe({
        next: (t) => { this.saving.set(false); this.created.emit(t); },
        error: (err) => {
          this.error.set(err.error?.message ?? 'Erreur lors de la création du ticket.');
          this.saving.set(false);
        }
      });
    }
  }

  private createTicket(clientId: number) {
    const v = this.form.value;
    const request: TicketRequest = {
      clientId,
      siteId: v.siteId ?? 0,
      typeAppareil: v.typeAppareil ?? 'AUTRE',
      marqueModele: v.marqueModele ?? '',
      numeroSerie: v.numeroSerie || undefined,
      descriptionPanne: v.descriptionPanne ?? '',
      sousGarantie: v.sousGarantie ?? false,
      dateAchat: v.dateAchat || undefined,
      technicienId: v.technicienId ?? undefined,
    };
    return this.ticketService.create(request);
  }
}
