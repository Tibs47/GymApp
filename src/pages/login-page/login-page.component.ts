import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { supabase } from '../../supabase';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  rows: any[] = [];
  email: string = '';
  password: string = '';

  constructor(
    public navigationService: NavigationService,
  ) { }

  ngOnInit(): void {
    this.fetchData();
  }

  async fetchData() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (user) {
      this.navigationService.navigate('schedules');
    } else if (error) {
      console.log('Not authenticated:', error);
    }
  }

  @ViewChild('emailInput') emailInput!: ElementRef<HTMLInputElement>;
  @ViewChild('passwordInput') passwordInput!: ElementRef<HTMLInputElement>;

  public async login() {
    const email = this.emailInput.nativeElement.value;
    const password = this.passwordInput.nativeElement.value;
    if (email && password) {
      let { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      }); 
    }
    const { data: { user }, error } = await supabase.auth.getUser();
    if (user) {
      console.log("Login success!");
      this.navigationService.navigate('schedules');
    } else {
      console.log("Bad Login", error);
    }
  }
}