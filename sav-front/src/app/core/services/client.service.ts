import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client, ClientRequest } from '../models/client.model';
import { PageResponse } from '../models/page.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/clients`;

  getAll(search?: string, page = 0, size = 20): Observable<PageResponse<Client>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);
    if (search?.trim()) {
      params = params.set('search', search.trim());
    }
    return this.http.get<PageResponse<Client>>(this.base, { params });
  }

  getById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.base}/${id}`);
  }

  create(request: ClientRequest): Observable<Client> {
    return this.http.post<Client>(this.base, request);
  }

  update(id: number, request: ClientRequest): Observable<Client> {
    return this.http.put<Client>(`${this.base}/${id}`, request);
  }
}
