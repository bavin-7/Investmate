import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { PortfolioService } from '../../portfolio-service';
import { SnackBarService } from '../../snack-bar-service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  standalone: true,
  selector: 'app-add-portfolio',
  templateUrl: './add-portfolio.component.html',
  styleUrls: ['./add-portfolio.component.css'],
  imports:[MatDialogModule, CommonModule,FormsModule,ReactiveFormsModule,MatFormFieldModule,MatInputModule,
            MatSelectModule, MatOptionModule
  ]
})
export class AddPortfolioComponent {
  portfolioForm: FormGroup;
  portfolioData = [
    { name: 'Community-Investing', id: '1' },
    { name: 'Ethical-Investing', id: '2' },
    { name: 'Green-Investing', id: '3' },
    { name: 'Impact-Investing', id: '4' },
    { name: 'Mission-related Investing', id: '5' },
    { name: 'Responsible-Investing', id: '6' },
    { name: 'Socially-Responsible-Investing', id: '7' },
    { name: 'Values-based investing', id: '8' },
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddPortfolioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private portfolioService: PortfolioService,
    private snackBarService: SnackBarService
  ) {
    this.portfolioForm = this.fb.group({
      portfolioName: ['', Validators.required],
      investmentAgenda: ['', Validators.required]
    });

    if (this.data.type === 'edit') {
      this.portfolioForm.patchValue(this.data.portfolio);
    }
  }

  onSubmit(): void {
    if (this.portfolioForm.valid) {
      const userId = sessionStorage.getItem('userId') || '';
      if (this.data.type === 'add') {
        this.portfolioService.addPortfolio(this.portfolioForm.value, userId).subscribe(
          (response) => {
            this.snackBarService.openSnackBar('Portfolio added successfully');
            this.dialogRef.close(true);
          },
          (error) => {
            console.error('Error adding portfolio:', error);
            this.snackBarService.openSnackBar('Error adding portfolio');
          }
        );
      } else {
        this.portfolioService.updatePortfolio(this.data.portfolio.portfolioId, this.portfolioForm.value).subscribe(
          (response) => {
            this.snackBarService.openSnackBar('Portfolio updated successfully');
            this.dialogRef.close(true);
          },
          (error) => {
            console.error('Error updating portfolio:', error);
            this.snackBarService.openSnackBar('Error updating portfolio');
          }
        );
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
