import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'app-portfolio-transactions',
  standalone: true,
  templateUrl: './portfolio-transactions.component.html',
  styleUrls: ['./portfolio-transactions.component.css'],
  imports: [
    CommonModule, MatProgressSpinnerModule, MatPaginatorModule, MatTableModule, DatePipe
  ],
})
export class PortfolioTransactionsComponent implements OnInit,OnChanges {

  formattedReturns: string = '';

  stockData: any;
  transactionsList: any[] = [];
  holdings: number = 0;
  returns: number = 0;
  loading: boolean = true;
  page: number = 0;
  rowsPerPage: number = 30;
  @Input() stockId!: string;
  @Input() id!: string;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log(params)
      // this.stockId = params['stockId'];
      // this.id = params['id'];
      this.getAllStocks();
      this.formattedReturns = this.calculateFormattedReturns(this.returns);
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.getAllStocks();
  }
  async getAllStocks() {
    try {
      const response = await this.http.get<any>(
        'http://localhost:9001/portfolio/getTransaction',
        { params: { portfolioId: this.id, stockId: this.stockId } }
      ).toPromise();
      this.stockData = response.stock;
      this.transactionsList = response.transactionsDetailsList;
      this.holdings = response.holdings;
      this.returns = response.returns;
      this.loading = false;
    } catch (error) {
      console.error('Error fetching stock data', error);
      this.loading = false;
    }
  }

  handleChangePage(event: any, newPage: number) {
    this.page = newPage;
  }

  handleChangeRowsPerPage(event: any) {
    this.rowsPerPage = +event.target.value;
    this.page = 0;
  }


  calculateFormattedReturns(value: number): string {
    return `-${Math.abs(value).toFixed(2)}`;
  }
}
