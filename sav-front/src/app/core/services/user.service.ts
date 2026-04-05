import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserRequest } from '../models/user.model';
import { PageResponse } from '../models/page.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/users`;

  getAll(search = '', page = 0, size = 20): Observable<PageResponse<User>> {
    const params = new HttpParams()
      .set('search', search)
      .set('page', page)
      .set('size', size);
    return this.http.get<PageResponse<User>>(this.base, { params });
  }

  create(request: UserRequest): Observable<User> {
    return this.http.post<User>(this.base, request);
  }

  toggleActif(id: number): Observable<User> {
    return this.http.patch<User>(`${this.base}/${id}/actif`, {});
  }
}
