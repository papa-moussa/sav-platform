import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  importProvidersFrom,
  LOCALE_ID,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { appRoutes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { jwtInterceptor } from './core/auth/jwt.interceptor';
import { DialogModule } from '@angular/cdk/dialog';
import { provideBrnCalendarI18n } from '@spartan-ng/brain/calendar';
import { provideNativeDateAdapter } from '@spartan-ng/brain/date-time';
import { provideAnimations } from '@angular/platform-browser/animations';
import type { BrnCalendarI18n } from '@spartan-ng/brain/calendar';

registerLocaleData(localeFr);

const FR_MONTHS: [string, string, string, string, string, string, string, string, string, string, string, string] = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

const FR_WEEKDAYS_SHORT = ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'];
const FR_WEEKDAYS_LONG = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

const frCalendarI18n: BrnCalendarI18n = {
  formatWeekdayName: (index: number) => FR_WEEKDAYS_SHORT[index],
  formatHeader: (month: number, year: number) => `${FR_MONTHS[month]} ${year}`,
  formatYear: (year: number) => `${year}`,
  formatMonth: (month: number) => FR_MONTHS[month],
  labelPrevious: () => 'Mois précédent',
  labelNext: () => 'Mois suivant',
  labelWeekday: (index: number) => FR_WEEKDAYS_LONG[index],
  months: () => FR_MONTHS,
  years: (startYear?: number, endYear?: number) => {
    const start = startYear ?? new Date().getFullYear() - 100;
    const end = endYear ?? new Date().getFullYear() + 10;
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  },
  firstDayOfWeek: () => 1, // Lundi
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()),
    provideAnimations(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([jwtInterceptor]), withFetch()),
    importProvidersFrom(DialogModule),
    provideBrnCalendarI18n(frCalendarI18n),
    provideNativeDateAdapter(),
    { provide: LOCALE_ID, useValue: 'fr-FR' },
  ],
};
