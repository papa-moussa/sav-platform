import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company, CompanyRequest } from '../models/company.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CompanyService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/admin/companies`;

  getAll(): Observable<Company[]> {
    return this.http.get<Company[]>(this.baseUrl);
  }

  create(req: CompanyRequest): Observable<Company> {
    return this.http.post<Company>(this.baseUrl, req);
  }

  update(id: number, req: CompanyRequest): Observable<Company> {
    return this.http.put<Company>(`${this.baseUrl}/${id}`, req);
  }

  toggleStatus(id: number): Observable<Company> {
    return this.http.patch<Company>(`${this.baseUrl}/${id}/status`, {});
  }
}
