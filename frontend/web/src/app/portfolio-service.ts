import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Portfolio } from '../Portfolio.model';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private apiUrl = 'http://localhost:9001/portfolio';

  constructor(private http: HttpClient) {}

  getAllPortfolios(userId: string): Observable<Portfolio[]> {
    return this.http.get<Portfolio[]>(`${this.apiUrl}/getAll`, { params: { userId } });
  }

  addPortfolio(portfolio: Portfolio, userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, portfolio, { params: { userId } });
  }

  updatePortfolio(portfolioId: string, portfolio: Portfolio): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, portfolio, { params: { portfolioId } });
  }

  deletePortfolio(portfolioId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete`, { params: { portfolioId } });
  }

  getPortfolioById(portfolioId: string): Observable<Portfolio> {
    return this.http.get<Portfolio>(`${this.apiUrl}/${portfolioId}`);
  }

  getAllStocks(portfolioId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAllStocks/${portfolioId}`);
  }

  buyStock(portfolioId: string, stockId: string, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/buyStock`, null, { 
      params: { portfolioId, stockId, quantity: quantity.toString() } 
    });
  }

  sellStock(portfolioId: string, stockId: string, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/sellStock`, null, { 
      params: { portfolioId, stockId, quantity: quantity.toString() } 
    });
  }

  getTransactions(portfolioId: string, stockId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/transactions/${portfolioId}/${stockId}`);
  }
}