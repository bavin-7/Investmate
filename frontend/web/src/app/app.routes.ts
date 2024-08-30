import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { StockListComponent } from './stock-list/stock-list.component';
import { StockDetailComponent } from './stock-detail/stock-detail.component';
import { MarketTrendsComponent } from './market-trends/market-trends.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PortfolioContainerComponent } from './Portfolio/portfolio-container/portfolio-container.component';
import { AddPortfolioComponent } from './Portfolio/add-portfolio/add-portfolio.component';
import { DeletePortfolioComponent } from './Portfolio/delete-portfolio/delete-portfolio.component';
import { PortfolioAlertComponent } from './Portfolio/portfolio-alert/portfolio-alert.component';

export const routes: Routes = [
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'user/:userID', component: UserDetailsComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'stocks', component: StockListComponent },
    { path: 'stock/:id', component: StockDetailComponent },
    { path: 'trends', component: MarketTrendsComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'portfolio', component: PortfolioContainerComponent }, // Portfolio Container route
    { path: 'portfolio/add', component: AddPortfolioComponent }, // Add Portfolio route
    { path: 'portfolio/delete/:id', component: DeletePortfolioComponent }, // Delete Portfolio route
    { path: 'portfolio/alert', component: PortfolioAlertComponent } // Portfolio Alert route
];

 export class AppRoutingModule { }