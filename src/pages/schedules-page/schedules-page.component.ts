import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleComponent } from "../../components/schedule/schedule.component";
import { supabase } from '../../supabase';
import { Router, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-schedules-page',
    standalone: true,
    templateUrl: './schedules-page.component.html',
    styleUrl: './schedules-page.component.scss',
    imports: [CommonModule, RouterOutlet, ScheduleComponent]
})
export class SchedulesPageComponent {

  public name: string = '';
  public lineSwitch: boolean = false;

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getUser();
  }

  async getUser() {
    const { data: { user } } = await supabase.auth.getUser();
    console.log(user);
    this.name = user?.email || 'unknown';
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
      this.navigate('login');
    } else {
      console.log("Error logging out: ", error);
    }
  }

  public navigate( path: string ) {
    console.log("navigating to: ", path);
    this.router.navigate(['/' + path]);
  }
}