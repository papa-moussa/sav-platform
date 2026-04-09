import { Component, inject } from '@angular/core';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonBadge,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  constructOutline,
  cubeOutline,
  personOutline,
  homeOutline
} from 'ionicons/icons';
import { SyncService } from '../../core/services/sync.service';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge],
  templateUrl: './tabs.page.html',
})
export class TabsPage {
  syncService = inject(SyncService);

  constructor() {
    addIcons({ constructOutline, cubeOutline, personOutline, homeOutline });
  }
}
