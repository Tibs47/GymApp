import { Component, ElementRef, ViewChild } from '@angular/core';
import { supabase } from '../../supabase';
@Component({
  selector: 'app-new-schedule',
  standalone: true,
  imports: [],
  templateUrl: './new-schedule.component.html',
  styleUrl: './new-schedule.component.scss'
})
export class NewScheduleComponent {
  @ViewChild('startDateInput') startDateInput!: ElementRef<HTMLInputElement>;
  @ViewChild('endDateInput') endDateInput!: ElementRef<HTMLInputElement>;
  @ViewChild('endDateInput') coachInput!: ElementRef<HTMLInputElement>;

  public userId: string = '';

  ngOnInit(){
    this.getUser();
  }

  async getUser() {
    const { data: { user } } = await supabase.auth.getUser();
    this.userId = user?.id || 'unknown';
  }

  async insertSchedule() {
    const startDate = new Date (this.startDateInput.nativeElement.value);
    const endDate = new Date (this.endDateInput.nativeElement.value);
    const coach = parseInt(this.coachInput.nativeElement.value);
    
    const { data, error } = await supabase
    .from('schedules')
    .insert([
      { 
        userID: this.userId, 
        startTime: startDate,
        endTime: endDate,
        confirmed: 0,
        coachID: 1,
        //coachID: "'"+ coach + "'",
      },
    ])
    .select()
    console.log(error);
  }
}
