import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleComponent } from "../../components/schedule/schedule.component";
import { supabase } from '../../supabase';
import { NavigationService } from '../../services/navigation.service';
import { NewScheduleComponent } from '../../components/new-schedule/new-schedule.component';

@Component({
    selector: 'app-schedules-page',
    standalone: true,
    templateUrl: './schedules-page.component.html',
    styleUrl: './schedules-page.component.scss',
    imports: [CommonModule, ScheduleComponent, NewScheduleComponent]
})
export class SchedulesPageComponent {

  public name: string = '';
  public lineSwitch: boolean = false;

  constructor(
    public navigationService: NavigationService,
  ) { }

  ngOnInit(): void {
    this.getUser();
  }

  async getUser() {
    const { data: { user } } = await supabase.auth.getUser();
    console.log(user);
    const userId: string = user?.id || 'unknown';
    console.log(userId);

    let { data: profiles, error } = await supabase
    .from('profiles')
    .select('first_name')
    .eq('id', userId);
 
    console.log(profiles);
    this.name = profiles?.[0]?.first_name || null;

    if (!this.name) {
      this.navigationService.navigate('settings');
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