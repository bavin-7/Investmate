import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PortfolioService } from '../../portfolio-service';
import { StockService } from '../../stock.service';
import { Portfolio, PortfolioStock } from '../../../portfolio.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PortfolioAlertComponent } from '../portfolio-alert/portfolio-alert.component';
import { Stock } from '../../stock.model';
import { PortfolioTransactionsComponent } from '../portfolio-transactions/portfolio-transactions.component';
 
@Component({
  selector: 'app-portfolio-buy-sell-container',
  standalone: true,
  imports: [CommonModule, PortfolioAlertComponent, MatIcon, MatSnackBarModule, MatListModule, FormsModule,PortfolioTransactionsComponent],
  templateUrl: './portfolio-buy-sell-container.component.html',
  styleUrls: ['./portfolio-buy-sell-container.component.css']
})
export class PortfolioBuySellContainerComponent implements OnInit {
  portfolioId!: string;
  portfolio: Portfolio | undefined;
  stocks: PortfolioStock[] = [];
  availableStocks: Stock[] = [];
  stockToBuy: Stock | undefined;
  stockToSell: PortfolioStock | undefined;
  quantityToBuy: number = 0;
  quantityToSell: number = 0;
  stockId !: string;
  portfolioId2!: string;

  transferData(stockid:string){
    this.stockId = stockid
  }
  constructor(
    private route: ActivatedRoute,
    private portfolioService: PortfolioService,
    private stockService: StockService
  ) { }
 
  ngOnInit(): void {
    this.portfolioId = this.route.snapshot.paramMap.get('id')!;
    this.loadPortfolio();
    this.loadStocks();
    this.loadStockAll();
  }
 
  loadPortfolio(): void {
    this.portfolioService.getPortfolioById(this.portfolioId).subscribe(portfolio => {
      this.portfolio = portfolio;
 
      // Map backend response to PortfolioStock model
      this.stocks = (portfolio.stocks ?? []).map(stock => {
        const avgBuyPrice = stock.avgBuyPrice ?? 0;
        const holdings = stock.quantity ?? 0;
 
        const totalCostBasis = avgBuyPrice * holdings;
        const currentValue = stock.currentPrice * holdings;
        const returns = currentValue - totalCostBasis;
 
        return {
          stockId: stock.stockId,
          stockName: stock.stockName,
          stockSymbol: stock.stockSymbol,
          stockImage: stock.stockImage,
          currentPrice: stock.currentPrice ?? 0,
          priceChangePercentage24h: stock.priceChangePercentage24h ?? 0,
          holdings: holdings,
          avgBuyPrice: avgBuyPrice,
          returns: returns,
          quantity: holdings,
          current_price: stock.currentPrice // Ensure this is used correctly if needed
        };
      });
    });
  }
 
  loadStocks(): void {
    this.portfolioService.getAllStocks(this.portfolioId).subscribe(data => {
      if (data && data.stockDetails) {
        this.stocks = data.stockDetails.map(detail => ({
          stockId: detail.stock.stockId,
          stockName: detail.stock.stockName,
          stockSymbol: detail.stock.stockSymbol,
          stockImage: detail.stock.stockImage,
          currentPrice: detail.currentPrice,
          priceChangePercentage24h: detail.priceChangePercentage24h,
          holdings: detail.stock.quantity,
          avgBuyPrice: detail.stock.avgBuyPrice,
          returns: detail.returns,
          quantity: detail.stock.quantity
        }));
      } else {
        console.warn('No stock details found.');
      }
    });
  }
 
  loadStockAll(): void {
    this.stockService.getAllStocks().subscribe(stocks => {
      this.availableStocks = stocks;
    });
  }
 
  addStock(): void {
    if (this.stockToBuy?.id && this.quantityToBuy > 0) {
      this.transferData(this.stockToBuy?.id)
      this.portfolioService.buyStock(this.portfolioId, this.stockToBuy.id, this.quantityToBuy)
        .subscribe(() => {
          this.loadPortfolio(); // Refresh the portfolio after buying
          this.quantityToBuy = 0; // Reset the quantity input
          alert('Stock purchased successfully!');
        });
    } else {
      alert('Please select a stock and enter a valid quantity.');
    }
  }
 
  sellStock(): void {
    if (this.stockToSell?.stockId && this.quantityToSell > 0) {
      this.transferData(this.stockToSell?.stockId)
      this.portfolioService.sellStock(this.portfolioId, this.stockToSell.stockId, this.quantityToSell)
        .subscribe(() => {
          this.loadPortfolio(); // Refresh the portfolio after selling
          this.quantityToSell = 0; // Reset the quantity input
          alert('Stock sold successfully!');
        });
    } else {
      alert('Please select a stock and enter a valid quantity.');
    }
  }
}