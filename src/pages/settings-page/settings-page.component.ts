import { Component, ViewChild, ElementRef } from '@angular/core';
import { supabase } from '../../supabase';
import { NavigationService } from '../../services/navigation.service';
import { CommonModule } from '@angular/common';
import { UserAuthService } from '../../services/user-auth.service';
import { Profile, User } from '../../types';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent {
  @ViewChild('nameInput') nameInput!: ElementRef<HTMLInputElement>;
  @ViewChild('lastNameInput') lastNameInput!: ElementRef<HTMLInputElement>;

  constructor(
    public navigationService: NavigationService,
    public userAuthService: UserAuthService,
  ) { }

  public name: string = '';
  public lastName: string = '';
  public accepted: boolean | null = null;
  public role: string | null = null;
  public userId: string = '';
  public noCreds: boolean = false;
  public message: string = '';
  public showMessage: boolean = false;
  public disableButton: boolean = false;
  public currentIndex = 0;
  public userAuth: User | undefined;
  public userProfile: Profile | string | undefined;
  public coaches: any[] | null | undefined;
  public coachNames: string[] = [];
  public images: string[] = [ //images must be set in order like coach id's
      '../../assets/img/panda.png', //id=0
      '../../assets/img/logo.png', //id=1
    ];

  async ngOnInit(): Promise<void> {
    this.userAuth = await this.userAuthService.getUser();
    this.userId = this.userAuth?.id;
    this.userProfile = await this.userAuthService.getProfile();
    if (typeof this.userProfile === 'string') {
      this.noCreds = true;
    } else {
      this.name = this.userProfile?.first_name;
      this.lastName = this.userProfile?.last_name;
      this.accepted = this.userProfile?.accepted;
      this.role = this.userProfile?.role;
    }
    this.getCoaches()
  }

  async saveInfo () {
    const newName = this.nameInput.nativeElement.value;
    const newLastName = this.lastNameInput.nativeElement.value;

    if (this.noCreds) {
      const { error } = await supabase
      .from('profiles')
      .insert([
        { id: this.userId, first_name: newName, last_name: newLastName }
      ])
      .select()
      if (error) {
        console.log('Error with INSERT', error);
      }
      console.log(error)
      setTimeout(() => {
        this.showMessage = false;
        this.disableButton = false;
        this.navigationService.navigate('schedules');
      }, 1500);
    } else {
      if (newName !== this.name || newLastName !== this.lastName) {
        const { data, error } = await supabase
        .from('profiles')
        .update({ first_name: newName, last_name: newLastName })
        .eq('id', this.userId)
        .select()
        if (data) {
          console.log('Updated!!!', data); //remove later
          this.name = newName;
          this.lastName = newLastName;
        }
        this.message = 'Your information has been updated!';
        this.showMessage = true;
        this.disableButton = true;
        setTimeout(() => {
          this.showMessage = false;
          this.disableButton = false;
          this.navigationService.navigate('schedules');
        }, 1500);
      } else {
        console.log('Nothing changed'); //remove later
        this.message = 'You changed nothing...';
        this.showMessage = true;
        this.disableButton = true;
        setTimeout(() => {
          this.showMessage = false;
          this.disableButton = false;
        }, 2000);
      }
    }
  }

  public async getCoaches() {
    let { data: coaches, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'coach');
    this.coaches = coaches;
    if (this.coaches) {
      for (let coach of this.coaches) {
        this.coachNames.push(coach.first_name);
      }
    }
    if (error) {
      console.log('Error getting coaches: ', error);
    }
  }

  public nextCoach() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  public prevCoach() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  public async setCoach() {
    const { data, error } = await supabase
    .from('profiles')
    .update({ 'coach_ID': this.currentIndex, 'accepted': false })
    .eq('id', this.userId)
    .select()
    if (error) {
      console.log('Error selecting coach: ', error);
    } else {
      window.location.reload();
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
