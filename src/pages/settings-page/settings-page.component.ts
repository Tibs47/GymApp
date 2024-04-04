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
      this.navigationService.navigate('settings');
    }
  }

  async updateInfo () {
    const newName = this.nameInput.nativeElement.value;
    const newLastName = this.lastNameInput.nativeElement.value;

    if (newName !== this.name) {
      const { data, error } = await supabase
      .from('profiles')
      .update({ first_name: newName })
      .eq('id', this.userId)
      .select()
      if (data) {
        console.log('Updated name!!!', data); //remove later
        this.name = newName;
      }
    } else {
      console.log('Nothing changed'); //remove later
    }

    if (newLastName !== this.lastName) {
      const { data, error } = await supabase
      .from('profiles')
      .update({ last_name: newLastName })
      .eq('id', this.userId)
      .select()
      if (data) {
        console.log('Updated lastname!!!', data); //remove later
        this.lastName = newLastName;
      }
    } else {
      console.log('Nothing changed'); //remove later
    }
  }
}
