import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { supabase } from '../supabase';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'gym-schedule-app';
  rows: any[] = [];

  constructor() { }

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
}
