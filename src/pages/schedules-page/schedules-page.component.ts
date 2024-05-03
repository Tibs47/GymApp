import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { supabase } from '../../supabase';
import { NavigationService } from '../../services/navigation.service';
import { UserAuthService } from '../../services/user-auth.service';
import { NewScheduleComponent } from '../../components/new-schedule/new-schedule.component';
import { ScheduleComponent } from '../../components/schedule/schedule.component';
import { Profile, User } from '../../types';

@Component({
    selector: 'app-schedules-page',
    standalone: true,
    templateUrl: './schedules-page.component.html',
    styleUrl: './schedules-page.component.scss',
    imports: [CommonModule, ScheduleComponent, NewScheduleComponent]
})
export class SchedulesPageComponent {
  public name: string = '';
  public lineSwitch: boolean = true; //change to false
  public userAuth: User | undefined;
  public userId: string = '';
  public userProfile: Profile | string | undefined;

  constructor(
    public navigationService: NavigationService,
    public userAuthService: UserAuthService,
  ) { }

  async ngOnInit(): Promise<void>  {
    this.userAuth = await this.userAuthService.getUser();
    this.userId = this.userAuth?.id;
    this.userProfile = await this.userAuthService.getProfile();
    this.getUser();
  }

  async getUser() {
    let { data: profiles, error } = await supabase
    .from('profiles')
    .select('first_name')
    .eq('id', this.userId);
    if (error) {
      console.log('Error getting user data...', error);
    } else {
      this.name = profiles?.[0]?.first_name || null;
      if (profiles?.length === 0) {
        this.navigationService.navigate('settings');
      }
    }
  }

  public async lineSwitcher(side: boolean) {
    if (side) {
      this.lineSwitch = true;
    } else {
      this.lineSwitch = false;
    }
  }
  public async logOut() {
    let { error } = await supabase.auth.signOut();
    console.log("Signing out..");
    if (!error) {
      this.navigationService.navigate('login');
    } else {
      console.log("Error logging out: ", error);
    }
  }
}