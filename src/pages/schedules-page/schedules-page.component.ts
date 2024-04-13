import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { supabase } from '../../supabase';
import { NavigationService } from '../../services/navigation.service';
import { NewScheduleComponent } from '../../components/new-schedule/new-schedule.component';
import { ScheduleComponent } from '../../components/schedule/schedule.component';

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
  public reload: boolean = false;

  constructor(
    public navigationService: NavigationService,
  ) { }

  ngOnInit(): void {
    this.getUser();
  }
  
  async reloadSchedule() {
    setTimeout(() => {
      this.reload = false;
    }, 100);
    this.reload = true;
    //ovo je ok ali bi bilo bolje kada se napravi insert samo sloziti reload nekako
  }

  async getUser() {
    const { data: { user } } = await supabase.auth.getUser();
    const userId: string = user?.id || 'unknown';

    let { data: profiles, error } = await supabase
    .from('profiles')
    .select('first_name')
    .eq('id', userId);

    this.name = profiles?.[0]?.first_name || null;

    if (!this.name) {
      this.navigationService.navigate('settings');
    }
  }

  public async lineSwitcher(side: boolean) {
    if (side) {
      this.lineSwitch = true;
    } else {
      this.reloadSchedule();
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