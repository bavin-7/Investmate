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

@Component({
  selector: 'app-portfolio-buy-sell-container',
  standalone: true,
  imports: [CommonModule, PortfolioAlertComponent, MatIcon, MatSnackBarModule, MatListModule, FormsModule],
  templateUrl: './portfolio-buy-sell-container.component.html',
  styleUrls: ['./portfolio-buy-sell-container.component.css']
})
export class PortfolioBuySellContainerComponent implements OnInit {
  portfolioId!: string;
  portfolio: Portfolio | undefined;
  stocks: PortfolioStock[] = [];
  stockToBuy: PortfolioStock | undefined;
  quantityToBuy: number = 0;

  constructor(
    private route: ActivatedRoute,
    private portfolioService: PortfolioService,
    private stockService: StockService
  ) { }

  ngOnInit(): void {
    this.portfolioId = this.route.snapshot.paramMap.get('id')!;
    this.loadPortfolio();
    this.loadStocks();
  }

  loadPortfolio(): void {
    this.portfolioService.getPortfolioById(this.portfolioId).subscribe(portfolio => {
      this.portfolio = portfolio;
  
      // Map backend response to PortfolioStock model
      this.stocks = (portfolio.stocks ?? []).map(stock => {
        const currentPrice = stock.current_price; // Assuming you have a way to get current price
        const holdings = stock.quantity;
        const returns = holdings * (currentPrice - stock.avgBuyPrice);
  
        return {
          stockId: stock.stockId,
          stockName: stock.stockName,
          stockSymbol: stock.stockSymbol,
          stockImage: stock.stockImage,
          currentPrice: currentPrice,
          priceChangePercentage24h: stock.priceChangePercentage24h || 0,
          holdings: holdings,
          avgBuyPrice: stock.avgBuyPrice,
          returns: returns,
          quantity: holdings,
          current_price: currentPrice // Add this line to match PortfolioStock interface
        };
      });
    });  }

  loadStocks(): void {
    this.stockService.getAllStocks().subscribe(stocks => {
      this.stocks = stocks.map(stock => ({
        stockId: stock.id,
        stockName: stock.name,
        stockSymbol: stock.symbol,
        stockImage: stock.image,
        currentPrice: stock.current_price,
        priceChangePercentage24h: stock.price_change_percentage_24h,
        holdings: 0,
        avgBuyPrice: 0,
        returns: 0,
        quantity: 0,
        current_price: stock.current_price
      }));
    });
  }

  addStock(): void {
    if (this.stockToBuy?.stockId && this.quantityToBuy > 0) {
      this.portfolioService.buyStock(this.portfolioId, this.stockToBuy.stockId, this.quantityToBuy)
        .subscribe(response => {
          this.loadPortfolio(); // Refresh the portfolio after buying
          this.quantityToBuy = 0; // Reset the quantity input
          alert('Stock purchased successfully!');
        });
    } else {
      alert('Please select a stock and enter a valid quantity.');
    }
  }
}


