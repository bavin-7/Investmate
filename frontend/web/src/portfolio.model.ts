export interface Portfolio {
    portfolioId: string;
    portfolioName: string;
    investmentAgenda: string;
    userId: string;
    createdAt?: Date;
    updatedAt?: Date;
    totalBalance?: number;
    totalReturns?: number;
    stocks?: PortfolioStock[];
    stockId?: string;
  }
  
  export interface PortfolioStock {
    stockId: string;
    stockName: string;
    stockSymbol: string;
    stockImage: string;
    currentPrice: number; // Should match the backend 'currentPrice'
    priceChangePercentage24h: number;
    holdings: number;
    avgBuyPrice: number;
    returns: number;
    quantity: number;
  }
  
  
  export interface PortfolioTransaction {
    transactionId: string;
    portfolioId: string;
    stockId: string;
    transactionType: 'BUY' | 'SELL';
    quantity: number;
    price: number;
    transactionDate: Date;
  }