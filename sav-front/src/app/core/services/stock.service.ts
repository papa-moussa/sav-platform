import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Piece, PieceRequest, MouvementStock, EntreeStockRequest, SortieStockRequest } from '../models/stock.model';
import { PageResponse } from '../models/page.model';

@Injectable({ providedIn: 'root' })
export class StockService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/stock`;

  getPieces(search?: string, siteId?: number, alerteOnly?: boolean, page = 0, size = 20): Observable<PageResponse<Piece>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);
    if (search) params = params.set('search', search);
    if (siteId) params = params.set('siteId', siteId);
    if (alerteOnly) params = params.set('alerteOnly', alerteOnly);
    return this.http.get<PageResponse<Piece>>(`${this.base}/pieces`, { params });
  }

  getPiece(id: number): Observable<Piece> {
    return this.http.get<Piece>(`${this.base}/pieces/${id}`);
  }

  createPiece(req: PieceRequest): Observable<Piece> {
    return this.http.post<Piece>(`${this.base}/pieces`, req);
  }

  updatePiece(id: number, req: PieceRequest): Observable<Piece> {
    return this.http.put<Piece>(`${this.base}/pieces/${id}`, req);
  }

  entreeStock(id: number, req: EntreeStockRequest): Observable<MouvementStock> {
    return this.http.post<MouvementStock>(`${this.base}/pieces/${id}/entree`, req);
  }

  sortieStock(id: number, req: SortieStockRequest): Observable<MouvementStock> {
    return this.http.post<MouvementStock>(`${this.base}/pieces/${id}/sortie`, req);
  }

  getMouvements(id: number): Observable<MouvementStock[]> {
    return this.http.get<MouvementStock[]>(`${this.base}/pieces/${id}/mouvements`);
  }

  getAlertesCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.base}/alertes/count`);
  }
}
