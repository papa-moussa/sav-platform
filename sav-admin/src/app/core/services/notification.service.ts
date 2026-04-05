import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notification, NotificationRequest } from '../models/notification.model';
import { PageResponse } from '../models/page.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly http = inject(HttpClient);

  getAll(page = 0, size = 20): Observable<PageResponse<Notification>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResponse<Notification>>(`${environment.apiUrl}/admin/notifications`, { params });
  }

  create(req: NotificationRequest): Observable<Notification> {
    return this.http.post<Notification>(`${environment.apiUrl}/admin/notifications`, req);
  }
}
