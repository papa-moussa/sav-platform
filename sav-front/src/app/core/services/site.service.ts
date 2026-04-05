import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Site, SiteRequest } from '../models/site.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SiteService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/sites`;

  getAll(): Observable<Site[]> {
    return this.http.get<Site[]>(this.base);
  }

  create(request: SiteRequest): Observable<Site> {
    return this.http.post<Site>(this.base, request);
  }
}
