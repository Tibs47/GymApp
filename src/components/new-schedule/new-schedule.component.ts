import { Component, ElementRef, ViewChild } from '@angular/core';
import { supabase } from '../../supabase';
import { CommonModule, DatePipe } from '@angular/common';
import { CoachesSchedules, Profile, User } from '../../types';
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
  public today: string | null = this.datePipe.transform(this.todaysDate, 'EEEE, MMM d');
  public userAuth: User | undefined;
  public userProfile: Profile | string | undefined;
  public coachId: number | undefined;
  public accepted: boolean | undefined | null;
  public role: string | undefined;
  public newStartTime: Date = new Date(this.todaysDate);
  public newEndTime: Date = new Date(this.todaysDate);
  public showNewTime: boolean = false;
  public coachesSchedules: CoachesSchedules[] = [];
  public todaysCoachesSchedules: CoachesSchedules[] = [];
  
  async ngOnInit(){
    this.userAuth = await this.userAuthService.getUser();
    this.userId = this.userAuth?.id;
    this.userProfile = await this.userAuthService.getProfile();
    if (typeof this.userProfile !== 'string') {
      this.coachId = this.userProfile?.coach_ID;
      this.accepted = this.userProfile?.accepted;
      this.role = this.userProfile?.role;
    }
    this.getCoachSchedules();
    this.initTime();
  }

  public async getCoachSchedules() {
    this.todaysCoachesSchedules = [];
    let { data: coachSchedules, error } = await supabase
      .from('coachesSchedules')
      .select('*')
      .eq('coachID', this.coachId);
    if (error) {
      console.log('Error getting coachesSchedules...', error);
    } else {
      this.coachesSchedules = coachSchedules || [];
      console.log(this.coachesSchedules);
    }
    for (let cs of this.coachesSchedules) {
      if (new Date(cs.startTime).getDate() === new Date(this.todaysDate).getDate() &&
          new Date(cs.startTime).getMonth() === new Date(this.todaysDate).getMonth() &&
          new Date(cs.startTime).getFullYear() === new Date(this.todaysDate).getFullYear()
      ) {
        this.todaysCoachesSchedules.push(cs);
      }
    }
  }

  public initTime(){
    this.newStartTime.setUTCHours(this.todaysDate.getHours() + 1);
    this.newStartTime.setMinutes(0);
    this.newStartTime.setSeconds(0);
    this.newStartTime.setMilliseconds(0);
    this.newEndTime.setUTCHours(this.todaysDate.getHours() + 2);
    this.newEndTime.setMinutes(0);
    this.newEndTime.setSeconds(0);
    this.newEndTime.setMilliseconds(0);
  }

  public dayNavigaition(x: boolean): void {
    this.todaysCoachesSchedules = [];
    if (x){
      if (this.todaysDate.getDate() < new Date().getDate() + 7) {
        this.todaysDate.setDate(this.todaysDate.getDate() + 1);
        this.newStartTime.setDate(this.todaysDate.getDate());
        this.newEndTime.setDate(this.todaysDate.getDate());
        this.today = this.datePipe.transform(this.todaysDate, 'EEEE, MMM d');
      }
    } else {
      if (this.todaysDate.getDate() > new Date().getDate()) {
        this.todaysDate.setDate(this.todaysDate.getDate() - 1);
        this.newStartTime.setDate(this.todaysDate.getDate());
        this.newEndTime.setDate(this.todaysDate.getDate());
        if (this.todaysDate.getDate() === new Date().getDate()) {
          this.newStartTime.setUTCHours(this.todaysDate.getHours() + 1);
          this.newEndTime.setUTCHours(this.todaysDate.getHours() + 2);
        } 
        this.today = this.datePipe.transform(this.todaysDate, 'EEEE, MMM d');
      }
    }
    for (let cs of this.coachesSchedules) {
      if (new Date(cs.startTime).getDate() === new Date(this.todaysDate).getDate() &&
          new Date(cs.startTime).getMonth() === new Date(this.todaysDate).getMonth() &&
          new Date(cs.startTime).getFullYear() === new Date(this.todaysDate).getFullYear()
      ) {
        this.todaysCoachesSchedules.push(cs);
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
    //cant set lower than current time and cant set end to be earlyer than start logic
    if (position) {
      if (direction) {
        if (this.newStartTime.getUTCHours() < 21 && this.newStartTime.getUTCHours() < this.newEndTime.getUTCHours() - 1) {
          this.newStartTime.setUTCHours(this.newStartTime.getUTCHours() + 1);
        }
      } else if (!direction) {
        if (this.newStartTime.getUTCHours() > 9) {
          //if its not today lower by 1
          if (this.newStartTime.getDate() !== new Date().getDate()) {
            this.newStartTime.setUTCHours(this.newStartTime.getUTCHours() - 1);
          } else {
            //if it is today lower only if new start is bigger than current hours
            if (this.newStartTime.getUTCHours() > new Date().getHours() + 1) {
              this.newStartTime.setUTCHours(this.newStartTime.getUTCHours() - 1);
            }
          }
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
    .select();
    if (error) {
      console.log(error);
    } else {
      this.getCoachSchedules();
    }
  }

  public async deleteCoachSchedule(coachTimeID: number) {
    const { error } = await supabase
    .from('coachesSchedules')
    .delete()
    .eq('coachTimeID', coachTimeID);
    if (error) {
      console.log('Error deleting coach schedule...', error);
    } else {
      this.getCoachSchedules();
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

  public graphTime: any[] = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00',
  ];

  public graphColor: any[] = [
    'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'red',
  ];
}
