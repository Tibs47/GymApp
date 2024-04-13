import { Component, ViewChild, ElementRef } from '@angular/core';
import { supabase } from '../../supabase';
import { NavigationService } from '../../services/navigation.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent {

  public name: string = '';
  public lastName: string = '';
  public userId: string = '';
  public firstTime: boolean = false;
  public message: string = '';
  public showMessage: boolean = false;
  public disableButton: boolean = false;

  constructor(
    public navigationService: NavigationService,
  ) { }

  @ViewChild('nameInput') nameInput!: ElementRef<HTMLInputElement>;
  @ViewChild('lastNameInput') lastNameInput!: ElementRef<HTMLInputElement>;

  ngOnInit(): void {
    this.getUser();
  }

  async getUser() {
    const { data: { user } } = await supabase.auth.getUser();
    this.userId = user?.id || 'unknown';

    let { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', this.userId);
 
    this.name = profiles?.[0]?.first_name || null;
    this.lastName = profiles?.[0]?.last_name || null;

    if (!this.name) {
      this.firstTime = true;
    }
  }

  async updateInfo () {
    const newName = this.nameInput.nativeElement.value;
    const newLastName = this.lastNameInput.nativeElement.value;
    if (this.firstTime) {
      console.log('first time', this.firstTime);
      const { data, error } = await supabase
      .from('profiles')
      .insert([
        { id: this.userId, first_name: newName, last_name: newLastName }
      ])
      .select()
      console.log(error)
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
}
