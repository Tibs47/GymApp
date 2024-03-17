import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleComponent } from "../../components/schedule/schedule.component";

@Component({
    selector: 'app-schedules-page',
    standalone: true,
    templateUrl: './schedules-page.component.html',
    styleUrl: './schedules-page.component.scss',
    imports: [CommonModule, ScheduleComponent]
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