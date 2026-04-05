import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminUser } from '../models/admin-user.model';
import { PageResponse } from '../models/page.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminUserService {
  private readonly http = inject(HttpClient);

  getAll(search = '', companyId?: number, page = 0, size = 20): Observable<PageResponse<AdminUser>> {
    let params = new HttpParams()
      .set('search', search)
      .set('page', page)
      .set('size', size);
    if (companyId) params = params.set('companyId', companyId);
    return this.http.get<PageResponse<AdminUser>>(`${environment.apiUrl}/admin/users`, { params });
  }

  toggleActif(id: number): Observable<AdminUser> {
    return this.http.patch<AdminUser>(`${environment.apiUrl}/admin/users/${id}/actif`, {});
  }

  resetPassword(id: number): Observable<AdminUser> {
    return this.http.post<AdminUser>(`${environment.apiUrl}/admin/users/${id}/reset-password`, {});
  }
}
