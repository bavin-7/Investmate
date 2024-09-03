import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../../portfolio-service';
import { Portfolio } from '../../../portfolio.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddPortfolioComponent } from '../add-portfolio/add-portfolio.component';
import { DeletePortfolioComponent } from '../delete-portfolio/delete-portfolio.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { UserService } from '../../user.service';
import { User } from '../../user.model';
import { PortfolioTransactionsComponent } from '../portfolio-transactions/portfolio-transactions.component';


@Component({
  standalone: true,
  selector: 'app-portfolio-container',
  templateUrl: './portfolio-container.component.html',
  styleUrls: ['./portfolio-container.component.css'],
imports: [MatDialogModule, RouterLink, CommonModule, FormsModule,
            MatIconModule, RouterOutlet, MatListModule,PortfolioTransactionsComponent]
})
export class PortfolioContainerComponent implements OnInit {

  userDetails: any;

  dropdownOpen = false; // Add this line
  isDropdownVisible = false;
  showUserDetailsDialog: boolean = false;  // Variable to control the dialog visibility


  portfolios: Portfolio[] = [];
  isPortfolioAdded = false;
  selectedIndex = -1;
  userId: string;
  isSmallScreen = false;

  constructor(
    private portfolioService: PortfolioService,
    private dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private userService: UserService
  ) {
    this.userId = sessionStorage.getItem('userId') || '';
  }

  ngOnInit(): void {
    this.getAllPortfolios();
    this.breakpointObserver.observe([Breakpoints.HandsetPortrait])
      .subscribe(result => {
        this.isSmallScreen = result.matches;
      });
  }

  getAllPortfolios(): void {
    this.portfolioService.getAllPortfolios(this.userId).subscribe(
      (response: Portfolio[]) => {
        this.portfolios = response;
      },
      (error) => {
        console.error('Error fetching portfolios:', error);
      }
    );
  }

  // handleListItemClick(index: number): void {
  //   this.selectedIndex = index;
  // }

  handleListItemClick(index: number, stockId: string | undefined): void {
    this.selectedIndex = index;
    const selectedPortfolio = this.portfolios[index];
  
    if (selectedPortfolio && stockId) {
      this.router.navigate(['/portfolio', selectedPortfolio.portfolioId, 'transactions', stockId]);
    } else {
      console.error('Portfolio or stockId is missing');
    }
  }
  
  

  openAddPortfolioDialog(): void {
    const dialogRef = this.dialog.open(AddPortfolioComponent, {
      width: '400px',
      data: { type: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isPortfolioAdded = !this.isPortfolioAdded;
        this.getAllPortfolios();
      }
    });
  }

  openEditPortfolioDialog(portfolio: Portfolio): void {
    const dialogRef = this.dialog.open(AddPortfolioComponent, {
      width: '400px',
      data: { type: 'edit', portfolio: portfolio }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isPortfolioAdded = !this.isPortfolioAdded;
        this.getAllPortfolios();
      }
    });
  }

  openDeletePortfolioDialog(portfolioId: string): void {
    const dialogRef = this.dialog.open(DeletePortfolioComponent, {
      width: '400px',
      data: { portfolioId: portfolioId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isPortfolioAdded = !this.isPortfolioAdded;
        this.getAllPortfolios();
        this.selectedIndex = -1;
      }
    });
  }

  // Toggle dropdown function
  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

   // Logout function
logout(): void {
  sessionStorage.clear(); // Clear session storage or any other logout logic
  this.router.navigate(['/login']); // Navigate to the login page or wherever needed
}

// viewUserDetails function
viewUserDetails(): void {
  this.isDropdownVisible = false;
  this.router.navigate(['/user-details']);
}

  openUserDetailsDialog() {
    const userId = sessionStorage.getItem('userId');  // Retrieve the stored user ID
    if (userId) {
      this.userService.getUserById(userId).subscribe({
        next: (user: User) => {
          this.userDetails = user;  // Store fetched user details
          this.showUserDetailsDialog = true;  // Show the dialog
          console.log('User details fetched successfully:', user);
        },
        error: (error: any) => {
          console.error('Error fetching user details:', error);
        }
      });
    } else {
      console.error('User ID not found in session storage');
    }
  }


  closeUserDetailsDialog() {
    this.showUserDetailsDialog = false;  // Hide the dialog
    this.userDetails = null;  // Clear user details
  }

    // New navigation method
    navigateToTransactions(portfolioId: string, stockId: string): void {
      this.router.navigate(['/portfolio', portfolioId, 'transactions', stockId]);
    }
  
    // Example method where navigation might be triggered
    onTransactionClick(portfolioId: string, stockId: string): void {
      this.navigateToTransactions(portfolioId, stockId);
    }
  
}
