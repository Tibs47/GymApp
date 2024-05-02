import { Component, ElementRef, ViewChild } from '@angular/core';
import { supabase } from '../../supabase';
import { CommonModule, DatePipe } from '@angular/common';
import { Profile, User } from '../../types';
import { UserAuthService } from '../../services/user-auth.service';

@Component({
  selector: 'app-new-schedule',
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe],
  templateUrl: './new-schedule.component.html',
  styleUrl: './new-schedule.component.scss'
})
export class NewScheduleComponent {
  @ViewChild('startDateInput') startDateInput!: ElementRef<HTMLInputElement>;
  @ViewChild('endDateInput') endDateInput!: ElementRef<HTMLInputElement>;
  
  constructor(
    private datePipe: DatePipe,
    public userAuthService: UserAuthService,
  ) { }

  public swipeCoord: [number, number] = [0,0];
  public swipeTime: number = 0;
  swipe(e: TouchEvent, when: string): void {
    const coord: [number, number] = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
    const time = new Date().getTime();
  
    if (when === 'start') {
      this.swipeCoord = coord;
      this.swipeTime = time;
    } else if (when === 'end') {
      const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
      const duration = time - this.swipeTime;
  
      if (duration < 1000 //
        && Math.abs(direction[0]) > 30 // Long enough
        && Math.abs(direction[0]) > Math.abs(direction[1] * 3)) { // Horizontal enough
          const swipe = direction[0] < 0 ? 'next' : 'previous';
          if (swipe === 'next') {
            this.dayNavigaition(true);
          } else if (swipe === 'previous') {
            this.dayNavigaition(false);
          }
      }
    }
  }

  public userId: string = '';
  public todaysDate: Date = new Date();
  public today: string | null = this.datePipe.transform(this.todaysDate, 'EEEE, d/M');
  public userAuth: User | undefined;
  public userProfile: Profile | string | undefined;
  public coachId: number | undefined;
  public accepted: boolean | undefined | null;
  public role: string | undefined;
  public newStartTime: Date = new Date(this.todaysDate);
  public newEndTime: Date = new Date(this.todaysDate);
  public showNewTime: boolean = false;

  
  async ngOnInit(){
    this.userAuth = await this.userAuthService.getUser();
    this.userId = this.userAuth?.id;
    this.userProfile = await this.userAuthService.getProfile();
    if (typeof this.userProfile !== 'string') {
      this.coachId = this.userProfile?.coach_ID;
      this.accepted = this.userProfile?.accepted;
      this.role = this.userProfile?.role;
    }
    this.initTime();
  }

  public initTime(){
    this.newStartTime.setUTCHours(9);
    this.newStartTime.setMinutes(0);
    this.newStartTime.setSeconds(0);
    this.newStartTime.setMilliseconds(0);
    this.newEndTime.setUTCHours(11);
    this.newEndTime.setMinutes(0);
    this.newEndTime.setSeconds(0);
    this.newEndTime.setMilliseconds(0);
  }

  public dayNavigaition(x: boolean): void {
    if (x){
      if (this.todaysDate.getDate() < new Date().getDate() + 7) {
        this.todaysDate.setDate(this.todaysDate.getDate() + 1);
        this.newStartTime = this.todaysDate;
        this.newEndTime = this.todaysDate;

        this.today = this.datePipe.transform(this.todaysDate, 'EEEE, d/M');
      }
    } else {
      if (this.todaysDate.getDate() > new Date().getDate()) {
        this.todaysDate.setDate(this.todaysDate.getDate() - 1);
        this.newStartTime = this.todaysDate;
        this.newEndTime = this.todaysDate;

        this.today = this.datePipe.transform(this.todaysDate, 'EEEE, d/M');
      }
    }
  }

  public openTime (open: boolean) {
    if (open) {
      this.showNewTime = true;
    } else if (!open) {
      this.showNewTime = false;
    }
  }

  public setTime (position: boolean, direction: boolean) {
    //true=start, false=end
    //true=gore, false=dole
    if (position) {
      if (direction) {
        if (this.newStartTime.getUTCHours() < 21 && this.newStartTime.getUTCHours() < this.newEndTime.getUTCHours() - 1) {
          this.newStartTime.setUTCHours(this.newStartTime.getUTCHours() + 1);
        }
      } else if (!direction) {
        if (this.newStartTime.getUTCHours() > 9) {
          this.newStartTime.setUTCHours(this.newStartTime.getUTCHours() - 1);
        }
      }
    } else if (!position) {
      if (direction) {
        if (this.newEndTime.getUTCHours() < 22) {
          this.newEndTime.setUTCHours(this.newEndTime.getUTCHours() + 1);
        }
      } else if (!direction) {
        if (this.newEndTime.getUTCHours() > 10 && this.newEndTime.getUTCHours() > this.newStartTime.getUTCHours() + 1) {
          this.newEndTime.setUTCHours(this.newEndTime.getUTCHours() - 1);
        }
      }
    }
  }

  async insertCoachSchedule() {
    const { data, error } = await supabase
    .from('coachesSchedules')
    .insert([
      { 
        startTime: this.newStartTime,
        endTime: this.newEndTime,
        coachID: this.coachId,
      },
    ])
    .select()
    if (error) {
      console.log(error);
    } else {
      window.location.reload();
    }
  }

  async insertSchedule() {
    const startDate = new Date (this.startDateInput.nativeElement.value);
    console.log(this.startDateInput.nativeElement.value);
    const endDate = new Date (this.endDateInput.nativeElement.value);
    
    const { data, error } = await supabase
    .from('schedules')
    .insert([
      { 
        userID: this.userId, 
        startTime: this.newStartTime,
        endTime: this.newEndTime,
        confirmed: 0,
        coachID: this.coachId,
      },
    ])
    .select()
    if (error) {
      console.log(error);
    } else {
      window.location.reload();
    }
  }
}
