import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { supabase } from '../../supabase';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss'
})
export class RegisterPageComponent {
  constructor(
    private router: Router,
    public navigationService: NavigationService,
  ) { }

  email: string = '';
  password: string = '';

  @ViewChild('emailInput') emailInput!: ElementRef<HTMLInputElement>;
  @ViewChild('passwordInput') passwordInput!: ElementRef<HTMLInputElement>;
  @ViewChild('passwordInput') repeatPassword!: ElementRef<HTMLInputElement>;

  private checkEmail(email: string): boolean {
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Test if the email matches the regular expression
    return emailRegex.test(email);
  }

  public async signUp() {
    const email = this.emailInput.nativeElement.value;
    const password = this.passwordInput.nativeElement.value;
    const repeatPassword = this.repeatPassword.nativeElement.value;

    if (this.checkEmail(email) && password && repeatPassword && repeatPassword === password) {
      let { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      if (error) {
        console.log('Error signing up:', error.message)
      } else if (data) {
        console.log('User signed up successfully:', data);
        setTimeout(() => {
          this.navigationService.navigate('info', 'registered');
        }, 1000); // Wait for 1 second before navigating
      }
    } else if (!this.checkEmail(email)) {
      console.log('Email not valid!');
    } else if (repeatPassword != password) {
      console.log('Passwords do not match!');
    }
  }
  
}