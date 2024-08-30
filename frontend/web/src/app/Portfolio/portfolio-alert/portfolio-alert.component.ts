import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-portfolio-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio-alert.component.html',
  styleUrl: './portfolio-alert.component.css'
})
export class PortfolioAlertComponent {
  @Input() message: string | null = null;
}