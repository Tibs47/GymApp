import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-schedules-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './schedules-page.component.html',
  styleUrl: './schedules-page.component.scss'
})
export class SchedulesPageComponent {
  public name: string = 'Tibor';
  public lineSwitch: boolean = false;

  public lineSwitcher(side: boolean) {
    if (side) {
      this.lineSwitch = true;
    } else {
      this.lineSwitch = false;
    }
  }
}