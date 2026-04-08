import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Piece, MouvementStock, SortieStockRequest, PageResponse } from '@sav/shared-models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class StockApiService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/stock`;

  getPieces(search?: string, page = 0, size = 30): Promise<PageResponse<Piece>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (search?.trim()) params = params.set('search', search.trim());
    return firstValueFrom(
      this.http.get<PageResponse<Piece>>(`${this.base}/pieces`, { params })
    );
  }

  sortieStock(id: number, req: SortieStockRequest): Promise<MouvementStock> {
    return firstValueFrom(
      this.http.post<MouvementStock>(`${this.base}/pieces/${id}/sortie`, req)
    );
  }
}
