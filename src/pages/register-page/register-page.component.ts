import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { supabase } from '../../supabase';

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
  ) { }

  public navigate( path: string ) {
    console.log("navigating to: ", path);
    this.router.navigate(['/' + path]);
  }

  public async signUp() {
    console.log('testing');
    let { data, error } = await supabase.auth.signUp({
      email: 'someone@email.com',
      password: 'EEECHFaMoeqXTiiKmWhG'
    })
  }
}