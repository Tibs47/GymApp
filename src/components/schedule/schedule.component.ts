import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Schedule } from '../../types';
import { supabase } from '../../supabase';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss'
})
export class ScheduleComponent {
  schedules: Schedule[] = [];

  ngOnInit () {
    this.getSchedules();
  }

  public async getSchedules() {
    const { data: { user } } = await supabase.auth.getUser();
    const userId: string = user?.id || 'unknown';

    let { data: schedules, error } = await supabase
    .from('schedules')
    .select('*')
    .eq('userID', userId);
    this.schedules = schedules || [];
    console.log('local: ', this.schedules);
  }

  public async deleteSchedule (scheduleID: number) {
    const { error } = await supabase
    .from('schedules')
    .delete()
    .eq('scheduleID', scheduleID);
    if (error) {
      console.log(error);
    } else {
      this.getSchedules();
    }
  }

  public getStatus(status: number): string {
    if (status === 1) {
      return 'Confirmed';
    } else {
      return 'Not confirmed';
    }
  }

  public getCoachName(coachId: number): string {
    if(coachId === 1) {
      return 'Panda';
    } else {
      return 'x';
    }
  } 

  public getImg(coachId: number): string {
    if(coachId === 1) {
      return '../../assets/img/panda.png';
    } else {
      return '';
    }
  }
}