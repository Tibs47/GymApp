import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private router: Router) {}

  public navigate(path: string, value: string = '0') {
    if (value !== '0') {
      console.log("navigating to: ", path, "\nPassing: ", value);
      switch (value) {
        case 'registered':
          this.router.navigate(['/' + path, value]);
          break;
        default:
          break;
      }
    } else {
      console.log("Navigating to: ", path);
      this.router.navigate(['/' + path]);
    }
  }
}
