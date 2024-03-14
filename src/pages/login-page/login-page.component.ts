import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { supabase } from '../../supabase';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  rows: any[] = [];

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.fetchData();
  }

  async fetchData() {
    try {
      const { data, error } = await supabase.from('gymUsers').select('*');
      if (error) {
        throw error;
      }
      console.log('Fetched data:', data); // Log fetched data
      this.rows = data || [];
    } catch (error) {
      console.error('Error fetching data'); // Log error message
    }
  }

  public navigate( path: string ) {
    console.log("navigating to: ", path);
    this.router.navigate(['/' + path]);
  }
}