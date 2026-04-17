import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ContactPayload {
  name: string;
  email: string;
  company?: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {

  private readonly apiUrl = '/api/public/contact';

  constructor(private http: HttpClient) {}

  send(payload: ContactPayload): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(this.apiUrl, payload);
  }
}
