import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { FeaturesComponent } from '../../components/features/features.component';
import { HowItWorksComponent } from '../../components/how-it-works/how-it-works.component';
import { AdvantagesComponent } from '../../components/advantages/advantages.component';
import { StatsComponent } from '../../components/stats/stats.component';
import { CtaComponent } from '../../components/cta/cta.component';
import { ContactComponent } from '../../components/contact/contact.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    HeroComponent,
    FeaturesComponent,
    HowItWorksComponent,
    AdvantagesComponent,
    StatsComponent,
    CtaComponent,
    ContactComponent,
    FooterComponent,
  ],
  template: `
    <app-header />
    <main>
      <app-hero />
      <app-features />
      <app-how-it-works />
      <app-advantages />
      <app-stats />
      <app-cta />
      <app-contact />
    </main>
    <app-footer />
  `,
})
export class HomeComponent {}
