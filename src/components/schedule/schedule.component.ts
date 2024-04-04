import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Schedule } from '../../types';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss'
})
export class ScheduleComponent {
  schedules: Schedule[] = [
    {
      day: 'Monday',
      time: '13:00 - 14:00',
      status: 1,
      coach: 'Panda',
      img: '../../assets/img/panda.png'
    },
    {
      day: 'Tuesday',
      time: '19:00 - 20:00',
      status: 2,
      coach: 'Panda',
      img: '../../assets/img/panda.png'
    },
  ];
}
